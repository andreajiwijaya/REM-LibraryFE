import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaBook,
  FaUsers,
  FaHome,
  FaCalendarAlt,
  FaSignOutAlt,
  FaUserCircle,
} from 'react-icons/fa';
import './index.css';

function Layout({ children, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout(); // Perbarui status peran di App.jsx
    navigate('/signin');
  };

  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const currentDate = today.toLocaleDateString('id-ID', options);

  return (
    <div className="flex min-h-screen bg-[#fff9e6]">
      {/* Sidebar */}
      <div className="w-64 bg-[#3e1f0d] text-[#fff9e6] p-4 flex flex-col min-h-screen">
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
            <FaSignOutAlt className="mr-1 text-2xl" />
            Keluar
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold font-ancizar text-[#3e1f0d]">{currentDate}</h2>
          <div className="flex items-center space-x-4">
            {/* Profile */}
            <Link to="/profile-admin" className="p-2 rounded-full hover:bg-[#3e1f0d]/10">
              <FaUserCircle className="text-[#3e1f0d] text-3xl" />
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
  const stats = [
    { title: 'Total Buku', value: 1245, icon: <FaBook className="text-2xl" />, link: '/manajemen-buku' },
    { title: 'Anggota Aktif', value: 342, icon: <FaUsers className="text-2xl" />, link: '/manajemen-anggota' },
    { title: 'Peminjaman Hari Ini', value: 28, icon: <FaCalendarAlt className="text-2xl" />, link: '/pinjam' },
    { title: 'Pengembalian Hari Ini', value: 15, icon: <FaCalendarAlt className="text-2xl" />, link: '/kembalikan' },
  ];

  const recentActivities = [
    { id: 1, user: 'Andi Setiawan', action: 'Meminjam buku "Clean Code"', time: '10 menit lalu' },
    { id: 2, user: 'Budi Santoso', action: 'Mengembalikan buku "React for Beginners"', time: '25 menit lalu' },
    { id: 3, user: 'Citra Dewi', action: 'Memperpanjang pinjaman "JavaScript ES6"', time: '1 jam lalu' },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) =>
          stat.link ? (
            <Link
              key={stat.title}
              to={stat.link}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow block"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-[#3e1f0d] mt-2">{stat.value}</h3>
                </div>
                <div className="p-3 rounded-full bg-[#3e1f0d]/10 text-[#3e1f0d]">{stat.icon}</div>
              </div>
            </Link>
          ) : (
            <div
              key={stat.title}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-[#3e1f0d] mt-2">{stat.value}</h3>
                </div>
                <div className="p-3 rounded-full bg-[#3e1f0d]/10 text-[#3e1f0d]">{stat.icon}</div>
              </div>
            </div>
          )
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md flex-grow overflow-auto">
        <h3 className="text-xl font-semibold text-[#3e1f0d] mb-4">Aktivitas Terkini</h3>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-0"
            >
              <div>
                <p className="font-medium text-[#3e1f0d]">{activity.user}</p>
                <p className="text-gray-600">{activity.action}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
        <Link to="#" className="inline-block mt-4 text-[#3e1f0d] hover:underline">
          Lihat Semua
        </Link>
      </div>
    </>
  );
}

export default function HomePageWrapper({ onLogout }) {
  return (
    <Layout onLogout={onLogout}>
      <Home />
    </Layout>
  );
}
