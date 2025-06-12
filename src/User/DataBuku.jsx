import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, BookOpen, AlertCircle, Star, Heart } from "lucide-react";

const ModalKonfirmasi = ({ show, onClose, onConfirm, pesan }) => {
  if (!show) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl"
      >
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={24} className="text-amber-600" />
        </div>
        <p className="mb-6 text-gray-700 text-center leading-relaxed">
          {pesan}
        </p>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onConfirm}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-lg font-medium transition-colors"
          >
            Ya
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 rounded-lg font-medium transition-colors"
          >
            Batal
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

function DataBuku() {
  const buku = {
    id: 1,
    judul: "The Art of Mindful Living",
    penulis: "Sarah Mitchell",
    tahun: 2024,
    kategori: "Self-Help",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    tersedia: 3,
    deskripsi: "Panduan praktis untuk hidup yang lebih bermakna dan penuh kesadaran dalam era modern yang penuh tekanan."
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [modal, setModal] = useState({ show: false, pesan: "", aksi: null });
  const [isPinjam, setIsPinjam] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [newRating, setNewRating] = useState(0);

  const handlePinjam = () => {
    setModal({
      show: true,
      pesan: `Yakin ingin meminjam buku "${buku.judul}"?`,
      aksi: () => {
        setIsPinjam(true);
        setModal({ show: false, pesan: "", aksi: null });
      }
    });
  };

  const handleKembalikan = () => {
    setModal({
      show: true,
      pesan: "Yakin ingin mengembalikan buku ini?",
      aksi: () => {
        setIsPinjam(false);
        setModal({ show: false, pesan: "", aksi: null });
      }
    });
  };

  const handleRating = () => {
    if (newRating > 0) {
      setRatings([...ratings, newRating]);
      setNewRating(0);
    }
  };

  const averageRating = ratings.length > 0 
    ? (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1)
    : 0;

  const renderStars = (rating, interactive = false, size = 20) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`cursor-${interactive ? 'pointer' : 'default'} transition-colors ${
              star <= rating 
                ? "text-amber-400 fill-amber-400" 
                : "text-gray-300"
            }`}
            onClick={interactive ? () => setNewRating(star) : undefined}
          />
        ))}
      </div>
    );
  };

  const isBookVisible = buku.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      buku.penulis.toLowerCase().includes(searchQuery.toLowerCase());

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50"
    >
      <ModalKonfirmasi
        show={modal.show}
        onClose={() => setModal({ show: false, pesan: "", aksi: null })}
        onConfirm={modal.aksi}
        pesan={modal.pesan}
      />

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-amber-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-2">
              📚 Digital Library
            </h1>
            <p className="text-amber-700/80 text-sm sm:text-base">
              Temukan dan kelola koleksi buku favorit Anda
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Search */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600" />
            <input
              type="text"
              placeholder="Cari buku atau penulis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-amber-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all"
            />
          </div>
        </motion.div>

        {/* Book Card */}
        {isBookVisible && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-100 overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row">
              {/* Book Cover */}
              <div className="lg:w-1/3 p-6">
                <div className="relative aspect-[2/3] w-full max-w-xs mx-auto lg:max-w-none rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={buku.cover}
                    alt={buku.judul}
                    className="w-full h-full object-cover"
                  />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-md"
                  >
                    <Heart
                      size={20}
                      className={isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"}
                    />
                  </motion.button>
                </div>
              </div>

              {/* Book Details */}
              <div className="lg:w-2/3 p-6 lg:pl-0">
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    buku.tersedia > 0 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  }`}>
                    {buku.tersedia > 0 ? `${buku.tersedia} tersedia` : "Tidak tersedia"}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                    {buku.kategori}
                  </span>
                </div>

                {/* Title & Author */}
                <h2 className="text-xl sm:text-2xl font-bold text-amber-900 mb-2">
                  {buku.judul}
                </h2>
                <p className="text-amber-700 mb-1">
                  oleh <span className="font-medium">{buku.penulis}</span>
                </p>
                <p className="text-amber-600 text-sm mb-4">Tahun {buku.tahun}</p>

                {/* Description */}
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {buku.deskripsi}
                </p>

                {/* Rating Display */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    {renderStars(averageRating)}
                    <span className="text-sm text-gray-600">
                      {ratings.length === 0 
                        ? "Belum ada rating" 
                        : `${averageRating} (${ratings.length} rating)`
                      }
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  {/* Borrow/Return Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={isPinjam ? handleKembalikan : handlePinjam}
                    disabled={!isPinjam && buku.tersedia === 0}
                    className={`w-full py-3 rounded-xl font-medium transition-colors ${
                      isPinjam
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : buku.tersedia > 0
                        ? "bg-amber-600 hover:bg-amber-700 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isPinjam ? "Kembalikan Buku" : 
                     buku.tersedia > 0 ? "Pinjam Buku" : "Tidak Tersedia"}
                  </motion.button>

                  {/* Rating Section */}
                  <div className="border-t border-amber-100 pt-4">
                    <h3 className="font-medium text-amber-900 mb-3">Berikan Rating</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Rating:</span>
                        {renderStars(newRating, true)}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleRating}
                        disabled={newRating === 0}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Kirim
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* No Results */}
        {!isBookVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <BookOpen size={48} className="mx-auto text-amber-300 mb-4" />
            <p className="text-amber-700 text-lg font-medium">
              Buku tidak ditemukan
            </p>
            <p className="text-amber-600 text-sm mt-2">
              Coba kata kunci yang berbeda
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default DataBuku;