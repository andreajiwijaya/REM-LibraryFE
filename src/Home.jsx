import React from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaUsers, FaCalendarAlt, FaChartLine } from 'react-icons/fa';
import "./index.css";

export default function Home() {
  const stats = [
    { title: 'Total Buku', value: 1245, icon: <FaBook className="text-2xl" />, link: '/manajemen-buku' },
    { title: 'Anggota Aktif', value: 342, icon: <FaUsers className="text-2xl" />, link: '/manajemen-anggota' },
    { title: 'Peminjaman Hari Ini', value: 28, icon: <FaCalendarAlt className="text-2xl" />, link: '/peminjaman-hari-ini' },
    { title: 'Pengembalian Hari Ini', value: 15, icon: <FaChartLine className="text-2xl" />, link: '/pengembalian-hari-ini' }
  ];

  const recentActivities = [
    { id: 1, user: 'Andi Setiawan', action: 'Meminjam buku "Clean Code"', time: '10 menit lalu' },
    { id: 2, user: 'Budi Santoso', action: 'Mengembalikan buku "React for Beginners"', time: '25 menit lalu' },
    { id: 3, user: 'Citra Dewi', action: 'Memperpanjang pinjaman "JavaScript ES6"', time: '1 jam lalu' }
  ];

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map(stat => (
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
                <div className="p-3 rounded-full bg-[#3e1f0d]/10 text-[#3e1f0d]">
                  {stat.icon}
                </div>
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
                <div className="p-3 rounded-full bg-[#3e1f0d]/10 text-[#3e1f0d]">
                  {stat.icon}
                </div>
              </div>
            </div>
          )
        ))}
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-6 rounded-lg shadow-md flex-grow overflow-auto">
        <h3 className="text-xl font-semibold text-[#3e1f0d] mb-4">Aktivitas Terkini</h3>
        <div className="space-y-4">
          {recentActivities.map(activity => (
            <div key={activity.id} className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-medium text-[#3e1f0d]">{activity.user}</p>
                <p className="text-gray-600">{activity.action}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
        <Link to="#" className="inline-block mt-4 text-[#3e1f0d] hover:underline">Lihat Semua</Link>
      </div>
    </>
  );
}
