import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import {Search, BookOpen, AlertCircle, Star, Bookmark,} from "lucide-react";
// Existing ModalKonfirmasi component (no changes needed)
const ModalKonfirmasi = ({ show, onClose, onConfirm, pesan }) => {
  if (!show) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white rounded-2xl p-8 w-full max-w-md text-center shadow-2xl border border-gray-100"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-[#2D1E17] to-[#d4a373] rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={32} className="text-white" />
        </div>
        <p className="mb-6 text-[#2D1E17] text-lg font-medium leading-relaxed">
          {pesan}
        </p>
        <div className="flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onConfirm}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Ya, Lanjutkan
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Batal
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

function DataBuku() {
  const daftarBuku = [
    {
      id: 1,
      judul: "Kala Senja Menyapa",
      penulis: "Rosa Maria Aguado",
      tahun: 2002,
      kategori: "Fiksi",
      cover:
        "https://marketplace.canva.com/EAFY7T6tOE0/1/0/1003w/canva-oren-estetik-buku-cerita-pasangan-cinta-romantis-kartun-bagus-laGditSTCv0.jpg",
      tersedia: 5,
    },
    {
      id: 2,
      judul: "Buku Catatan",
      penulis: "Olivia Wilson",
      tahun: 2005,
      kategori: "Non-Fiksi",
      cover:
        "https://marketplace.canva.com/EAGdp398ccw/1/0/1131w/canva-biru-putih-berwarna-lucu-sampul-buku-catatan-dokumen-a4-ay-_R3rSmtE.jpg",
      tersedia: 3,
    },
    {
      id: 3,
      judul: "Laporan Tahunan",
      penulis: "Cahaya Dewi",
      tahun: 2025,
      kategori: "Non-Fiksi",
      cover:
        "https://marketplace.canva.com/EAFrIXNBb48/2/0/1003w/canva-biru-modern-laporan-tahunan-sampul-buku-9Ok4whGdElQ.jpg",
      tersedia: 7,
    },
    {
      id: 4,
      judul: "Bu Aku Ingin Pelukmu",
      penulis: "Reza Mustopa",
      tahun: 2023,
      kategori: "Fiksi",
      cover:
        "https://www.gramedia.com/blog/content/images/2024/12/Bu--Aku-Ingin-Pelukmu--Disaat-Dunia-Begitu-Keras-Menempaku.png",
      tersedia: 4,
    },
    {
      id: 5,
      judul: "Pemrograman Web",
      penulis: "Agusriandi",
      tahun: 2010,
      kategori: "Non-Fiksi",
      cover:
        "https://id-test-11.slatic.net/p/2fdc1ca008deb541060b7bd9558316a8.jpg",
      tersedia: 8,
    },
    {
      id: 6,
      judul: "Buku Sakti Pemrograman Web",
      penulis: "Didik Setiawan",
      tahun: 2015,
      kategori: "Non-Fiksi",
      cover:
        "https://cdn.gramedia.com/uploads/picture_meta/2023/1/19/d6c2ynfcdbjkzuu4gllr5b.jpg",
      tersedia: 10,
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("Semua");
  const [bukuData, setBukuData] = useState(daftarBuku);
  const [modal, setModal] = useState({ show: false, pesan: "", aksi: null });
  const [peminjaman, setPeminjaman] = useState(() => {
    const saved = localStorage.getItem("dataPeminjaman");
    return saved
      ? JSON.parse(saved).map((item) => ({
          ...item,
          tanggalPinjam: new Date(item.tanggalPinjam),
        }))
      : [];
  });

  const [bukuFavorit, setBukuFavorit] = useState(() => {
    const savedFavorites = localStorage.getItem("bukuFavorit");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Reviews now only store ratings, no specific comments or dates for simplicity
  const [ratings, setRatings] = useState(() => {
    const savedRatings = localStorage.getItem("bukuRatings");
    // Ratings are stored as an object: { bookId: [rating1, rating2, ...] }
    return savedRatings ? JSON.parse(savedRatings) : {};
  });

  useEffect(() => {
    if (peminjaman.length === 0) {
      localStorage.removeItem("dataPeminjaman");
      localStorage.removeItem("bukuDipinjam");
    } else {
      localStorage.setItem(
        "dataPeminjaman",
        JSON.stringify(
          peminjaman.map((item) => ({
            ...item,
            tanggalPinjam: item.tanggalPinjam.toISOString(),
          }))
        )
      );

      const bukuDipinjam = peminjaman.map(({ id, tanggalPinjam }) => {
        const buku = bukuData.find((b) => b.id === id);
        return {
          id,
          title: buku?.judul || "",
          author: buku?.penulis || "",
          cover: buku?.cover || "",
          dateBorrowed: tanggalPinjam.toLocaleDateString(),
        };
      });
      localStorage.setItem("bukuDipinjam", JSON.stringify(bukuDipinjam));
    }
  }, [peminjaman, bukuData]);

  useEffect(() => {
    localStorage.setItem("bukuFavorit", JSON.stringify(bukuFavorit));
  }, [bukuFavorit]);

  useEffect(() => {
    localStorage.setItem("bukuRatings", JSON.stringify(ratings));
  }, [ratings]);

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const konfirmasiPinjam = (bukuId) => {
    if (peminjaman.find((p) => p.id === bukuId)) {
      alert("📚 Buku ini sudah Anda pinjam.");
      return;
    }

    const buku = bukuData.find((b) => b.id === bukuId);
    if (!buku || buku.tersedia <= 0) {
      alert("📚 Maaf, buku ini tidak tersedia untuk dipinjam.");
      return;
    }

    setModal({
      show: true,
      pesan: `Yakin ingin meminjam buku "${buku.judul}"? Maksimal 7 hari.`,
      aksi: () => handlePinjam(bukuId),
    });
  };

  const handlePinjam = (bukuId) => {
    setBukuData((prev) =>
      prev.map((buku) =>
        buku.id === bukuId && buku.tersedia > 0
          ? { ...buku, tersedia: buku.tersedia - 1 }
          : buku
      )
    );
    setPeminjaman((prev) => [...prev, { id: bukuId, tanggalPinjam: new Date() }]);
    setModal({ show: false, pesan: "", aksi: null });
    alert("📚 Buku berhasil dipinjam!");
  };

  const konfirmasiKembalikan = (bukuId) => {
    setModal({
      show: true,
      pesan: "Yakin ingin mengembalikan buku ini?",
      aksi: () => handleKembalikan(bukuId),
    });
  };

  const handleKembalikan = (bukuId) => {
    setBukuData((prev) =>
      prev.map((buku) =>
        buku.id === bukuId ? { ...buku, tersedia: buku.tersedia + 1 } : buku
      )
    );
    setPeminjaman((prev) => prev.filter((p) => p.id !== bukuId));
    setModal({ show: false, pesan: "", aksi: null });
    alert("📚 Buku berhasil dikembalikan!");
  };

  const toggleFavorite = (bukuId) => {
    setBukuFavorit((prevFavorites) => {
      if (prevFavorites.includes(bukuId)) {
        return prevFavorites.filter((id) => id !== bukuId);
      } else {
        return [...prevFavorites, bukuId];
      }
    });
  };

  const handleRateBook = (bukuId, newRating) => {
    if (!newRating) {
      alert("Mohon berikan rating bintang.");
      return;
    }
    setRatings((prevRatings) => ({
      ...prevRatings,
      [bukuId]: [...(prevRatings[bukuId] || []), parseInt(newRating)],
    }));
    alert("Rating berhasil ditambahkan!");
  };

  const getBookRatingInfo = (bukuId) => {
    const bookRatings = ratings[bukuId] || [];
    if (bookRatings.length === 0) {
      return { averageRating: 0, ratingCount: 0 };
    }
    const totalRating = bookRatings.reduce((sum, rating) => sum + rating, 0);
    const averageRating = (totalRating / bookRatings.length).toFixed(1);
    return { averageRating: parseFloat(averageRating), ratingCount: bookRatings.length };
  };

  const renderStars = (rating, maxStars = 5) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = maxStars - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={16} fill="currentColor" className="text-yellow-400" />
        ))}
        {halfStar && (
          <Star key="half" size={16} fill="none" className="text-yellow-400" /> // Using outline for half star
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={16} fill="none" className="text-gray-300" />
        ))}
      </div>
    );
  };

  const kategoriList = ["Semua", "Fiksi", "Non-Fiksi"];

  const bukuFiltered = bukuData.filter((buku) => {
    const cocokSearch =
      buku.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buku.penulis.toLowerCase().includes(searchQuery.toLowerCase());
    const cocokKategori =
      kategoriFilter === "Semua" || buku.kategori === kategoriFilter;
    return cocokSearch && cocokKategori;
  });

  const bukuFavoritData = bukuData.filter((buku) =>
    bukuFavorit.includes(buku.id)
  );

  const getCategoryStyle = (kategori) => {
    switch (kategori) {
      case "Fiksi":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Non-Fiksi":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getCategoryIcon = (kategori) => {
    switch (kategori) {
      case "Fiksi":
        return "✨";
      case "Non-Fiksi":
        return "🎓";
      default:
        return "📚";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-screen w-full bg-gradient-to-br from-[#fefae0] via-[#fcf7e8] to-[#faf4e0] text-[#2e2e2e] font-serif"
    >
      <Navbar />
      <ModalKonfirmasi
        show={modal.show}
        onClose={() => setModal({ show: false, pesan: "", aksi: null })}
        onConfirm={modal.aksi}
        pesan={modal.pesan}
      />

      <main className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div>
              <h2 className="text-4xl text-[#2D1E17] font-bold drop-shadow-sm">
                📘 Daftar Buku Perpustakaan
              </h2>
              <p className="text-gray-700 text-lg mt-2">
                Koleksi buku terbaik yang tersedia dalam sistem perpustakaan.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col lg:flex-row lg:items-center gap-6 mb-8 p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50"
        >
          <div className="relative flex-1">
            <div className="relative flex items-center">
              {/* Ikon Search */}
              <div className="absolute left-4">
                <div className="bg-[#d4a373] p-2 rounded-full">
                  <Search size={18} className="text-white" />
                </div>
              </div>
              {/* Input */}
              <input
                type="text"
                placeholder="Cari buku berdasarkan judul atau penulis..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-[#2D1E17]/20 bg-white text-[#3b0a0a] focus:outline-none focus:ring-4 focus:ring-[#3b0a0a]/20 focus:border-[#3b0a0a] transition-all duration-300 shadow-sm hover:shadow-md text-lg"
              />
            </div>
          </div>

          <div className="relative">
            <select
              className="w-full lg:w-auto rounded-2xl border-2 border-[#2D1E17]/20 px-6 py-4 bg-white text-[#3b0a0a] focus:outline-none focus:ring-4 focus:ring-[#3b0a0a]/20 focus:border-[#3b0a0a] transition-all duration-300 shadow-sm hover:shadow-md text-lg font-medium cursor-pointer"
              value={kategoriFilter}
              onChange={(e) => setKategoriFilter(e.target.value)}
            >
              {kategoriList.map((kat) => (
                <option key={kat} value={kat}>
                  {kat === "Semua" ? "📚 Semua Kategori" : `${getCategoryIcon(kat)} ${kat}`}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Favorite Books Section */}
        {bukuFavoritData.length > 0 && (
          <>
            <section className="mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-between mb-6"
              >
                <h3 className="text-2xl font-bold text-[#2D1E17] flex items-center gap-3">
                  <Bookmark size={28} className="text-yellow-500" />
                  Buku Favorit Anda
                </h3>
                <div className="text-sm text-gray-600 bg-white/70 px-4 py-2 rounded-full border border-gray-200">
                  {bukuFavoritData.length} buku favorit
                </div>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {bukuFavoritData.map((buku, index) => (
                  <motion.div
                    key={buku.id}
                    layout
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.9 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 100,
                    }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col border border-yellow-200 group overflow-hidden relative"
                  >
                    {/* Favorite Icon */}
                    <motion.div
                      whileTap={{ scale: 0.8 }}
                      whileHover={{ scale: 1.1 }}
                      className="absolute top-4 left-4 z-10 cursor-pointer text-yellow-500"
                      onClick={() => toggleFavorite(buku.id)}
                    >
                      <Star
                        size={24}
                        fill="currentColor"
                        className="drop-shadow-md"
                      />
                    </motion.div>

                    {/* Availability Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          buku.tersedia > 0
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-red-100 text-red-700 border border-red-200"
                        }`}
                      >
                        {buku.tersedia > 0 ? `${buku.tersedia} tersedia` : "Habis"}
                      </div>
                    </div>

                    {/* Book Cover */}
                    <div className="relative aspect-[3/4] w-full mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                      <img
                        src={buku.cover}
                        alt={buku.judul}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Judul dan Penulis */}
                    <h4 className="text-xl font-semibold text-[#2D1E17] mb-2">
                      {buku.judul}
                    </h4>
                    <p className="text-sm text-gray-600 mb-1">
                      Penulis: <span className="font-medium">{buku.penulis}</span>
                    </p>
                    <p className="text-sm text-gray-500 mb-3">Tahun: {buku.tahun}</p>

                    {/* Kategori */}
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full inline-block border ${getCategoryStyle(
                        buku.kategori
                      )}`}
                    >
                      {getCategoryIcon(buku.kategori)} {buku.kategori}
                    </span>

                    {/* Rating display for favorite books */}
                    <div className="flex items-center gap-2 mt-4 text-gray-700">
                      {renderStars(getBookRatingInfo(buku.id).averageRating)}
                      <span className="text-sm font-medium">
                        {getBookRatingInfo(buku.id).averageRating === 0
                          ? "Belum ada rating"
                          : `${getBookRatingInfo(buku.id).averageRating} (${
                              getBookRatingInfo(buku.id).ratingCount
                            } rating)`}
                      </span>
                    </div>

                    {/* Tombol Pinjam / Kembalikan */}
                    <div className="mt-6">
                      {peminjaman.find((p) => p.id === buku.id) ? (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          whileHover={{ scale: 1.03 }}
                          onClick={() => konfirmasiKembalikan(buku.id)}
                          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                        >
                          Kembalikan Buku
                        </motion.button>
                      ) : (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          whileHover={{ scale: 1.03 }}
                          onClick={() => konfirmasiPinjam(buku.id)}
                          disabled={buku.tersedia === 0}
                          className={`w-full ${
                            buku.tersedia > 0
                              ? "bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800"
                              : "bg-gray-400 cursor-not-allowed"
                          } text-white px-4 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300`}
                        >
                          {buku.tersedia > 0 ? "Pinjam Buku" : "Tidak Tersedia"}
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
            <hr className="my-12 border-t-2 border-gray-200" />
          </>
        )}

        {/* All Books Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-between mb-6"
          >
            <h3 className="text-2xl font-bold text-[#2D1E17] flex items-center gap-3">
              <BookOpen size={28} className="text-[#d4a373]" />
              Semua Buku
            </h3>
            <div className="text-sm text-gray-600 bg-white/70 px-4 py-2 rounded-full border border-gray-200">
              {bukuFiltered.length} buku ditemukan
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {bukuFiltered.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-16"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen size={48} className="text-gray-400" />
                </div>
                <p className="text-gray-500 text-xl font-medium">
                  Tidak ada buku ditemukan.
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Coba ubah kata kunci pencarian atau filter kategori.
                </p>
              </motion.div>
            )}

            {bukuFiltered.map((buku, index) => (
              <motion.div
                key={buku.id}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.9 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col border border-gray-100 group overflow-hidden relative"
              >
                {/* Favorite Icon */}
                <motion.div
                  whileTap={{ scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  className="absolute top-4 left-4 z-10 cursor-pointer"
                  onClick={() => toggleFavorite(buku.id)}
                >
                  <Star
                    size={24}
                    className={
                      bukuFavorit.includes(buku.id)
                        ? "text-yellow-500 fill-current drop-shadow-md"
                        : "text-gray-400 drop-shadow-md"
                    }
                  />
                </motion.div>

                {/* Availability Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      buku.tersedia > 0
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-red-100 text-red-700 border border-red-200"
                    }`}
                  >
                    {buku.tersedia > 0 ? `${buku.tersedia} tersedia` : "Habis"}
                  </div>
                </div>

                {/* Book Cover */}
                <div className="relative aspect-[3/4] w-full mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  <img
                    src={buku.cover}
                    alt={buku.judul}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Judul dan Penulis */}
                <h4 className="text-xl font-semibold text-[#2D1E17] mb-2">
                  {buku.judul}
                </h4>
                <p className="text-sm text-gray-600 mb-1">
                  Penulis: <span className="font-medium">{buku.penulis}</span>
                </p>
                <p className="text-sm text-gray-500 mb-3">Tahun: {buku.tahun}</p>

                {/* Kategori */}
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full inline-block border ${getCategoryStyle(
                    buku.kategori
                  )}`}
                >
                  {getCategoryIcon(buku.kategori)} {buku.kategori}
                </span>

                {/* Rating Display */}
                <div className="flex items-center gap-2 mt-4 text-gray-700">
                  {renderStars(getBookRatingInfo(buku.id).averageRating)}
                  <span className="text-sm font-medium">
                    {getBookRatingInfo(buku.id).averageRating === 0
                      ? "Belum ada rating"
                      : `${getBookRatingInfo(buku.id).averageRating} (${
                          getBookRatingInfo(buku.id).ratingCount
                        } rating)`}
                  </span>
                </div>

                {/* Tombol Pinjam / Kembalikan */}
                <div className="mt-6">
                  {peminjaman.find((p) => p.id === buku.id) ? (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.03 }}
                      onClick={() => konfirmasiKembalikan(buku.id)}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Kembalikan Buku
                    </motion.button>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.03 }}
                      onClick={() => konfirmasiPinjam(buku.id)}
                      disabled={buku.tersedia === 0}
                      className={`w-full ${
                        buku.tersedia > 0
                          ? "bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800"
                          : "bg-gray-400 cursor-not-allowed"
                      } text-white px-4 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300`}
                    >
                      {buku.tersedia > 0 ? "Pinjam Buku" : "Tidak Tersedia"}
                    </motion.button>
                  )}
                </div>

                {/* Add Rating Section - Simplified */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h5 className="font-semibold text-gray-800 mb-2">Berikan Rating</h5>
                  <div className="flex items-center justify-between gap-2">
                    <select
                      id={`rating-input-${buku.id}`}
                      name="rating"
                      defaultValue=""
                      className="flex-1 p-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm"
                    >
                      <option value="" disabled>
                        Pilih rating
                      </option>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <option key={star} value={star}>
                          {star} Bintang
                        </option>
                      ))}
                    </select>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      whileHover={{ scale: 1.03 }}
                      onClick={() => {
                        const selectElement = document.getElementById(`rating-input-${buku.id}`);
                        handleRateBook(buku.id, selectElement.value);
                        selectElement.value = ""; // Reset select
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md font-semibold text-sm transition-colors duration-300"
                    >
                      Kirim
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </motion.div>
  );
}

export default DataBuku;