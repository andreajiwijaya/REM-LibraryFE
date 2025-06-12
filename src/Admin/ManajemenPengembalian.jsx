import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaUser, FaCalendarDay, FaSearch, FaArrowLeft, FaMoneyBillWave, FaRegCommentDots } from 'react-icons/fa';

// Custom Hook untuk Debounce, tidak perlu diubah
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// Helper function untuk format tanggal
const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
};

// Helper function untuk format mata uang
const formatCurrency = (amount) => {
  if (amount === null || typeof amount === 'undefined') return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};


export default function ManajemenPengembalian() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const token = localStorage.getItem('token');
  const limit = 10;

  const fetchReturns = useCallback(() => {
    setLoading(true);
    setError(null);
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      status: 'Dikembalikan',
    });

    if (debouncedSearchTerm) {
      params.append('searchTerm', debouncedSearchTerm);
    }

    const url = `https://rem-library.up.railway.app/borrows?${params.toString()}`;

    fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw new Error(err.message || 'Gagal mengambil data') });
        }
        return res.json();
      })
      .then(data => {
        if (data && data.data && data.meta && typeof data.meta.totalPages !== 'undefined') {
          setReturns(data.data);
          setTotalPages(data.meta.totalPages || 1);
          setTotalData(data.meta.total || 0);
        } else if (data && Array.isArray(data.data) && typeof data.total !== 'undefined') {
          setReturns(data.data);
          setTotalPages(Math.ceil(data.total / limit) || 1);
          setTotalData(data.total || 0);
        } else {
          throw new Error('Struktur data dari server tidak valid.');
        }
      })
      .catch(err => {
        setError(err.message);
        setReturns([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, debouncedSearchTerm, token, limit]);

  useEffect(() => {
    fetchReturns();
  }, [fetchReturns]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);

  // Hitung total denda
  const totalFines = useMemo(() => {
    return returns.reduce((sum, ret) => sum + (ret.fineAmount || 0), 0);
  }, [returns]);


  return (
    <div className="min-h-screen bg-[#fefae0] p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Link to="/admin/dashboard" className="mr-4 p-2 rounded-full hover:bg-[#2D1E17]/10">
            <FaArrowLeft className="text-[#2D1E17]" />
          </Link>
          <h1 className="text-3xl font-bold text-[#2D1E17]">
            <FaCalendarDay className="inline mr-3" />
            Manajemen Pengembalian
          </h1>
        </div>
      </div>

      {/* Search dan Summary Grid */}
      <div className="bg-white p-4 rounded-xl shadow-lg mb-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-1">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari buku atau anggota..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4c6a6] focus:border-[#4a2515]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 flex items-center justify-center">
             <span className="font-semibold text-blue-800 text-lg">
               Total Pengembalian: {totalData}
             </span>
          </div>
          <div className="bg-red-50 p-3 rounded-xl border border-red-200 flex items-center justify-center">
             <div className="text-center">
                <span className="font-semibold text-red-800 text-lg">
                    Total Denda Terkumpul
                </span>
                <p className="font-bold text-red-700 text-xl">{formatCurrency(totalFines)}</p>
             </div>
          </div>
        </div>
      </div>

      {/* Tabel pengembalian */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider">Buku</th>
                  <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider">Anggota</th>
                  <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider">Jatuh Tempo</th>
                  <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider">Tanggal Kembali</th>
                  <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider">Denda</th>
                  <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider">Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-16 text-gray-500">Memuat data...</td></tr>
                ) : error ? (
                   <tr><td colSpan="6" className="text-center py-16 text-red-500 font-medium">{error}</td></tr>
                ) : returns.length > 0 ? (
                  returns.map(ret => {
                    const wasLate = new Date(ret.returnDate) > new Date(ret.dueDate);
                    return (
                        <tr key={ret.id} className="hover:bg-gray-50/50">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-800 flex items-center">
                               <FaBook className="mr-3 text-gray-400" /> {ret.book?.title || '-'}
                            </div>
                            {/* --- ID Buku ditambahkan untuk referensi --- */}
                            <div className="text-xs text-gray-500 ml-7">ID Buku: {ret.book?.id || '-'}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-800 flex items-center">
                              <FaUser className="mr-3 text-gray-400" /> {ret.user?.username || '-'}
                            </div>
                            {/* --- ID Peminjaman ditambahkan --- */}
                            <div className="text-xs text-gray-500 ml-7">ID Pinjam: {ret.id}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{formatDate(ret.dueDate)}</td>
                          <td className={`px-6 py-4 font-medium ${wasLate ? 'text-red-600' : 'text-green-700'}`}>
                            {formatDate(ret.returnDate)}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`font-medium ${(ret.fineAmount || 0) > 0 ? 'text-red-600' : 'text-gray-500'}`}>
                              {formatCurrency(ret.fineAmount)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-500">
                            {ret.notes || '-'}
                          </td>
                        </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-16 text-gray-500">
                      Tidak ada data pengembalian yang cocok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && !loading && !error && (
        <div className="flex justify-center items-center mt-6 space-x-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 bg-[#2D1E17] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#4a2515]"
            >
              Sebelumnya
            </button>
            <span className="px-4 py-2 text-gray-700 font-medium">
              Halaman {page} dari {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 bg-[#2D1E17] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#4a2515]"
            >
              Selanjutnya
            </button>
        </div>
       )}
    </div>
  );
}