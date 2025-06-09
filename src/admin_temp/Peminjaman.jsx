import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaSearch, FaCheck, FaArrowLeft } from 'react-icons/fa';
import "./index.css";

export default function Peminjaman() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem('token');
  const limit = 10; // jumlah data per halaman

  // Fetch data peminjaman dengan paging dan filter dari backend
  const fetchLoans = () => {
    setLoading(true);
    // Query params untuk paging & filter status jika bukan 'Semua'
    let url = `https://rem-library.up.railway.app/borrows?page=${page}&limit=${limit}`;
    if (statusFilter !== 'Semua') {
      url += `&status=${encodeURIComponent(statusFilter)}`;
    }

    fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Gagal mengambil data peminjaman');
        return res.json();
      })
      .then(data => {
        // Asumsi response backend: { data: [...], totalPages: x }
        setLoans(data.data);
        setTotalPages(data.totalPages);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLoans();
  }, [page, statusFilter]);

  // Update status pengembalian via PUT
  const updateLoan = async (id, updateData) => {
    try {
      const res = await fetch(`https://rem-library.up.railway.app/borrows/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) throw new Error('Gagal mengupdate data peminjaman');

      // Refresh data setelah update
      fetchLoans();
    } catch (err) {
      alert(err.message);
    }
  };

  // Fungsi pengembalian buku
  const returnBook = (loan) => {
    if (loan.status === 'Dikembalikan') return;

    updateLoan(loan.id, { status: 'Dikembalikan', returnDate: new Date().toISOString().split('T')[0] });
  };

  // Filter pencarian manual di frontend
  const filteredLoans = loans.filter(loan => {
    const bookTitle = loan.book?.title || '';
    const memberName = loan.user?.name || '';
    const searchMatch =
      bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memberName.toLowerCase().includes(searchTerm.toLowerCase());

    return searchMatch;
  });

  const calculateOverdueDays = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) return <div className="p-6">Loading data peminjaman...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-[#fff9e6] p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Link to="/" className="mr-4 p-2 rounded-full hover:bg-[#2D1E17]/10">
            <FaArrowLeft className="text-[#2D1E17]" />
          </Link>
          <h1 className="text-3xl font-bold text-[#2D1E17]">
            <FaCalendarAlt className="inline mr-3" />
            Manajemen Peminjaman
          </h1>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative col-span-2">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2D1E17]" />
            <input
              type="text"
              placeholder="Cari berdasarkan judul buku atau nama anggota..."
              className="w-full pl-10 pr-4 py-2 border border-[#2D1E17]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D1E17]/50"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <select
              className="w-full p-2 border border-[#2D1E17]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D1E17]/50 text-[#2D1E17]"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="Semua">Semua Status</option>
              <option value="Dipinjam">Dipinjam</option>
              <option value="Dikembalikan">Dikembalikan</option>
              <option value="Terlambat">Terlambat</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#2D1E17] text-[#fff9e6]">
              <tr>
                <th className="px-6 py-3 text-left">Buku</th>
                <th className="px-6 py-3 text-left">Anggota</th>
                <th className="px-6 py-3 text-left">Tanggal Pinjam</th>
                <th className="px-6 py-3 text-left">Jatuh Tempo</th>
                <th className="px-6 py-3 text-left">Tanggal Kembali</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.length > 0 ? (
                filteredLoans.map(loan => (
                  <tr key={loan.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#2D1E17]">{loan.book?.title || '-'}</div>
                      <div className="text-sm text-gray-600">ID: {loan.book?.id || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{loan.user?.name || '-'}</div>
                      <div className="text-sm text-gray-600">ID: {loan.user?.id || '-'}</div>
                    </td>
                    <td className="px-6 py-4">{loan.loanDate}</td>
                    <td className={`px-6 py-4 ${loan.status === 'Terlambat' ? 'text-red-600' : ''}`}>
                      {loan.dueDate}
                      {loan.status === 'Terlambat' && (
                        <div className="text-xs text-red-500">
                          {calculateOverdueDays(loan.dueDate)} hari terlambat
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">{loan.returnDate || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        loan.status === 'Dipinjam' ? 'bg-blue-100 text-blue-800' :
                        loan.status === 'Dikembalikan' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {loan.status !== 'Dikembalikan' && (
                        <button
                          onClick={() => returnBook(loan)}
                          className="flex items-center px-3 py-1 bg-[#2D1E17] text-[#fff9e6] rounded text-sm hover:bg-[#2D1E17]/90"
                        >
                          <FaCheck className="mr-1" /> Kembalikan
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    Tidak ada data peminjaman yang ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-3">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className={`px-3 py-1 rounded bg-[#2D1E17] text-[#fff9e6] hover:bg-[#2D1E17]/90 disabled:opacity-50`}
        >
          Sebelumnya
        </button>
        <span className="px-3 py-1 rounded border border-[#2D1E17] text-[#2D1E17]">
          Halaman {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className={`px-3 py-1 rounded bg-[#2D1E17] text-[#fff9e6] hover:bg-[#2D1E17]/90 disabled:opacity-50`}
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
}
