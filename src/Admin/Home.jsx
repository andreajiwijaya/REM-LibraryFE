import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBook, FaUsers, FaHome, FaCalendarAlt, FaSignOutAlt, FaUserCircle, FaExclamationTriangle, FaClock, FaBars, FaTimes } from 'react-icons/fa';

// Layout Component (Sidebar & Main Area)
function Layout({ children, onLogout }) {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State untuk sidebar di mobile

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (typeof onLogout === 'function') {
        onLogout();
    }
    navigate('/signin');
  };

  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const currentDate = today.toLocaleDateString('id-ID', options);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#fff9e6] to-[#fef7e0]">
      {/* Overlay untuk mobile saat sidebar terbuka */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`w-72 bg-gradient-to-b from-[#2D1E17] to-[#1a0f0a] text-[#fff9e6] flex flex-col min-h-screen shadow-2xl fixed lg:relative inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-50`}>
        <div className="p-8 border-b border-[#fff9e6]/10 flex justify-between items-center">
          <div className="text-center w-full">
            <div className="w-16 h-16 bg-[#fff9e6]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <FaBook className="text-3xl text-[#fff9e6]" />
            </div>
            <h1 className="text-2xl font-bold tracking-wide">Raema</h1>
            <p className="text-[#fff9e6]/70 text-sm mt-1">Perpustakaan Digital</p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden absolute top-4 right-4 p-2">
              <FaTimes className="text-2xl text-white/70"/>
          </button>
        </div>

        <nav className="flex-1 p-6">
          <ul className="space-y-3">
            <li><NavLink to="/admin/dashboard" icon={<FaHome />} label="Dashboard" /></li>
            <li><NavLink to="/admin/manajemen-buku" icon={<FaBook />} label="Manajemen Buku" /></li>
            <li><NavLink to="/admin/manajemen-anggota" icon={<FaUsers />} label="Manajemen Anggota" /></li>
            <li><NavLink to="/admin/peminjaman" icon={<FaClock />} label="Manajemen Peminjaman" /></li>
            <li><NavLink to="/admin/pengembalian" icon={<FaCalendarAlt />} label="Manajemen Pengembalian" /></li>
          </ul>
        </nav>

        <div className="p-6 border-t border-[#fff9e6]/10">
          <button onClick={handleLogout} className="flex items-center p-4 rounded-xl hover:bg-red-500/10 w-full text-left transition-all duration-200 group">
            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-red-500/20 transition-all">
              <FaSignOutAlt className="text-lg text-red-400" />
            </div>
            <span className="font-medium text-red-400">Keluar</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-8 flex flex-col min-h-screen">
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center">
            {/* Tombol Hamburger untuk Mobile */}
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 mr-4 text-2xl text-[#2D1E17]">
                <FaBars />
            </button>
            <div>
              <h2 className="text-xl sm:text-3xl font-bold text-[#2D1E17] mb-1">Dashboard</h2>
              <p className="text-sm sm:text-base text-[#2D1E17]/60 font-medium">{currentDate}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/admin/profile" className="w-10 h-10 sm:w-12 sm:h-12 bg-white/80 backdrop-blur-sm rounded-xl hover:bg-white transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl">
              <FaUserCircle className="text-[#2D1E17] text-xl sm:text-2xl" />
            </Link>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}

// NavLink Helper Component
function NavLink({ to, icon, label }) {
    return (
        <Link to={to} className="flex items-center p-4 rounded-xl hover:bg-[#fff9e6]/10 transition-all duration-200 group">
            <div className="w-10 h-10 bg-[#fff9e6]/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-[#fff9e6]/20 transition-all">
                {React.cloneElement(icon, { className: "text-lg" })}
            </div>
            <span className="font-medium">{label}</span>
        </Link>
    );
}

// Home Component (Dashboard Content)
function Home() {
  const [stats, setStats] = useState([
    { title: 'Total Buku', value: 0, icon: <FaBook className="text-2xl" />, link: '/admin/manajemen-buku', color: 'from-blue-500 to-blue-600' },
    { title: 'Anggota Aktif', value: 0, icon: <FaUsers className="text-2xl" />, link: '/admin/manajemen-anggota', color: 'from-green-500 to-green-600' },
    { title: 'Peminjaman Aktif', value: 0, icon: <FaClock className="text-2xl" />, link: '/admin/peminjaman', color: 'from-orange-500 to-orange-600' },
    { title: 'Buku Terlambat', value: 0, icon: <FaExclamationTriangle className="text-2xl" />, link: '/admin/peminjaman?status=Terlambat', color: 'from-red-500 to-red-600' },
  ]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
      try {
        const [booksRes, usersRes, activeBorrowsRes, overdueBorrowsRes, recentBorrowsRes] = await Promise.all([
          fetch('https://rem-library.up.railway.app/books?limit=1', { headers }),
          fetch('https://rem-library.up.railway.app/users', { headers }),
          fetch('https://rem-library.up.railway.app/borrows?status=Dipinjam&limit=1', { headers }),
          fetch('https://rem-library.up.railway.app/borrows/overdue', { headers }),
          fetch('https://rem-library.up.railway.app/borrows?limit=5', { headers }),
        ]);

        const booksData = await booksRes.json();
        const usersData = await usersRes.json();
        const activeBorrowsData = await activeBorrowsRes.json();
        const overdueBorrowsData = await overdueBorrowsRes.json();
        const recentBorrowsData = await recentBorrowsRes.json();

        // Proses data untuk statistik
        const totalBooks = booksData?.meta?.total ?? 0;
        const totalUsers = usersData?.data?.filter(u => u.role === 'user').length ?? 0;
        const totalActiveBorrows = activeBorrowsData?.meta?.total ?? 0;
        const totalOverdue = Array.isArray(overdueBorrowsData) ? overdueBorrowsData.length : 0;
        
        setStats([
            { ...stats[0], value: totalBooks },
            { ...stats[1], value: totalUsers },
            { ...stats[2], value: totalActiveBorrows },
            { ...stats[3], value: totalOverdue },
        ]);

        // Proses data untuk aktivitas terkini
        const recent = (recentBorrowsData?.data ?? []).map(borrow => ({
            id: borrow.id,
            user: borrow.user?.username || 'Unknown',
            action: `Meminjam buku "${borrow.book?.title || 'Unknown'}"`,
            time: new Date(borrow.borrowDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        }));
        setRecentActivities(recent);

      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // Dependensi kosong agar hanya berjalan sekali

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <Link key={stat.title} to={stat.link} className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-14 h-14 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                  {stat.icon}
                </div>
                <div className="text-right">
                  <h3 className="text-3xl font-bold text-[#2D1E17] mb-1 group-hover:scale-110 transition-transform duration-200">
                    {loading ? '...' : stat.value}
                  </h3>
                </div>
              </div>
              <p className="text-[#2D1E17]/60 font-medium text-sm uppercase tracking-wide">{stat.title}</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 flex-grow">
        <h3 className="text-xl sm:text-2xl font-bold text-[#2D1E17] mb-8">Aktivitas Peminjaman Terkini</h3>
        <div className="space-y-6">
          {loading ? (
            <p className="text-center text-gray-500">Memuat aktivitas...</p>
          ) : recentActivities.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#2D1E17]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCalendarAlt className="text-2xl text-[#2D1E17]/40" />
              </div>
              <p className="text-[#2D1E17]/60 font-medium">Tidak ada aktivitas terkini</p>
            </div>
          ) : (
            recentActivities.map((activity) => (
              <div key={activity.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-gradient-to-r from-[#fff9e6]/50 to-transparent rounded-xl border border-[#2D1E17]/10 hover:shadow-md transition-all duration-200">
                <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#2D1E17] to-[#1a0f0a] rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                    {activity.user.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-[#2D1E17] mb-1">{activity.user}</p>
                    <p className="text-[#2D1E17]/70 text-sm">{activity.action}</p>
                  </div>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto">
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

// Main Component Export
export default function DashboardAdmin({ onLogout }) {
  return (
    <Layout onLogout={onLogout}>
      <Home />
    </Layout>
  );
}