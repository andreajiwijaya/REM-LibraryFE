import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaHome, FaBook } from "react-icons/fa";
import { Menu, X, Bell, LogOut, BookCheck, Mail, Facebook, Twitter, Instagram, Shield, Loader2, Library, Heart, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Komponen Modal Konfirmasi
function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full text-center"
      >
        <p className="text-xl font-bold text-red-600 mb-4">{title}</p>
        <p className="text-gray-700 mb-8">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Hapus
          </button>
        </div>
      </motion.div>
    </div>
  );
}

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

  // State untuk data pengguna
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState(null);

  // State untuk buku yang dipinjam
  const [myBorrowsCount, setMyBorrowsCount] = useState(0);
  const [loadingMyBorrows, setLoadingMyBorrows] = useState(true);
  const [myBorrowsError, setMyBorrowsError] = useState(null);

  // [EDITED] State untuk menyimpan seluruh objek favorit, bukan hanya buku
  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [favoritesError, setFavoritesError] = useState(null);

  // State untuk proses hapus favorit
  const [isDeletingFavorite, setIsDeletingFavorite] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  // [EDITED] Mengganti nama state agar lebih jelas, menyimpan objek favorit yang akan dihapus
  const [favoriteToDelete, setFavoriteToDelete] = useState(null);

  const token = localStorage.getItem("token");

  // Fungsi untuk menampilkan kotak pesan kustom
  const showMessageBox = (title, message) => {
    if (document.getElementById('customMessageBox')) return;

    const messageBox = document.createElement('div');
    messageBox.id = 'customMessageBox';
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
    }
    navigate("/signin");
  }, [navigate, onLogout]);

  // Effect untuk mengambil data pengguna
  useEffect(() => {
    const fetchUserData = async () => {
      setLoadingUser(true);
      setUserError(null);
      try {
        const res = await fetch(`https://rem-library.up.railway.app/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
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
      } finally {
        setLoadingUser(false);
      }
    };

    if (token) {
      fetchUserData();
    } else {
      setLoadingUser(false);
      navigate("/signin");
    }
  }, [token, handleLogout, navigate]);

  // Effect untuk mengambil data pinjaman
  useEffect(() => {
    const fetchMyBorrowsData = async () => {
      setLoadingMyBorrows(true);
      setMyBorrowsError(null);
      try {
        const res = await fetch(`https://rem-library.up.railway.app/borrows/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          handleLogout();
          return;
        }

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Gagal mengambil data pinjaman");
        }

        const data = await res.json();
        setMyBorrowsCount(
  Array.isArray(data)
    ? data.filter(item => item.status === "dipinjam").length
    : 0
);
      } catch (err) {
        console.error("Fetch my borrows data error:", err);
        setMyBorrowsError(err.message);
      } finally {
        setLoadingMyBorrows(false);
      }
    };

    if (token) {
      fetchMyBorrowsData();
    } else {
      setLoadingMyBorrows(false);
    }
  }, [token, handleLogout]);

  // Effect untuk mengambil buku favorit
  useEffect(() => {
    if (!userData || !userData.id || !token) {
      setLoadingFavorites(false);
      return;
    }

    const fetchFavoriteBooks = async () => {
      setLoadingFavorites(true);
      setFavoritesError(null);
      try {
        const res = await fetch(`https://rem-library.up.railway.app/favorites/user/${userData.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          handleLogout();
          return;
        }

        if (!res.ok) {
          if (res.status === 404) {
            setFavorites([]); // [EDITED]
            return;
          }
          const errorData = await res.json();
          throw new Error(errorData.message || "Gagal mengambil buku favorit");
        }

        const data = await res.json();
        // [EDITED] Simpan seluruh objek favorit, bukan hanya `fav.book`
        setFavorites(Array.isArray(data.data) ? data.data.filter(fav => fav.book) : []);
      } catch (err) {
        console.error("Fetch favorite books error:", err);
        setFavoritesError(err.message);
      } finally {
        setLoadingFavorites(false);
      }
    };

    fetchFavoriteBooks();
  }, [userData, token, handleLogout]);

  // [EDITED] Fungsi untuk menghapus buku dari favorit berdasarkan ID favorit
  const handleDeleteFavorite = async () => {
    if (!favoriteToDelete) return; // [EDITED]
    setIsDeletingFavorite(true);

    try {
      // [EDITED] Menggunakan favoriteToDelete.id yang merupakan ID dari record favorit itu sendiri
      const res = await fetch(`https://rem-library.up.railway.app/favorites/${favoriteToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        handleLogout();
        showMessageBox("Sesi Kadaluarsa", "Sesi Anda telah berakhir. Mohon masuk kembali.");
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal menghapus favorit');
      }

      // [EDITED] Hapus item dari state favorites berdasarkan favorite.id
      setFavorites(prevFavorites => prevFavorites.filter(fav => fav.id !== favoriteToDelete.id));
      // [EDITED] Mengakses judul buku dari dalam objek favoriteToDelete
      showMessageBox("Berhasil", `Buku "${favoriteToDelete.book.title}" telah dihapus dari favorit.`);

    } catch (err) {
      console.error("Delete favorite error:", err);
      showMessageBox("Error", err.message || "Terjadi kesalahan saat menghapus favorit.");
    } finally {
      setIsDeletingFavorite(false);
      setShowConfirmation(false);
      setFavoriteToDelete(null); // [EDITED]
    }
  };

  // [EDITED] Fungsi untuk membuka modal konfirmasi, menerima seluruh objek favorit
  const openConfirmationModal = (favorite) => {
    setFavoriteToDelete(favorite); // [EDITED]
    setShowConfirmation(true);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleNotif = () => setIsNotifOpen(!isNotifOpen);

  const notifications = [
    "Update buku terbaru: Cantik Itu Luka",
    "Pengumuman: Libur nasional",
    "Perpustakaan tutup jam 5 sore",
  ];

  const sidebarItems = [
    { label: "Home", path: "/dashboard", icon: <FaHome size={25} /> },
    { label: "Daftar Buku", path: "/user/buku", icon: <FaBook size={20} /> },
    { label: "Buku Dipinjam", path: "/user/buku-dipinjam", icon: <BookCheck size={23} /> },
    { label: "Profile", path: "/user/profil", icon: <FaUser size={20} /> },
  ];

  if (loadingUser || loadingMyBorrows || loadingFavorites) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fefae0]">
        <div className="text-center text-[#2D1E17]">
          <Loader2 size={40} className="animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (userError || myBorrowsError || favoritesError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fefae0] text-red-600">
        <div className="text-center">
          <p className="text-lg font-semibold">Error: {userError || myBorrowsError || favoritesError}</p>
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
    <>
      {/* [EDITED] Render Modal Konfirmasi dengan pesan yang dinamis */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleDeleteFavorite}
        title="Konfirmasi Hapus"
        message={`Apakah Anda yakin ingin menghapus "${favoriteToDelete?.book?.title}" dari daftar favorit Anda?`}
      />

      <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[#fefae0] via-[#fcf7e8] to-[#faf4e0] text-[#2e2e2e]">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed z-40 top-0 left-0 h-full w-[270px] bg-gradient-to-b from-[#2D1E17] to-[#2D1E17] text-[#fefae0] p-6 flex flex-col transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 shadow-2xl ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <div className="text-center mb-8 hidden md:block">
            <div className="text-5xl mb-2 text-[#fefae0] drop-shadow-lg" style={{ fontFamily: "'Lancelot', cursive" }}>Raema Perpustakaan Digital</div>
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
              onClick={handleLogout}
              className="flex items-center gap-3 w-full text-sm px-3 py-3 rounded-xl hover:bg-gradient-to-r hover:from-[#5a1616] hover:to-[#6b1e1e] transition-all duration-300 group hover:scale-105"
            >
              <LogOut size={25} className="group-hover:scale-110 transition-transform duration-200" />
              Keluar
            </button>
          </div>
        </aside>

        {/* Main Area */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <header className="p-4 flex justify-between items-center sticky top-0 bg-[#fefae0]/80 backdrop-blur-sm z-20">
            <button onClick={toggleSidebar} className="p-2 md:hidden text-[#2D1E17]">
              <Menu size={24} />
            </button>
            <div
              className="text-lg md:text-xl font-bold text-[#2D1E17] px-5 py-3"
            >
              {formattedDate}
            </div>
            <div className="relative">
              <button
                onClick={toggleNotif}
                className="p-3 rounded-full hover:bg-[#2D1E17]/10 transition-colors relative"
              >
                <Bell size={20} className="text-[#2D1E17]" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </button>
              <AnimatePresence>
                {isNotifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                  >
                    <div className="p-3 bg-[#2D1E17] text-white">
                      <h4 className="font-semibold text-sm">Notifikasi</h4>
                    </div>
                    <ul className="max-h-48 overflow-y-auto">
                      {notifications.map((note, idx) => (
                        <li
                          key={idx}
                          className="px-4 py-3 text-sm text-gray-700 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                          onClick={() => showMessageBox("Notifikasi", `Anda mengklik notifikasi: "${note}"`)}
                        >
                          {note}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </header>

          {/* Main Content */}
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 md:p-8 flex-1"
          >
            <section className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-between">
              <h3 className="text-[#2D1E17] text-2xl font-bold">
                Selamat Datang, {userData ? userData.username : "Pengguna"}!
              </h3>
              {userData && (
                <div className="inline-flex items-center gap-2 bg-[#4a2515] px-4 py-2 rounded-full shadow-inner text-[#fefae0]">
                  <Shield size={16} />
                  <span className="text-sm font-medium capitalize">
                    {userData.role}
                  </span>
                </div>
              )}
            </section>

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

            <section className="mb-8">
              <h3 className="text-[#2D1E17] text-2xl font-bold mb-6 flex items-center gap-3">
                <Heart size={24} className="text-[#6b1e1e]" />
                Buku Favorit Saya
              </h3>
              {/* [EDITED] Cek panjang state `favorites` */}
              {favorites.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {/* [EDITED] Melakukan map pada state `favorites` */}
                  {favorites.map((favorite) => (
                    <motion.div
                      // [EDITED] Key menggunakan `favorite.id`
                      key={favorite.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex flex-col items-center group border border-gray-100 relative"
                    >
                      {/* [EDITED] Tombol hapus memanggil `openConfirmationModal` dengan seluruh objek `favorite` */}
                      <button
                        onClick={() => openConfirmationModal(favorite)}
                        disabled={isDeletingFavorite}
                        className="absolute top-2 right-2 p-1.5 bg-red-600/80 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-700 transition-all duration-300 z-10"
                        aria-label="Hapus dari favorit"
                      >
                        {/* [EDITED] Cek ID loading state berdasarkan favorite.id */}
                        {isDeletingFavorite && favoriteToDelete?.id === favorite.id ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>

                      <div className="relative overflow-hidden rounded-xl mb-3 w-full cursor-pointer">
                        <img
                          // [EDITED] Mengakses data buku melalui `favorite.book`
                          src={favorite.book.cover || "https://placehold.co/150x200/d4c6a6/2D1E17?text=Book"}
                          alt={favorite.book.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/150x200/d4c6a6/2D1E17?text=Cover+Tidak+Tersedia";
                          }}
                        />
                      </div>

                      <h4 className="text-sm font-bold text-center text-[#2D1E17] line-clamp-2 mb-1 group-hover:text-[#4a2515] transition-colors">
                        {favorite.book.title}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2 text-center">{favorite.book.author}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5 px-4 bg-white rounded-2xl shadow-lg border border-gray-100 text-gray-600">
                  <p>Anda belum menambahkan buku ke daftar favorit.</p>
                </div>
              )}
            </section>
          </motion.main>

          <footer className="mt-auto bg-white text-[#2D1E17] p-8 border-t border-gray-200">
            <div className="container mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">Raema Perpustakaan Digital</h3>
                  <p className="text-sm opacity-80">
                    Menyediakan akses ke berbagai koleksi buku digital untuk mendukung pembelajaran dan penelitian.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-4">Jam Operasional</h4>
                  <ul className="space-y-2 text-sm opacity-80">
                    <li>Senin-Jumat: 08.00 - 17.00</li>
                    <li>Sabtu: 09.00 - 15.00</li>
                    <li>Minggu & Hari Libur: Tutup</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-4">Hubungi Kami</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <Mail size={16} />
                    <span className="text-sm opacity-80">info@raemalibrary.com</span>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <a href="#" className="hover:opacity-70 transition-opacity">
                      <Facebook size={20} />
                    </a>
                    <a href="#" className="hover:opacity-70 transition-opacity">
                      <Twitter size={20} />
                    </a>
                    <a href="#" className="hover:opacity-70 transition-opacity">
                      <Instagram size={20} />
                    </a>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm opacity-80">
                <p>&copy; {new Date().getFullYear()} Raema Perpustakaan Digital. Semua hak cipta dilindungi.</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}

export default Dashboard;