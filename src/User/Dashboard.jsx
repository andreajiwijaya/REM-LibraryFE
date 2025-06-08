import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Bell, Search, LogOut, Star, BookCheck, Mail, Facebook, Twitter, Instagram } from "lucide-react";
import { FaBook, FaUser, FaHome } from "react-icons/fa";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [bookTypeFilter, setBookTypeFilter] = useState("all");

  const [reviews, setReviews] = useState({});
  const [selectedBookForReview, setSelectedBookForReview] = useState(null);

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

  const popularBooks = [
    {
      id: 1,
      judul: "Buku Sakti Pemrograman Web",
      penulis: "Didik Setiawan",
      cover: "https://cdn.gramedia.com/uploads/picture_meta/2023/1/19/d6c2ynfcdbjkzuu4gllr5b.jpg",
      kategori: "non-fiksi",
    },
    {
      id: 2,
      judul: "Laskar Pelangi",
      penulis: "Andrea Hirata",
      cover: "https://upload.wikimedia.org/wikipedia/id/thumb/8/8e/Laskar_pelangi_sampul.jpg/250px-Laskar_pelangi_sampul.jpg",
      kategori: "fiksi",
    },
    {
      id: 3,
      judul: "Buku Jago Bola Voli",
      penulis: "Ikbal Tawakal",
      cover: "https://images.unsplash.com/photo-1543357480-c60d400e7ef6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      kategori: "non-fiksi",
    },
    {
      id: 4,
      judul: "Pemrograman Web",
      penulis: "Agusriandi",
      cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      kategori: "non-fiksi",
    },
    {
      id: 5,
      judul: "Laporan Tahunan",
      penulis: "Cahaya Dewi",
      cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      kategori: "non-fiksi",
    },
  ];

  const filteredBooks = popularBooks.filter((book) => {
    const matchesSearch = book.judul.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = bookTypeFilter === "all" || book.kategori === bookTypeFilter;
    return matchesSearch && matchesType;
  });

  const handleReviewChange = (text) => {
    if (selectedBookForReview) {
      setReviews((prev) => ({
        ...prev,
        [selectedBookForReview.id]: {
          ...prev[selectedBookForReview.id],
          review: text,
        },
      }));
    }
  };

  const handleRatingChange = (rating) => {
    if (selectedBookForReview) {
      setReviews((prev) => ({
        ...prev,
        [selectedBookForReview.id]: {
          ...prev[selectedBookForReview.id],
          rating,
        },
      }));
    }
  };

  const handleSubmitReview = () => {
    if (selectedBookForReview) {
      console.log(`Review submitted for book ${selectedBookForReview.judul}:`, {
        review: reviews[selectedBookForReview.id]?.review,
        rating: reviews[selectedBookForReview.id]?.rating,
      });

      setReviews((prev) => ({
        ...prev,
        [selectedBookForReview.id]: {
          ...prev[selectedBookForReview.id],
          submitted: true,
        },
      }));
      setSelectedBookForReview(null);
    }
  };

  const openReviewModal = (book) => {
    setSelectedBookForReview(book);
    if (!reviews[book.id]) {
      setReviews((prev) => ({
        ...prev,
        [book.id]: { review: '', rating: 0, submitted: false },
      }));
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[#fefae0] via-[#fcf7e8] to-[#faf4e0] text-[#2e2e2e]">
      {/* Font CDN Link */}
      <link href="https://fonts.cdnfonts.com/css/ancizar-serif" rel="stylesheet" />

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
              onLogout();
              navigate("/signin");
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
                      className="px-4 py-3 text-sm text-gray-700 border-b last:border-b-0 hover:bg-gradient-to-r hover:from-[#ffd60a] hover:from-opacity-10 hover:to-transparent cursor-pointer transition-all duration-200"
                      onClick={() => alert(`Kamu klik notifikasi: "${note}"`)}
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
          {/* Book Recommendations */}
          <section className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h3 className="text-[#2D1E17] text-2xl font-bold">
                Rekomendasi Buku Populer
              </h3>
              
              <div className="flex gap-2 flex-col sm:flex-row">
                <div className="flex border-2 border-[#2D1E17] border-opacity-20 rounded-full overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
                  <input
                    type="text"
                    placeholder="Cari buku..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 text-sm outline-none bg-transparent w-full min-w-[150px]"
                  />
                  <button className="flex items-center justify-center px-4 bg-gradient-to-r from-[#2D1E17] to-[#4a2515] text-[#fefae0] hover:from-[#4a2515] hover:to-[#2D1E17] transition-all duration-300">
                    <Search size={18} />
                  </button>
                </div>
                <select
                  value={bookTypeFilter}
                  onChange={(e) => setBookTypeFilter(e.target.value)}
                  className="border-2 border-[#2D1E17] border-opacity-20 rounded-full px-4 py-2 text-sm bg-white shadow-sm hover:shadow-md transition-shadow outline-none"
                >
                  <option value="all">📚 Semua</option>
                  <option value="fiksi">✨ Fiksi</option>
                  <option value="non-fiksi">🎓 Non-Fiksi</option>
                </select>
              </div>
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredBooks.map((book) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: book.id * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex flex-col items-center group border border-gray-100"
                >
                  <div className="relative overflow-hidden rounded-xl mb-3 w-full">
                    <img
                      src={book.cover}
                      alt={book.judul}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/150x200?text=Cover+Tidak+Tersedia";
                      }}
                    />
                  </div>

                  <h4 className="text-sm font-bold text-center text-[#2D1E17] line-clamp-2 mb-1 group-hover:text-[#ffd60a] transition-colors">
                    {book.judul}
                  </h4>
                  <p className="text-xs text-gray-600 mb-2 text-center">{book.penulis}</p>

                  <div className="flex items-center gap-1 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      book.kategori === 'fiksi'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {book.kategori === 'fiksi' ? '✨ Fiksi' : '🎓 Non-Fiksi'}
                    </span>
                  </div>

                  {reviews[book.id]?.submitted ? (
                    <div className="mt-2 text-center text-green-600 text-xs font-semibold">
                      Review submitted! Thank you.
                    </div>
                  ) : (
                    <button
                      onClick={() => openReviewModal(book)}
                      className="mt-3 bg-[#4a2515] text-[#fffdf5] px-4 py-2 rounded-full text-xs font-bold hover:bg-[#3e1f0d] transition-all duration-300"
                    >
                      Beri Ulasan
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        </motion.main>

        {/* Footer */}
        <footer className="mt-auto bg-white text-[#2D1E17] p-8 border-t border-gray-200">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Raema Perpustakaan Digital</h3>
                <p className="text-sm opacity-80">
                  Menyediakan akses ke berbagai koleksi buku digital untuk mendukung pembelajaran dan penelitian.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Tautan Cepat</h4>
                <ul className="space-y-2">
                  {sidebarItems.map((item) => (
                    <li key={item.label}>
                      <a 
                        href={item.path} 
                        className="text-sm opacity-80 hover:opacity-100 hover:text-[#ffd60a] transition-all"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(item.path);
                        }}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
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
                  <Mail size={16} className="text-[#2D1E17]" />
                  <span className="text-sm opacity-80">info@raemalibrary.com</span>
                </div>
                <div className="flex gap-4 mt-4">
                  <a href="#" className="hover:text-[#ffd60a] transition-all">
                    <Facebook size={20} className="text-[#2D1E17]" />
                  </a>
                  <a href="#" className="hover:text-[#ffd60a] transition-all">
                    <Twitter size={20} className="text-[#2D1E17]" />
                  </a>
                  <a href="#" className="hover:text-[#ffd60a] transition-all">
                    <Instagram size={20} className="text-[#2D1E17]" />
                  </a>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm opacity-80">
              <p>&copy; {new Date().getFullYear()} Raema Perpustakaan Digital. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* Review Modal/Section */}
      <AnimatePresence>
        {selectedBookForReview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-[#fefae0] bg-opacity-60 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedBookForReview(null)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedBookForReview(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-600"
              >
                <X size={20} />
              </button>
              <h3 className="text-xl font-bold text-[#3e1f0d] mb-4 text-center">
                Beri Ulasan untuk "{selectedBookForReview.judul}"
              </h3>
              <div className="flex justify-center items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className={`text-yellow-400 ${
                      (reviews[selectedBookForReview.id]?.rating || 0) >= star ? "opacity-100" : "opacity-30"
                    } transition-opacity`}
                  >
                    <Star size={24} fill="currentColor" />
                  </button>
                ))}
              </div>
              <textarea
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#ffd60a] focus:border-transparent outline-none mb-4"
                placeholder="Tulis ulasan Anda tentang buku ini..."
                value={reviews[selectedBookForReview.id]?.review || ""}
                onChange={(e) => handleReviewChange(e.target.value)}
              />
              <button
                onClick={handleSubmitReview}
                className="w-full bg-gradient-to-r from-[#3e1f0d] to-[#4a2515] text-[#fefae0] px-6 py-3 rounded-lg text-sm font-bold hover:from-[#4a2515] hover:to-[#3e1f0d] transition-all duration-300 shadow-md"
              >
                Kirim Ulasan
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Dashboard;