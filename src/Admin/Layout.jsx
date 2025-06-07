import React from 'react';
import { Link } from 'react-router-dom';
import {FaBook,FaUsers,FaHome,FaChartLine,FaCalendarAlt,FaSearch,FaBell,FaSignOutAlt,FaUserCircle,} from 'react-icons/fa';
import "./index.css";

export default function Layout({ children, hasNotification }) {
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const currentDate = today.toLocaleDateString('id-ID', options);

  return (
    <div className="flex min-h-screen bg-[#fff9e6]">
      {/* Sidebar */}
      <div className="w-64 bg-[#3e1f0d] text-[#fff9e6] p-4 flex flex-col min-h-screen">
        <div className="py-4 border-b border-[#fff9e6]/20">
          <h1 className="text-5xl  text-center font-lancelot">Raema Perpustakaan Digital</h1>
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
          <Link to="/logout" className="flex items-center p-1 rounded-lg hover:bg-[#fff9e6]/10">
            <FaSignOutAlt className="mr-1 text-2xl" />
            Keluar
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold font-ancizar text-[#3e1f0d]">{currentDate}</h2>
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#fff9e6]" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-full border bg-[#3e1f0d] text-[#fff9e6] focus:outline-none focus:ring-3 focus:ring-[#fff9e6]"
              />
            </div>

            {/* Notification */}
            <Link to="/notifikasi" className="relative p-2 text-2xl rounded-full hover:bg-[#3e1f0d]/10">
              <FaBell className="text-[#3e1f0d]" />
              {hasNotification && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-[#fff9e6]"></span>
              )}
            </Link>

            {/* Profile */}
            <Link to="/profile" className="p-2 rounded-full hover:bg-[#3e1f0d]/10">
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
