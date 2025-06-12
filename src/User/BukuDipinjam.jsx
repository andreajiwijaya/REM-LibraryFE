import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
// Tambahkan Library di sini
import { Loader2, BookOpen, CheckCircle, XCircle, AlertCircle, Library } from 'lucide-react'; 

const API_BASE = 'https://rem-library.up.railway.app/borrows';

// Custom Modal for Confirmation and Messages (replaces alert/confirm)
const ModalKonfirmasi = ({ show, onClose, onConfirm, pesan, title, isError = false }) => {
  if (!show) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-gradient-to-br from-[#F5F5DC] to-[#FAEBD7] rounded-3xl p-8 w-full max-w-md text-center shadow-2xl border border-[#D2B48C]/20"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-[#3C2A21] to-[#2A1F1A] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <AlertCircle size={28} className="text-[#D2B48C]" />
        </div>
        <p className={`mb-8 text-lg font-medium leading-relaxed ${isError ? 'text-red-600' : 'text-[#2A1F1A]'}`}>
          {pesan}
        </p>
        <div className="flex justify-center gap-3">
          {onConfirm && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConfirm}
              className="bg-gradient-to-r from-[#3C2A21] to-[#2A1F1A] hover:from-[#2A1F1A] hover:to-[#1A1411] text-[#F5F5DC] px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Ya, Lanjutkan
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="bg-[#D2B48C] hover:bg-[#C5A572] text-[#2A1F1A] px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {onConfirm ? 'Batal' : 'Tutup'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function BorrowedBooks() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [returningId, setReturningId] = useState(null);
  const [modal, setModal] = useState({ show: false, pesan: "", aksi: null, isError: false }); // State for custom modal

  // Ambil token dari localStorage (atau sesuaikan dari context/auth state)
  const token = localStorage.getItem('token');

  // Function to show custom message box
  const showMessageBox = (message, isError = false, action = null) => {
    setModal({
      show: true,
      pesan: message,
      aksi: action,
      isError: isError,
    });
  };

  const closeModal = () => {
    setModal({ show: false, pesan: "", aksi: null, isError: false });
  };

  // Fetch borrowed books
  useEffect(() => {
    if (!token) {
      setError('User not authenticated');
      return;
    }

    const fetchBorrows = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/my`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `Error ${res.status}: ${res.statusText}`);
        }
        // Backend's getBorrowsByUserId returns an array directly, not an object with 'data'
        const data = await res.json();
        setBorrows(data); // Directly set the array
        setError(null);
      } catch (err) {
        console.error("Fetch borrows error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBorrows();
  }, [token]);

  // Handle return confirmation
  const konfirmasiKembalikan = (borrowId, bookTitle) => {
    showMessageBox(
      `Apakah Anda yakin ingin mengembalikan buku "${bookTitle}"?`,
      false, // Not an error message
      () => handleReturn(borrowId) // Action to perform on confirm
    );
  };

  // Handle return action
  const handleReturn = async (borrowId) => {
    closeModal(); // Close the confirmation modal

    if (!token) {
      showMessageBox('User not authenticated', true);
      return;
    }

    setReturningId(borrowId);
    try {
      // Send PUT request to /borrows/:id with status 'Dikembalikan'
      const res = await fetch(`${API_BASE}/${borrowId}/return`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', // Specify content type as we send a body
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'Dikembalikan' }), // Send the status to update
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to return book');
      }

      // Update local state to reflect the returned status
      setBorrows((prev) =>
        prev.map((b) =>
          b.id === borrowId ? { ...b, returnDate: new Date().toISOString(), status: 'Dikembalikan' } : b
        )
      );
      showMessageBox('Buku berhasil dikembalikan!', false);
    } catch (err) {
      console.error("Return book error:", err);
      showMessageBox(`Error: ${err.message}`, true);
    } finally {
      setReturningId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5DC] via-[#FAEBD7] to-[#F0E68C]/20 p-6">
      <div className="max-w-5xl mx-auto">
        <ModalKonfirmasi
          show={modal.show}
          onClose={closeModal}
          onConfirm={modal.aksi}
          pesan={modal.pesan}
          isError={modal.isError}
        />

        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          {/* Back Button */}
          <div className="mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 text-[#3C2A21] hover:text-[#2A1F1A] font-medium transition-colors duration-200 group"
            >
              <div className="w-8 h-8 bg-[#D2B48C]/20 group-hover:bg-[#D2B48C]/30 rounded-lg flex items-center justify-center transition-colors duration-200">
                <span className="text-lg">←</span>
              </div>
              <span>Kembali ke Dashboard</span>
            </motion.button>
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#3C2A21] to-[#2A1F1A] rounded-2xl mb-4 shadow-lg">
              <BookOpen size={28} className="text-[#D2B48C]" />
            </div>
            <h1 className="text-3xl font-light text-[#2A1F1A] mb-2">
              Buku yang Sedang <span className="font-medium text-[#3C2A21]">Dipinjam</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[#D2B48C] to-[#DEB887] mx-auto rounded-full"></div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col justify-center items-center py-20"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-[#3C2A21] to-[#2A1F1A] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Loader2 className="animate-spin text-[#D2B48C]" size={24} />
            </div>
            <p className="text-lg text-[#2A1F1A] font-light">Memuat daftar buku...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-6 mb-6 shadow-lg"
          >
            <div className="flex items-start gap-3">
              <XCircle className="text-red-500 mt-1" size={20} />
              <div className="flex-1">
                <p className="text-red-700 font-medium mb-2">Terjadi kesalahan</p>
                <p className="text-red-600 text-sm mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && borrows.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-[#D2B48C]/20 to-[#DEB887]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen size={36} className="text-[#D2B48C]" />
            </div>
            <h3 className="text-xl font-medium text-[#2A1F1A] mb-2">Belum ada buku yang dipinjam</h3>
            <p className="text-[#3C2A21]/70 max-w-md mx-auto">Mulai pinjam buku dari halaman daftar buku untuk melihat riwayat peminjaman Anda di sini.</p>
          </motion.div>
        )}

        {/* Books List */}
        <div className="space-y-4">
          {borrows.map(({ id, book, borrowDate, returnDate, fineAmount }, index) => {
            const isReturned = Boolean(returnDate);
            const borrowDt = new Date(borrowDate);
            const returnDt = returnDate ? new Date(returnDate) : null;

            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[#D2B48C]/10 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Book Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#3C2A21] to-[#2A1F1A] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                          <BookOpen size={20} className="text-[#D2B48C]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-[#2A1F1A] mb-1 truncate">{book.title}</h3>
                          <p className="text-sm text-[#3C2A21]/70 mb-3">Oleh: <span className="font-medium">{book.author}</span></p>
                          
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-[#3C2A21]/60">Tanggal Pinjam:</span>
                              <span className="font-medium text-[#2A1F1A]">
                                {borrowDt.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </span>
                            </div>
                            
                            {isReturned && (
                              <>
                                <div className="flex items-center gap-2">
                                  <span className="text-[#3C2A21]/60">Tanggal Kembali:</span>
                                  <span className="font-medium text-green-700">
                                    {returnDt.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                  </span>
                                </div>
                                {fineAmount > 0 && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-[#3C2A21]/60">Denda:</span>
                                    <span className="font-bold text-red-600">
                                      Rp {fineAmount.toLocaleString('id-ID')}
                                    </span>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="lg:flex-shrink-0">
                      {isReturned ? (
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-green-100 text-green-700 px-4 py-3 rounded-xl border border-green-200 font-medium">
                          <CheckCircle size={18} />
                          <span>Sudah Dikembalikan</span>
                        </div>
                      ) : (
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          whileHover={{ scale: 1.02 }}
                          disabled={returningId === id}
                          onClick={() => konfirmasiKembalikan(id, book.title)}
                          className="w-full lg:w-auto bg-gradient-to-r from-[#3C2A21] to-[#2A1F1A] hover:from-[#2A1F1A] hover:to-[#1A1411] text-[#F5F5DC] px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {returningId === id ? (
                            <Loader2 className="animate-spin" size={18} />
                          ) : (
                            <Library size={18} />
                          )}
                          <span>{returningId === id ? 'Memproses...' : 'Kembalikan Buku'}</span>
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}