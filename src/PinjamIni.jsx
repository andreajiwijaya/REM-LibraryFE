import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaUser, FaCalendarCheck, FaSearch, FaCheck, FaArrowLeft } from 'react-icons/fa';
import "./index.css";

export default function PeminjamanIni() {
  // Sample data - in a real app, this would come from an API
  const [loans, setLoans] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Simulate loading data
  useEffect(() => {
    // This would be an API call in a real app
    const fetchData = () => {
      setTimeout(() => {
        setLoans([
          {
            id: 1,
            bookTitle: 'Clean Code',
            bookId: 'BK001',
            memberName: 'Andi Setiawan',
            memberId: 'MBR001',
            loanDate: today,
            dueDate: '2023-06-15',
            status: 'Dipinjam'
          },
          {
            id: 2,
            bookTitle: 'React for Beginners',
            bookId: 'BK002',
            memberName: 'Budi Santoso',
            memberId: 'MBR002',
            loanDate: today,
            dueDate: '2023-06-19',
            status: 'Dipinjam'
          },
          {
            id: 3,
            bookTitle: 'JavaScript ES6',
            bookId: 'BK003',
            memberName: 'Citra Dewi',
            memberId: 'MBR003',
            loanDate: today,
            dueDate: '2023-06-20',
            status: 'Dipinjam'
          }
        ]);
        setIsLoading(false);
      }, 500);
    };

    fetchData();
  }, [today]);

  // Return book function
  const returnBook = (id) => {
    setLoans(loans.map(loan => 
      loan.id === id ? {...loan, status: 'Dikembalikan'} : loan
    ));
  };

  // Filter loans based on search
  const filteredLoans = loans.filter(loan => {
    return loan.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
           loan.memberName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#fff9e6] p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Link to="/" className="mr-4 p-2 rounded-full hover:bg-[#3e1f0d]/10" aria-label="Kembali ke beranda">
            <FaArrowLeft className="text-[#3e1f0d]" />
          </Link>
          <h1 className="text-3xl font-bold text-[#3e1f0d]">
            <FaCalendarCheck className="inline mr-3" />
            Peminjaman Hari Ini ({today})
          </h1>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
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
      </div>

      {/* Loans Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            Memuat data peminjaman...
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-[#3e1f0d] text-[#fff9e6]">
                  <tr>
                    <th className="px-6 py-3 text-left">Buku</th>
                    <th className="px-6 py-3 text-left">Anggota</th>
                    <th className="px-6 py-3 text-left">ID Peminjaman</th>
                    <th className="px-6 py-3 text-left">Jatuh Tempo</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLoans.length > 0 ? (
                    filteredLoans.map(loan => (
                      <tr key={loan.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-[#3e1f0d] flex items-center">
                            <FaBook className="mr-2" /> {loan.bookTitle}
                          </div>
                          <div className="text-sm text-gray-600">ID: {loan.bookId}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium flex items-center">
                            <FaUser className="mr-2" /> {loan.memberName}
                          </div>
                          <div className="text-sm text-gray-600">ID: {loan.memberId}</div>
                        </td>
                        <td className="px-6 py-4">LN-{loan.id.toString().padStart(3, '0')}</td>
                        <td className="px-6 py-4">{loan.dueDate}</td>
                        <td className="px-6 py-4 font-semibold">
                          {loan.status}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => returnBook(loan.id)}
                            disabled={loan.status === 'Dikembalikan'}
                            className={`flex items-center px-3 py-1 rounded text-sm 
                              ${loan.status === 'Dikembalikan' 
                                ? 'bg-gray-400 cursor-not-allowed text-gray-200' 
                                : 'bg-[#3e1f0d] text-[#fff9e6] hover:bg-[#3e1f0d]/90'}`}
                          >
                            <FaCheck className="mr-1" /> Kembalikan
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        {searchTerm ? 'Tidak ada peminjaman yang cocok dengan pencarian' : 'Tidak ada peminjaman hari ini'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Summary Stats */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-[#3e1f0d]">
                  Total Peminjaman Hari Ini: {filteredLoans.length}
                </div>
                <Link 
                  to="/peminjaman" 
                  className="text-sm text-[#3e1f0d] hover:underline"
                >
                  Lihat Semua Peminjaman →
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="font-semibold text-gray-600 mb-2">Paling Banyak Dipinjam</h3>
          <p className="text-xl font-bold text-[#3e1f0d]">Clean Code</p>
          <p className="text-sm text-gray-500">5 kali hari ini</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="font-semibold text-gray-600 mb-2">Anggota Paling Aktif</h3>
          <p className="text-xl font-bold text-[#3e1f0d]">Andi Setiawan</p>
          <p className="text-sm text-gray-500">3 buku dipinjam</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h3 className="font-semibold text-gray-600 mb-2">Kategori Populer</h3>
          <p className="text-xl font-bold text-[#3e1f0d]">Pemrograman</p>
          <p className="text-sm text-gray-500">8 peminjaman</p>
        </div>
      </div>
    </div>
  );
}
