import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBook, FaUsers, FaHome, FaCalendarAlt, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import './index.css';

function Layout({ children, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
    navigate('/signin');
  };

  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const currentDate = today.toLocaleDateString('id-ID', options);

  return (
    <div className="flex min-h-screen bg-[#fff9e6]">
      {/* Sidebar */}
      <div className="w-64 bg-[#2D1E17] text-[#fff9e6] p-4 flex flex-col min-h-screen">
        <div className="py-4 border-b border-[#fff9e6]/20">
          <h1 className="text-5xl text-center font-lancelot">Raema Perpustakaan Digital</h1>
        </div>

        <nav className="flex-1 py-18">
          <ul className="space-y-2">
            <li>
              <Link to="/" className="flex items-center p-3 rounded-lg hover:bg-[#fff9e6]/10">
                <FaHome className="mr-3 text-2xl" />
                Home
              </Link>
            </li>
            <li>
              <Link to="/manajemen-buku" className="flex items-center p-3 rounded-lg hover:bg-[#fff9e6]/10">
                <FaBook className="mr-3 text-2xl" />
                Manajemen Buku
              </Link>
            </li>
            <li>
              <Link to="/manajemen-anggota" className="flex items-center p-3 rounded-lg hover:bg-[#fff9e6]/10">
                <FaUsers className="mr-3 text-2xl" />
                Manajemen Anggota
              </Link>
            </li>
            <li>
              <Link to="/peminjaman" className="flex items-center p-3 rounded-lg hover:bg-[#fff9e6]/10">
                <FaCalendarAlt className="mr-3 text-2xl" />
                Peminjaman
              </Link>
            </li>
          </ul>
        </nav>

        <div className="mt-auto py-8 border-t border-[#fff9e6]/20">
          <button
            onClick={handleLogout}
            className="flex items-center p-1 rounded-lg hover:bg-[#fff9e6]/10 w-full text-left text-[#fff9e6]"
          >
            <FaSignOutAlt className="mr-3 text-2xl" />
            Keluar
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold font-ancizar text-[#2D1E17]">{currentDate}</h2>
          <div className="flex items-center space-x-4">
            {/* Profile */}
            <Link to="/profile-admin" className="p-2 rounded-full hover:bg-[#2D1E17]/10">
              <FaUserCircle className="text-[#2D1E17] text-3xl" />
            </Link>
          </div>
        </header>

        {/* Children Content */}
        {children}
      </div>
    </div>
  );
}

function Home() {
  const [stats, setStats] = useState([
    { title: 'Total Buku', value: 0, icon: <FaBook className="text-2xl" />, link: '/manajemen-buku' },
    { title: 'Anggota Aktif', value: 0, icon: <FaUsers className="text-2xl" />, link: '/manajemen-anggota' },
    { title: 'Total Peminjaman', value: 0, icon: <FaCalendarAlt className="text-2xl" />, link: '/peminjaman' },
    { title: 'Total Pengembalian', value: 0, icon: <FaCalendarAlt className="text-2xl" />, link: '/pengembalian' },
  ]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) return;

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const fetchTotalBooks = fetch('https://rem-library.up.railway.app/books?page=1&limit=1', { headers })
    .then(res => res.json())
    .then(data => {
      if (data?.meta?.total != null) return data.meta.total;
      if (Array.isArray(data)) return data.length;
      return 0;
    });

  const fetchUsers = fetch('https://rem-library.up.railway.app/users', { headers })
    .then(res => res.json())
    .then(data => {
      if (!data || !Array.isArray(data.data)) return 0;
      const activeUsers = data.data.filter(user => user.role === 'user');
      return activeUsers.length;
    });

  const fetchBorrows = fetch('https://rem-library.up.railway.app/borrows?page=1&limit=100', { headers })
    .then(res => res.json())
    .then(data => {
      const borrows = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
      const todayStr = new Date().toISOString().slice(0, 10);

      const borrowsToday = borrows.filter(b => b.borrowDate?.slice(0, 10) === todayStr).length;
      const returnsToday = borrows.filter(b => b.returnDate?.slice(0, 10) === todayStr).length;

      const recent = borrows
        .sort((a, b) => new Date(b.borrowDate) - new Date(a.borrowDate))
        .slice(0, 5)
        .map(borrow => ({
          id: borrow.id,
          user: borrow.user?.name || 'Unknown',
          action: borrow.returnDate && new Date(borrow.returnDate) <= new Date()
            ? `Mengembalikan buku "${borrow.book?.title || 'Unknown'}"`
            : `Meminjam buku "${borrow.book?.title || 'Unknown'}"`,
          time: borrow.borrowDate
            ? new Date(borrow.borrowDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
            : '',
        }));

      return { borrowsToday, returnsToday, recent };
    });

  Promise.all([fetchTotalBooks, fetchUsers, fetchBorrows])
    .then(([totalBooks, totalUsers, { borrowsToday, returnsToday, recent }]) => {
      setStats([
        { title: 'Total Buku', value: totalBooks, icon: <FaBook className="text-2xl" />, link: '/manajemen-buku' },
        { title: 'Anggota', value: totalUsers, icon: <FaUsers className="text-2xl" />, link: '/manajemen-anggota' },
        { title: 'Peminjaman Hari Ini', value: borrowsToday, icon: <FaCalendarAlt className="text-2xl" />, link: '/peminjaman' },
        { title: 'Pengembalian Hari Ini', value: returnsToday, icon: <FaCalendarAlt className="text-2xl" />, link: '/pengembalian' },
      ]);
      setRecentActivities(recent);
    })
    .catch(err => {
      console.error('Failed to fetch dashboard data:', err);
    });
}, []);


  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.title}
            to={stat.link}
            className="bg-[#fefefe] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow block"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500">{stat.title}</p>
                <h3 className="text-3xl font-bold text-[#2D1E17] mt-2">{stat.value}</h3>
              </div>
              <div className="p-3 rounded-full bg-[#2D1E17]/10 text-[#2D1E17]">{stat.icon}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md flex-grow overflow-auto">
        <h3 className="text-xl font-semibold text-[#2D1E17] mb-4">Aktivitas Terkini</h3>
        <div className="space-y-4">
          {recentActivities.length === 0 ? (
            <p className="text-gray-500">Tidak ada aktivitas terkini.</p>
          ) : (
            recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-0"
              >
                <div>
                  <p className="font-medium text-[#2D1E17]">{activity.user}</p>
                  <p className="text-gray-600">{activity.action}</p>
                </div>
                <span className="text-sm text-gray-400">{activity.time}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default function DashboardAdmin({ onLogout }) {
  return (
    <Layout onLogout={onLogout}>
      <Home />
    </Layout>
  );
}
