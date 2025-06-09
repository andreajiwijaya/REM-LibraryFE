import React, { useEffect, useState } from 'react';
import { Loader2, BookOpen, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE = 'https://rem-library.up.railway.app/borrows';

export default function BukuDipinjam() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [returningId, setReturningId] = useState(null);

  const token = localStorage.getItem('token');

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
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          let errMsg = `Error ${res.status}: ${res.statusText}`;
          try {
            const errData = await res.json();
            if (errData.message) errMsg = errData.message;
          } catch {
            // ignore json parse error
          }
          throw new Error(errMsg);
        }

        const data = await res.json();
        setBorrows(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBorrows();
  }, [token]);

  const handleReturn = async (borrowId) => {
    if (!token) {
      alert('User not authenticated');
      return;
    }

    if (!window.confirm('Apakah Anda yakin ingin mengembalikan buku ini?')) {
      return;
    }

    setReturningId(borrowId);

    try {
      const res = await fetch(`${API_BASE}/${borrowId}/return`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        let errMsg = 'Failed to return book';
        try {
          const errData = await res.json();
          if (errData.message) errMsg = errData.message;
        } catch {
          // ignore json parse error
        }
        throw new Error(errMsg);
      }

      // Update local state: set returnDate now so UI langsung update
      setBorrows((prev) =>
        prev.map((b) =>
          b.id === borrowId ? { ...b, returnDate: new Date().toISOString() } : b
        )
      );

      alert('Buku berhasil dikembalikan');
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setReturningId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff9e6] via-[#fef7e0] to-[#f5f0e8] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#8B4513] rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-[#A0522D] rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-[#D2B48C] rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-[#CD853F] rounded-full blur-2xl"></div>
      </div>
      
      {/* Subtle Book Pattern */}
      <div className="absolute inset-0 opacity-3" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232D1E17' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            to="/user/dashboard"
            className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm hover:bg-white/90 text-[#2D1E17] font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-[#2D1E17]/10"
          >
            <ArrowLeft size={20} />
            <span>Kembali ke Dashboard</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#2D1E17] to-[#8B4513] rounded-2xl shadow-2xl mb-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <BookOpen size={36} className="text-[#fff9e6]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#2D1E17] via-[#8B4513] to-[#A0522D] bg-clip-text text-transparent mb-4">
            Koleksi Buku Saya
          </h1>
          <p className="text-[#2D1E17]/70 text-lg font-medium max-w-2xl mx-auto">
            Kelola dan pantau buku-buku yang sedang Anda pinjam dengan mudah dan praktis
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-[#2D1E17]/10">
              <Loader2 className="animate-spin text-[#8B4513] mb-4 mx-auto" size={48} />
              <p className="text-[#2D1E17] font-semibold text-lg text-center">Memuat koleksi buku Anda...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-gradient-to-r from-red-50/90 to-orange-50/90 backdrop-blur-sm border-l-4 border-red-500 rounded-xl p-6 shadow-lg mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-red-800 font-semibold text-lg">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && borrows.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-[#2D1E17]/10 max-w-lg mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-[#fff9e6] to-[#f5f0e8] border-2 border-[#2D1E17]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen size={40} className="text-[#8B4513]" />
              </div>
              <h3 className="text-2xl font-bold text-[#2D1E17] mb-3">Belum Ada Buku</h3>
              <p className="text-[#2D1E17]/70 text-lg">Anda belum meminjam buku apapun saat ini.</p>
              <Link 
                to="/user/dashboard"
                className="inline-block mt-6 bg-gradient-to-r from-[#2D1E17] to-[#8B4513] text-[#fff9e6] font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                Jelajahi Koleksi Buku
              </Link>
            </div>
          </div>
        )}

        {/* Books Grid */}
        <div className="grid gap-6 sm:gap-8">
          {borrows.map(({ id, book, borrowDate, dueDate, returnDate }) => {
            const isReturned = Boolean(returnDate);
            const isOverdue = !isReturned && dueDate && new Date(dueDate) < new Date();
            
            return (
              <div
                key={id}
                className={`group relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${
                  isReturned ? 'bg-gradient-to-br from-green-50/80 to-emerald-50/80 border-green-300/50' :
                  isOverdue ? 'bg-gradient-to-br from-red-50/80 to-pink-50/80 border-red-300/50' : 
                  'border-[#2D1E17]/10'
                }`}
              >
                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#2D1E17]/5 to-transparent rounded-tr-3xl"></div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                  {isReturned ? (
                    <div className="flex items-center gap-2 bg-green-100/90 text-green-800 px-4 py-2 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm">
                      <CheckCircle size={16} />
                      Dikembalikan
                    </div>
                  ) : isOverdue ? (
                    <div className="bg-red-100/90 text-red-800 px-4 py-2 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm">
                      Terlambat
                    </div>
                  ) : (
                    <div className="bg-[#D2B48C]/80 text-[#2D1E17] px-4 py-2 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm">
                      Dipinjam
                    </div>
                  )}
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                  {/* Book Info */}
                  <div className="flex-1 pr-4">
                    <div className="flex items-start gap-6">
                      {/* Book Cover */}
                      <div className="flex-shrink-0 w-20 h-28 bg-gradient-to-br from-[#2D1E17] to-[#8B4513] rounded-xl shadow-xl flex items-center justify-center transform -rotate-2 group-hover:rotate-0 transition-transform duration-500 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        <BookOpen size={28} className="text-[#fff9e6] relative z-10" />
                        <div className="absolute top-1 left-1 w-1 h-24 bg-[#fff9e6]/20 rounded-full"></div>
                      </div>
                      
                      {/* Book Details */}
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl sm:text-2xl font-bold text-[#2D1E17] mb-3 line-clamp-2 leading-tight">
                          {book.title}
                        </h2>
                        <p className="text-[#8B4513] font-semibold mb-6 text-lg">
                          oleh {book.author}
                        </p>
                        
                        {/* Date Information */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-sm">
                            <span className="font-semibold text-[#2D1E17] min-w-[100px]">Dipinjam:</span>
                            <span className="text-[#8B4513] bg-[#fff9e6]/60 px-4 py-2 rounded-full font-medium shadow-sm">
                              {new Date(borrowDate).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          
                          {dueDate && (
                            <div className="flex items-center gap-3 text-sm">
                              <span className="font-semibold text-[#2D1E17] min-w-[100px]">Jatuh Tempo:</span>
                              <span className={`px-4 py-2 rounded-full font-medium shadow-sm ${
                                isOverdue ? 'text-red-700 bg-red-100/80' : 'text-[#8B4513] bg-[#fff9e6]/60'
                              }`}>
                                {new Date(dueDate).toLocaleDateString('id-ID', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                          )}
                          
                          {isReturned && (
                            <div className="flex items-center gap-3 text-sm">
                              <span className="font-semibold text-[#2D1E17] min-w-[100px]">Dikembalikan:</span>
                              <span className="text-green-700 bg-green-100/80 px-4 py-2 rounded-full font-medium shadow-sm">
                                {new Date(returnDate).toLocaleDateString('id-ID', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0">
                    {!isReturned && (
                      <button
                        disabled={returningId === id}
                        onClick={() => handleReturn(id)}
                        className="w-full lg:w-auto bg-gradient-to-r from-[#2D1E17] to-[#8B4513] hover:from-[#1a0f0a] hover:to-[#654321] text-[#fff9e6] font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-[#2D1E17] disabled:hover:to-[#8B4513] transform hover:scale-105 active:scale-95"
                      >
                        {returningId === id ? (
                          <div className="flex items-center justify-center gap-3">
                            <Loader2 className="animate-spin" size={20} />
                            <span>Mengembalikan...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <CheckCircle size={20} />
                            <span>Kembalikan Buku</span>
                          </div>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}