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
    <div className="flex min-h-screen bg-gradient-to-br from-[#fff9e6] to-[#fef7e0]">
      {/* Sidebar */}
      <div className="w-72 bg-gradient-to-b from-[#2D1E17] to-[#1a0f0a] text-[#fff9e6] flex flex-col min-h-screen shadow-2xl">
        <div className="p-8 border-b border-[#fff9e6]/10">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#fff9e6]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <FaBook className="text-3xl text-[#fff9e6]" />
            </div>
            <h1 className="text-2xl font-bold tracking-wide">Raema</h1>
            <p className="text-[#fff9e6]/70 text-sm mt-1">Perpustakaan Digital</p>
          </div>
        </div>

        <nav className="flex-1 p-6">
          <ul className="space-y-3">
            <li>
              <Link to="/admin/dashboard" className="flex items-center p-4 rounded-xl hover:bg-[#fff9e6]/10 transition-all duration-200 group">
                <div className="w-10 h-10 bg-[#fff9e6]/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-[#fff9e6]/20 transition-all">
                  <FaHome className="text-lg" />
                </div>
                <span className="font-medium">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/manajemen-buku" className="flex items-center p-4 rounded-xl hover:bg-[#fff9e6]/10 transition-all duration-200 group">
                <div className="w-10 h-10 bg-[#fff9e6]/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-[#fff9e6]/20 transition-all">
                  <FaBook className="text-lg" />
                </div>
                <span className="font-medium">Manajemen Buku</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/manajemen-anggota" className="flex items-center p-4 rounded-xl hover:bg-[#fff9e6]/10 transition-all duration-200 group">
                <div className="w-10 h-10 bg-[#fff9e6]/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-[#fff9e6]/20 transition-all">
                  <FaUsers className="text-lg" />
                </div>
                <span className="font-medium">Manajemen Anggota</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/peminjaman" className="flex items-center p-4 rounded-xl hover:bg-[#fff9e6]/10 transition-all duration-200 group">
                <div className="w-10 h-10 bg-[#fff9e6]/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-[#fff9e6]/20 transition-all">
                  <FaCalendarAlt className="text-lg" />
                </div>
                <span className="font-medium">Manajemen Peminjaman</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-6 border-t border-[#fff9e6]/10">
          <button
            onClick={handleLogout}
            className="flex items-center p-4 rounded-xl hover:bg-red-500/10 w-full text-left transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-red-500/20 transition-all">
              <FaSignOutAlt className="text-lg text-red-400" />
            </div>
            <span className="font-medium text-red-400">Keluar</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-[#2D1E17] mb-1">Dashboard</h2>
            <p className="text-[#2D1E17]/60 font-medium">{currentDate}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/admin/profile" className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-xl hover:bg-white transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl">
              <FaUserCircle className="text-[#2D1E17] text-2xl" />
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
    { title: 'Total Buku', value: 0, icon: <FaBook className="text-2xl" />, link: '/admin/manajemen-buku', color: 'from-blue-500 to-blue-600' },
    { title: 'Anggota', value: 0, icon: <FaUsers className="text-2xl" />, link: '/admin/manajemen-anggota', color: 'from-green-500 to-green-600' },
    { title: 'Peminjaman Hari Ini', value: 0, icon: <FaCalendarAlt className="text-2xl" />, link: '/admin/pinjam', color: 'from-orange-500 to-orange-600' },
    { title: 'Pengembalian Hari ini', value: 0, icon: <FaCalendarAlt className="text-2xl" />, link: '/admin/pengembalian', color: 'from-purple-500 to-purple-600' },
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
        { title: 'Total Buku', value: totalBooks, icon: <FaBook className="text-2xl" />, link: '/admin/manajemen-buku', color: 'from-blue-500 to-blue-600' },
        { title: 'Anggota', value: totalUsers, icon: <FaUsers className="text-2xl" />, link: '/admin/manajemen-anggota', color: 'from-green-500 to-green-600' },
        { title: 'Peminjaman', value: borrowsToday, icon: <FaCalendarAlt className="text-2xl" />, link: '/admin/pinjam', color: 'from-orange-500 to-orange-600' },
        { title: 'Pengembalian', value: returnsToday, icon: <FaCalendarAlt className="text-2xl" />, link: '/admin/pengembalian', color: 'from-purple-500 to-purple-600' },
      ]);
      setRecentActivities(recent);
    })
    .catch(err => {
      console.error('Failed to fetch dashboard data:', err);
    });
}, []);


  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <Link
            key={stat.title}
            to={stat.link}
            className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-14 h-14 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                  {stat.icon}
                </div>
                <div className="text-right">
                  <h3 className="text-3xl font-bold text-[#2D1E17] mb-1 group-hover:scale-110 transition-transform duration-200">{stat.value}</h3>
                </div>
              </div>
              <p className="text-[#2D1E17]/60 font-medium text-sm uppercase tracking-wide">{stat.title}</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 flex-grow">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-[#2D1E17]">Aktivitas Terkini</h3>
          <div className="w-8 h-8 bg-gradient-to-r from-[#2D1E17] to-[#1a0f0a] rounded-lg flex items-center justify-center">
            <FaCalendarAlt className="text-white text-sm" />
          </div>
        </div>
        
        <div className="space-y-6">
          {recentActivities.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#2D1E17]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCalendarAlt className="text-2xl text-[#2D1E17]/40" />
              </div>
              <p className="text-[#2D1E17]/60 font-medium">Tidak ada aktivitas terkini</p>
            </div>
          ) : (
            recentActivities.map((activity, index) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-5 bg-gradient-to-r from-[#fff9e6]/50 to-transparent rounded-xl border border-[#2D1E17]/10 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#2D1E17] to-[#1a0f0a] rounded-xl flex items-center justify-center text-white font-bold">
                    {activity.user.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-[#2D1E17] mb-1">{activity.user}</p>
                    <p className="text-[#2D1E17]/70 text-sm">{activity.action}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-[#2D1E17]/60 bg-[#2D1E17]/5 px-3 py-1 rounded-full">
                    {activity.time}
                  </span>
                </div>
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