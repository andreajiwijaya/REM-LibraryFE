import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
// Perbaikan: Menambahkan kembali FaBook ke impor dari react-icons/fa
import { FaUser, FaHome, FaBook } from "react-icons/fa";
import { Menu, X, Bell, LogOut, BookCheck, Mail, Facebook, Twitter, Instagram, Shield, Loader2, Library } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

function Dashboard({ onLogout }) {
  const today = new Date();
  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(today);

  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // State untuk ulasan (tetap lokal sampai reviewRoute backend diperbaiki) - Modal akan dihapus
  const [reviews, setReviews] = useState({});
  const [selectedBookForReview, setSelectedBookForReview] = useState(null); // This will no longer be used for the modal

  // State untuk data pengguna
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState(null);

  // State untuk buku yang dipinjam
  const [myBorrowsCount, setMyBorrowsCount] = useState(0);
  const [loadingMyBorrows, setLoadingMyBorrows] = useState(true);
  const [myBorrowsError, setMyBorrowsError] = useState(null); // <-- Ditambahkan: State untuk error buku dipinjam


  const token = localStorage.getItem("token"); // Dapatkan token dari localStorage

  // Fungsi untuk menampilkan kotak pesan kustom (pengganti alert)
  const showMessageBox = (title, message) => {
    const messageBox = document.createElement('div');
    messageBox.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    messageBox.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        <p class="text-lg font-semibold ${title === "Error" ? "text-red-600" : "text-green-600"} mb-4">${title}</p>
        <p class="text-gray-700 mb-6">${message}</p>
        <button id="closeMessageBox" class="px-4 py-2 bg-[#4a2515] text-white rounded-md hover:bg-[#3e1f0d] transition-colors">Tutup</button>
      </div>
    `;
    document.body.appendChild(messageBox);

    document.getElementById('closeMessageBox').onclick = () => {
      document.body.removeChild(messageBox);
    };
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    if (typeof onLogout === 'function') {
      onLogout();
    } else {
      console.warn("onLogout prop is not a function or not provided.");
    }
    navigate("/signin");
  }, [navigate, onLogout]);

  // Effect untuk mengambil data pengguna saat komponen dimuat
  useEffect(() => {
    const fetchUserData = async () => {
      setLoadingUser(true);
      setUserError(null);
      try {
        const res = await fetch(`https://rem-library.up.railway.app/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          handleLogout();
          showMessageBox("Sesi Kadaluarsa", "Sesi Anda telah berakhir. Mohon masuk kembali.");
          return;
        }

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Gagal mengambil data pengguna");
        }

        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.error("Fetch user data error:", err);
        setUserError(err.message);
        showMessageBox("Error", `Gagal mengambil data pengguna: ${err.message}`);
      } finally {
        setLoadingUser(false);
      }
    };

    if (token) {
      fetchUserData();
    } else {
      setLoadingUser(false);
      showMessageBox("Peringatan", "Anda tidak terautentikasi. Mohon masuk.");
      navigate("/signin");
    }
  }, [token, handleLogout, navigate]);


  // Fungsi untuk mengambil jumlah buku yang dipinjam oleh user
  useEffect(() => {
    const fetchMyBorrowsCount = async () => {
      setLoadingMyBorrows(true);
      setMyBorrowsError(null); // <-- Ditambahkan: Reset error state
      try {
        const res = await fetch(`https://rem-library.up.railway.app/borrows/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          handleLogout();
          return;
        }

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Gagal mengambil buku yang dipinjam");
        }

        const data = await res.json();
        setMyBorrowsCount(data.length || 0);
      } catch (err) {
        console.error("Fetch my borrows error:", err);
        setMyBorrowsError(err.message); // <-- Ditambahkan: Set error state
        // showMessageBox("Error", `Gagal mengambil jumlah buku dipinjam: ${err.message}`); // Mungkin terlalu sering muncul
      } finally {
        setLoadingMyBorrows(false);
      }
    };

    if (token) {
      fetchMyBorrowsCount();
    }
  }, [token, handleLogout]);


  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleNotif = () => setIsNotifOpen(!isNotifOpen);

  const notifications = [
    "Update buku terbaru: Cantik Itu Luka",
    "Pengumuman: Libur nasional",
    "Perpustakaan tutup jam 5 sore",
  ];

  const sidebarItems = [
    { label: "Home", path: "/dashboard", icon: <FaHome size={25} /> },
    { label: "Pinjam Sekarang", path: "/user/buku", icon: <FaBook size={20} /> },
    { label: "Buku Dipinjam", path: "/user/buku-dipinjam", icon: <BookCheck size={23} /> },
    { label: "Profil", path: "/user/profil", icon: <FaUser size={20} /> },
  ];

  // Tampilkan loading state atau error jika diperlukan
  if (loadingUser || loadingMyBorrows) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fefae0]">
        <div className="text-center text-[#2D1E17]">
          <Loader2 size={40} className="animate-spin mx-auto mb-4" /> {/* Animated loader */}
          <p className="text-lg font-semibold">Memuat data...</p>
        </div>
      </div>
    );
  }

  // Perbaiki kondisi error
  if (userError || myBorrowsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fefae0] text-red-600">
        <div className="text-center">
          <p className="text-lg font-semibold">Error: {userError || myBorrowsError}</p> {/* Gunakan myBorrowsError */}
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#4a2515] text-white rounded-md hover:bg-[#3e1f0d]"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[#fefae0] via-[#fcf7e8] to-[#faf4e0] text-[#2e2e2e]">
      {/* Font CDN Link - Pertimbangkan untuk menghapus jika error terus */}
      {/* <link href="https://fonts.cdnfonts.com/css/ancizar-serif" rel="stylesheet" /> */}
      {/* Atau coba memuat secara lokal jika tidak memungkinkan dari CDN */}

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-40 top-0 left-0 h-full w-[270px] bg-gradient-to-b from-[#2D1E17] via-[#2D1E17] to-[#2D1E17] text-[#fefae0] p-6 flex flex-col transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 shadow-2xl ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="text-center mb-8 hidden md:block">
          <div className="text-5xl mb-2 text-[#fefae0] drop-shadow-lg font-lancelot">Raema Perpustakaan Digital</div>
          <div className="border-t border-[#fefae0]/20 w-full my-4"></div>
        </div>

        <ul className="list-none space-y-3 mt-4 flex-1">
          {sidebarItems.map((item, index) => (
            <motion.li
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 group hover:scale-105 hover:shadow-lg hover:bg-gradient-to-r hover:from-[#5a1616] hover:to-[#6b1e1e]"
              onClick={() => {
                navigate(item.path);
                setIsSidebarOpen(false);
              }}
            >
              <div className="group-hover:scale-110 transition-transform duration-200">
                {item.icon}
              </div>
              <span className="text-1xl">{item.label}</span>
            </motion.li>
          ))}
        </ul>

        <div className="mt-auto pt-6 border-t border-[#fefae0]/20">
          <button
            onClick={() => {
              handleLogout(); // Gunakan fungsi handleLogout yang sudah ada
            }}
            className="flex items-center gap-3 w-full text-sm px-3 py-3 rounded-xl hover:bg-gradient-to-r hover:from-[#5a1616] hover:to-[#6b1e1e] transition-all duration-300 group hover:scale-105"
          >
            <LogOut size={25} className="group-hover:scale-110 transition-transform duration-200" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Bar with Calendar and Notification */}
        <div className="p-4 flex justify-between items-center">
          <div
            style={{ fontFamily: "'Ancizar Serif', serif" }}
            className="text-lg md:text-xl font-bold text-[#2D1E17] px-5 py-3 "
          >
            {formattedDate}
          </div>
          <div className="relative">
            <button
              onClick={toggleNotif}
              className="p-3 rounded-full hover:bg-[#2D1E17]/70 hover:bg-opacity-20 transition-colors relative"
            >
              <Bell size={20} className="text-[#2D1E17]" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </button>
            {isNotifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
              >
                <div className="p-3 bg-gradient-to-r from-[#2D1E17] to-[#2D1E17] text-white">
                  <h4 className="font-semibold text-sm">Notifikasi</h4>
                </div>
                <ul className="max-h-48 overflow-y-auto">
                  {notifications.map((note, idx) => (
                    <li
                      key={idx}
                      className="px-4 py-3 text-sm text-gray-700 border-b last:border-b-0 hover:bg-gradient-to-r hover:from-[#ffd600] hover:from-opacity-10 hover:to-transparent cursor-pointer transition-all duration-200"
                      onClick={() => showMessageBox("Notifikasi", `Anda mengklik notifikasi: "${note}"`)} // Ganti alert dengan showMessageBox
                    >
                      {note}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 md:p-8 flex-1"
        >
          {/* User Welcome Section - Menampilkan nama pengguna */}
          <section className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-between">
            <h3 className="text-[#2D1E17] text-2xl font-bold">
              Selamat Datang, {userData ? userData.username : "Pengguna"}!
            </h3>
            {userData && (
              <div className="inline-flex items-center gap-2 bg-[#4a2515] px-4 py-2 rounded-full shadow-inner text-[#fefae0]">
                <Shield size={16} className="text-[#fefae0]" />
                <span className="text-sm font-medium capitalize">
                  {userData.role}
                </span>
              </div>
            )}
          </section>

          {/* User Stats Section */}
          <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4 border border-gray-100"
            >
              <div className="bg-[#e8d2ac] p-4 rounded-full">
                <Library size={30} className="text-[#2D1E17]" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-[#2D1E17]">
                  {myBorrowsCount}
                </h4>
                <p className="text-gray-600">Buku Sedang Dipinjam</p>
              </div>
            </motion.div>
          </section>
        </motion.main>

        {/* Footer */}
        <footer className="mt-auto bg-white text-[#2D1E17] p-8 border-t border-gray-200">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              </div>
              
            <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm opacity-80">
              <p>&copy; {new Date().getFullYear()} Raema Perpustakaan Digital. Semua hak cipta dilindungi.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Dashboard;
