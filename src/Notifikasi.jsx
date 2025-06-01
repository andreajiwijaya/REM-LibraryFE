import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBell, FaCheck, FaTrash, FaArrowLeft, FaSearch, FaRegBell } from 'react-icons/fa';
import "./index.css";

export default function Notifikasi() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Peminjaman Berhasil',
      message: 'Buku "Clean Code" berhasil dipinjam',
      time: '10 menit lalu',
      read: false,
      type: 'loan'
    },
    {
      id: 2,
      title: 'Pengembalian Terlambat',
      message: 'Buku "React for Beginners" harus dikembalikan hari ini',
      time: '1 jam lalu',
      read: false,
      type: 'return'
    },
    {
      id: 3,
      title: 'Pemberitahuan Sistem',
      message: 'Pemeliharaan sistem akan dilakukan besok pukul 00:00-03:00',
      time: '5 jam lalu',
      read: true,
      type: 'system'
    },
    {
      id: 4,
      title: 'Anggota Baru',
      message: 'Andi Setiawan telah bergabung sebagai anggota',
      time: '1 hari lalu',
      read: true,
      type: 'member'
    }
  ]);

  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Tandai notifikasi sebagai sudah dibaca
  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? {...notification, read: true} : notification
    ));
  };

  // Hapus notifikasi
  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  // Tandai semua sudah dibaca
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  // Filter notifikasi berdasarkan tab dan pencarian
  const filteredNotifications = notifications.filter(notification => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'unread' && !notification.read) ||
      (activeTab !== 'all' && activeTab !== 'unread' && notification.type === activeTab);

    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex-1 p-8 flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Link to="/" className="mr-4 p-2 rounded-full hover:bg-[#3e1f0d]/10">
            <FaArrowLeft className="text-[#3e1f0d]" />
          </Link>
          <h2 className="text-2xl font-bold text-[#3e1f0d] flex items-center">
            <FaBell className="mr-3" />
            Notifikasi
          </h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#3e1f0d]" />
            <input
              type="text"
              placeholder="Cari notifikasi..."
              className="pl-10 pr-4 py-2 rounded-full border border-[#3e1f0d]/30 focus:outline-none focus:ring-2 focus:ring-[#3e1f0d]/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={markAllAsRead}
            className="px-4 py-2 text-sm bg-[#3e1f0d] text-[#fff9e6] rounded-lg hover:bg-[#3e1f0d]/90"
          >
            Tandai Semua Dibaca
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-[#3e1f0d]/20 mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'all' ? 'text-[#3e1f0d] border-b-2 border-[#3e1f0d]' : 'text-gray-500'}`}
          onClick={() => setActiveTab('all')}
        >
          Semua
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'unread' ? 'text-[#3e1f0d] border-b-2 border-[#3e1f0d]' : 'text-gray-500'}`}
          onClick={() => setActiveTab('unread')}
        >
          Belum Dibaca
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'loan' ? 'text-[#3e1f0d] border-b-2 border-[#3e1f0d]' : 'text-gray-500'}`}
          onClick={() => setActiveTab('loan')}
        >
          Peminjaman
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'return' ? 'text-[#3e1f0d] border-b-2 border-[#3e1f0d]' : 'text-gray-500'}`}
          onClick={() => setActiveTab('return')}
        >
          Pengembalian
        </button>
      </div>

      {/* Daftar Notifikasi */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex-grow">
        {filteredNotifications.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {filteredNotifications.map(notification => (
              <li 
                key={notification.id} 
                className={`p-4 hover:bg-[#fff9e6] ${!notification.read ? 'bg-[#fff9e6]/50' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center">
                      {!notification.read && (
                        <span className="w-2 h-2 bg-[#3e1f0d] rounded-full mr-2"></span>
                      )}
                      <h3 className={`font-medium ${!notification.read ? 'text-[#3e1f0d]' : 'text-gray-700'}`}>
                        {notification.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                  </div>
                  <div className="flex space-x-2">
                    {!notification.read && (
                      <button 
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 text-[#3e1f0d] hover:bg-[#3e1f0d]/10 rounded-full"
                        title="Tandai sudah dibaca"
                      >
                        <FaCheck />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-full"
                      title="Hapus notifikasi"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center">
            <FaRegBell className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-500">
              {searchTerm ? 'Tidak ada notifikasi yang cocok' : 'Tidak ada notifikasi'}
            </h3>
            {activeTab === 'unread' && (
              <p className="text-sm text-gray-400 mt-2">Semua notifikasi telah dibaca</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
