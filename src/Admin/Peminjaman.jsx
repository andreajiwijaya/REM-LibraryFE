import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaUser, FaCalendarAlt, FaPlus, FaSearch, FaCheck, FaTimes, FaArrowLeft } from 'react-icons/fa';
import "./index.css";

export default function Peminjaman() {
  const [loans, setLoans] = useState([
    {
      id: 1,
      bookTitle: 'Clean Code',
      bookId: 'BK001',
      memberName: 'Andi Setiawan',
      memberId: 'MBR001',
      loanDate: '2023-05-01',
      dueDate: '2023-05-15',
      returnDate: '',
      status: 'Dipinjam'
    },
    {
      id: 2,
      bookTitle: 'React for Beginners',
      bookId: 'BK002',
      memberName: 'Budi Santoso',
      memberId: 'MBR002',
      loanDate: '2023-05-05',
      dueDate: '2023-05-19',
      returnDate: '2023-05-12',
      status: 'Dikembalikan'
    },
    {
      id: 3,
      bookTitle: 'JavaScript ES6',
      bookId: 'BK003',
      memberName: 'Citra Dewi',
      memberId: 'MBR003',
      loanDate: '2023-04-20',
      dueDate: '2023-05-04',
      returnDate: '',
      status: 'Terlambat'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');

  // Fungsi untuk mengembalikan buku
  const returnBook = (id) => {
    setLoans(loans.map(loan => 
      loan.id === id ? {...loan, status: 'Dikembalikan', returnDate: new Date().toISOString().split('T')[0]} : loan
    ));
  };

  // Filter data pinjaman berdasarkan pencarian dan status
  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         loan.memberName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Semua' || loan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Hitung hari keterlambatan
  const calculateOverdueDays = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="min-h-screen bg-[#fff9e6] p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Link to="/" className="mr-4 p-2 rounded-full hover:bg-[#3e1f0d]/10">
            <FaArrowLeft className="text-[#3e1f0d]" />
          </Link>
          <h1 className="text-3xl font-bold text-[#3e1f0d]">
            <FaCalendarAlt className="inline mr-3" />
            Manajemen Peminjaman
          </h1>
        </div>
        
        <Link 
          to="/loans/add" 
          className="flex items-center px-4 py-2 bg-[#3e1f0d] text-[#fff9e6] rounded-lg hover:bg-[#3e1f0d]/90 transition-colors"
        >
          <FaPlus className="mr-2" /> Peminjaman Baru
        </Link>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#3e1f0d]" />
            <input
              type="text"
              placeholder="Cari berdasarkan judul buku atau nama anggota..."
              className="w-full pl-10 pr-4 py-2 border border-[#3e1f0d]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e1f0d]/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <select
              className="w-full p-2 border border-[#3e1f0d]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e1f0d]/50 text-[#3e1f0d]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="Semua">Semua Status</option>
              <option value="Dipinjam">Dipinjam</option>
              <option value="Dikembalikan">Dikembalikan</option>
              <option value="Terlambat">Terlambat</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loans Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#3e1f0d] text-[#fff9e6]">
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
                      <div className="font-medium text-[#3e1f0d]">{loan.bookTitle}</div>
                      <div className="text-sm text-gray-600">ID: {loan.bookId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{loan.memberName}</div>
                      <div className="text-sm text-gray-600">ID: {loan.memberId}</div>
                    </td>
                    <td className="px-6 py-4">{loan.loanDate}</td>
                    <td className="px-6 py-4">
                      <div className={loan.status === 'Terlambat' ? 'text-red-600' : ''}>
                        {loan.dueDate}
                      </div>
                      {loan.status === 'Terlambat' && (
                        <div className="text-xs text-red-500">
                          {calculateOverdueDays(loan.dueDate)} hari terlambat
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {loan.returnDate || '-'}
                    </td>
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
                          onClick={() => returnBook(loan.id)}
                          className="flex items-center px-3 py-1 bg-[#3e1f0d] text-[#fff9e6] rounded text-sm hover:bg-[#3e1f0d]/90"
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
    </div>
  );
}
