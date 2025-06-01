import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaUser, FaCalendarDay, FaSearch, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import "./index.css";

export default function KembaliIni() {
  // State untuk data pengembalian, pencarian, dan loading
  const [returns, setReturns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Tanggal hari ini dalam format YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  // Simulasi fetch data pengembalian hari ini
  useEffect(() => {
    const fetchData = () => {
      setTimeout(() => {
        setReturns([
          {
            id: 1,
            bookTitle: 'Clean Code',
            bookId: 'BK001',
            memberName: 'Andi Setiawan',
            memberId: 'MBR001',
            loanDate: '2023-06-01',
            dueDate: '2023-06-15',
            returnDate: today,
            status: 'Dikembalikan',
            fine: 0
          },
          {
            id: 2,
            bookTitle: 'React for Beginners',
            bookId: 'BK002',
            memberName: 'Budi Santoso',
            memberId: 'MBR002',
            loanDate: '2023-06-05',
            dueDate: '2023-06-19',
            returnDate: today,
            status: 'Dikembalikan',
            fine: 0
          },
          {
            id: 3,
            bookTitle: 'JavaScript ES6',
            bookId: 'BK003',
            memberName: 'Citra Dewi',
            memberId: 'MBR003',
            loanDate: '2023-05-20',
            dueDate: '2023-06-03',
            returnDate: today,
            status: 'Dikembalikan (Terlambat)',
            fine: 15000
          }
        ]);
        setIsLoading(false);
      }, 500);
    };

    fetchData();
  }, [today]);

  // Filter data pengembalian berdasarkan pencarian
  const filteredReturns = returns.filter(ret => {
    return ret.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
           ret.memberName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Hitung total denda
  const totalFines = returns.reduce((sum, ret) => sum + ret.fine, 0);

  return (
    <div className="min-h-screen bg-[#fff9e6] p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Link to="/" className="mr-4 p-2 rounded-full hover:bg-[#3e1f0d]/10">
            <FaArrowLeft className="text-[#3e1f0d]" />
          </Link>
          <h1 className="text-3xl font-bold text-[#3e1f0d]">
            <FaCalendarDay className="inline mr-3" />
            Pengembalian Hari Ini ({today})
          </h1>
        </div>
      </div>

      {/* Search dan Summary */}
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
          
          <div className="bg-[#3e1f0d]/10 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium text-[#3e1f0d]">Total Pengembalian:</span>
              <span className="font-bold">{returns.length} buku</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="font-medium text-[#3e1f0d]">Total Denda:</span>
              <span className={`font-bold ${totalFines > 0 ? 'text-red-600' : 'text-green-600'}`}>
                Rp {totalFines.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabel pengembalian */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            Memuat data pengembalian...
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-[#3e1f0d] text-[#fff9e6]">
                  <tr>
                    <th className="px-6 py-3 text-left">Buku</th>
                    <th className="px-6 py-3 text-left">Anggota</th>
                    <th className="px-6 py-3 text-left">Tanggal Pinjam</th>
                    <th className="px-6 py-3 text-left">Jatuh Tempo</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Denda</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReturns.length > 0 ? (
                    filteredReturns.map(ret => (
                      <tr key={ret.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-[#3e1f0d] flex items-center">
                            <FaBook className="mr-2" /> {ret.bookTitle}
                          </div>
                          <div className="text-sm text-gray-600">ID: {ret.bookId}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium flex items-center">
                            <FaUser className="mr-2" /> {ret.memberName}
                          </div>
                          <div className="text-sm text-gray-600">ID: {ret.memberId}</div>
                        </td>
                        <td className="px-6 py-4">{ret.loanDate}</td>
                        <td className="px-6 py-4">
                          <span className={ret.status.includes('Terlambat') ? 'text-red-600' : ''}>
                            {ret.dueDate}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <FaCheckCircle className={`mr-2 ${ret.status.includes('Terlambat') ? 'text-yellow-500' : 'text-green-500'}`} />
                            <span className={`font-medium ${ret.status.includes('Terlambat') ? 'text-yellow-600' : 'text-green-600'}`}>
                              {ret.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-medium ${ret.fine > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {ret.fine > 0 ? `Rp ${ret.fine.toLocaleString()}` : 'Tidak ada'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        {searchTerm ? 'Tidak ada pengembalian yang cocok dengan pencarian' : 'Tidak ada pengembalian hari ini'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer ringkasan */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
              <div className="text-sm font-medium text-[#3e1f0d]">
                Menampilkan {filteredReturns.length} dari {returns.length} pengembalian
              </div>
              <Link to="/loans" className="text-sm text-[#3e1f0d] hover:underline flex items-center">
                Lihat Semua Peminjaman <FaArrowLeft className="ml-1 transform rotate-180" />
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Statistik cepat */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="font-semibold text-gray-600 mb-2">Tepat Waktu</h3>
          <p className="text-2xl font-bold text-[#3e1f0d]">
            {returns.filter(r => r.fine === 0).length}
            <span className="text-lg font-normal"> buku</span>
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h3 className="font-semibold text-gray-600 mb-2">Terlambat</h3>
          <p className="text-2xl font-bold text-[#3e1f0d]">
            {returns.filter(r => r.fine > 0).length}
            <span className="text-lg font-normal"> buku</span>
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
          <h3 className="font-semibold text-gray-600 mb-2">Total Denda</h3>
          <p className="text-2xl font-bold text-red-600">
            Rp {totalFines.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
