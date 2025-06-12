import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaSearch, FaCheck, FaArrowLeft } from 'react-icons/fa';

// Custom Hook untuk Debounce
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

// Helper function untuk format tanggal
const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

export default function Peminjaman() {
  const [allLoans, setAllLoans] = useState([]); // State untuk menampung semua data dari server
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Pencarian lebih responsif
  const token = localStorage.getItem('token');

  // Fetch semua data peminjaman
  const fetchAllLoans = useCallback(() => {
    setLoading(true);
    setError(null);
    // Ambil semua data sekaligus dengan limit yang besar
    const url = `https://rem-library.up.railway.app/borrows?limit=1000`; 

    fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) {
            return res.json().then(errData => {
                throw new Error(errData.message || 'Gagal mengambil data peminjaman');
            }).catch(() => {
                throw new Error(`Gagal mengambil data, status: ${res.status}`);
            });
        }
        return res.json();
      })
      .then(data => {
        if (data && Array.isArray(data.data)) {
          setAllLoans(data.data);
        } else {
          // Fallback untuk struktur data lama jika masih ada
           if (data && Array.isArray(data)) {
             setAllLoans(data);
           } else {
             throw new Error('Struktur data dari server tidak valid.');
           }
        }
      })
      .catch(err => {
        setError(err.message);
        setAllLoans([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  useEffect(() => {
    fetchAllLoans();
  }, [fetchAllLoans]);

  // --- LOGIKA FILTER DAN SEARCH DI FRONTEND ---
  const filteredLoans = useMemo(() => {
    return allLoans
      .filter(loan => {
        // Filter berdasarkan status
        const isOverdue = loan.status === 'Dipinjam' && new Date(loan.dueDate) < new Date();
        const finalStatus = isOverdue ? 'Terlambat' : loan.status;

        if (statusFilter === 'Semua') {
          return true; // Tampilkan semua jika filter 'Semua'
        }
        return finalStatus === statusFilter;
      })
      .filter(loan => {
        // Filter berdasarkan pencarian
        const bookTitle = loan.book?.title?.toLowerCase() || '';
        const memberName = loan.user?.username?.toLowerCase() || '';
        const search = debouncedSearchTerm.toLowerCase();
        
        return bookTitle.includes(search) || memberName.includes(search);
      });
  }, [allLoans, statusFilter, debouncedSearchTerm]);


  const updateLoanStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`https://rem-library.up.railway.app/borrows/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
            status: newStatus,
            ...(newStatus === 'Dikembalikan' && { returnDate: new Date().toISOString() })
         }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal mengupdate status.');
      }
      
      alert('Status berhasil diupdate!');
      fetchAllLoans(); // Muat ulang data untuk menampilkan perubahan
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleReturnBook = (loan) => {
    if (loan.status === 'Dikembalikan') return;
    const isConfirmed = window.confirm(`Apakah Anda yakin ingin mengembalikan buku "${loan.book?.title}"?`);
    if (isConfirmed) {
      updateLoanStatus(loan.id, 'Dikembalikan');
    }
  };

  const calculateOverdueDays = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="min-h-screen bg-[#fefae0] p-6">
      <div className="flex justify-between items-center mb-8">
         <div className="flex items-center">
           <Link to="/admin/dashboard" className="mr-4 p-2 rounded-full hover:bg-[#2D1E17]/10 transition-colors"><FaArrowLeft className="text-[#2D1E17]" /></Link>
           <h1 className="text-3xl font-bold text-[#2D1E17]"><FaCalendarAlt className="inline mr-3" />Manajemen Peminjaman</h1>
         </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-lg mb-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari judul buku atau nama pengguna..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4c6a6] focus:border-[#4a2515] transition-colors"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <select
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4c6a6] focus:border-[#4a2515] text-[#2D1E17] appearance-none bg-white pr-10"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="Semua">Semua Status</option>
              <option value="Dipinjam">Dipinjam</option>
              <option value="Dikembalikan">Dikembalikan</option>
              <option value="Terlambat">Terlambat</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider">Buku</th>
                <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider">Anggota</th>
                <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider">Tanggal Pinjam</th>
                <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider">Jatuh Tempo</th>
                <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-16 text-gray-500">Memuat data...</td></tr>
              ) : error ? (
                <tr><td colSpan="6" className="text-center py-16 text-red-500 font-medium">{error}</td></tr>
              ) : filteredLoans.length > 0 ? (
                filteredLoans.map(loan => {
                  const isOverdue = loan.status === 'Dipinjam' && new Date(loan.dueDate) < new Date();
                  const overdueDays = isOverdue ? calculateOverdueDays(loan.dueDate) : 0;
                  const finalStatus = isOverdue ? 'Terlambat' : loan.status;

                  return (
                    <tr key={loan.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-800">{loan.book?.title || '-'}</div>
                        <div className="text-xs text-gray-500">ID Buku: {loan.book?.id || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-800">{loan.user?.username || '-'}</div>
                        <div className="text-xs text-gray-500">ID User: {loan.user?.id || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{formatDate(loan.borrowDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={isOverdue ? 'text-red-600 font-semibold' : 'text-gray-600'}>{formatDate(loan.dueDate)}</div>
                        {isOverdue && <div className="text-xs text-red-500">{overdueDays} hari terlambat</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                           finalStatus === 'Dikembalikan' ? 'bg-green-100 text-green-800' :
                           finalStatus === 'Terlambat' ? 'bg-red-100 text-red-800' :
                           'bg-blue-100 text-blue-800'
                         }`}>
                           {finalStatus}
                         </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {loan.status !== 'Dikembalikan' && (
                          <button
                            onClick={() => handleReturnBook(loan)}
                            className="flex items-center px-3 py-1 bg-[#2D1E17] text-white rounded-lg text-xs font-semibold hover:bg-[#4a2515] transition-colors"
                          >
                            <FaCheck className="mr-1.5" /> Kembalikan
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr><td colSpan="6" className="text-center py-16 text-gray-500">Tidak ada data yang cocok.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Paginasi disembunyikan karena filter dilakukan di frontend */}
    </div>
  );
}