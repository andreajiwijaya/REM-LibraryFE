import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUsers, FaPlus, FaEdit, FaTrash, FaSearch, 
  FaIdCard, FaEnvelope, FaCalendarAlt, FaArrowLeft 
} from 'react-icons/fa';
import "./index.css";

export default function ManajemenAnggota() {
  const [members, setMembers] = useState([
    {
      id: 1,
      name: 'Andi Setiawan',
      memberId: 'MBR001',
      email: 'andi@example.com',
      joinDate: '2023-01-15',
      status: 'Aktif',
      borrowedBooks: 2
    },
    {
      id: 2,
      name: 'Budi Santoso',
      memberId: 'MBR002',
      email: 'budi@example.com',
      joinDate: '2023-02-20',
      status: 'Aktif',
      borrowedBooks: 0
    },
    {
      id: 3,
      name: 'Citra Dewi',
      memberId: 'MBR003',
      email: 'citra@example.com',
      joinDate: '2023-03-10',
      status: 'Non-Aktif',
      borrowedBooks: 1
    },
    // Tambahkan anggota lain jika perlu
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 2; // jumlah anggota per halaman

  const deleteMember = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus anggota ini?')) {
      setMembers(members.filter(member => member.id !== id));
      // Jika setelah hapus halaman kosong, pindah halaman ke sebelumnya
      const lastPage = Math.ceil((members.length - 1) / membersPerPage);
      if (currentPage > lastPage) {
        setCurrentPage(lastPage);
      }
    }
  };

  // Filter berdasarkan pencarian dan status
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         member.memberId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Semua' || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Hitung anggota yang tampil pada halaman sekarang
  const indexOfLast = currentPage * membersPerPage;
  const indexOfFirst = indexOfLast - membersPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);

  const goToPage = (page) => {
    if (page < 1) page = 1;
    else if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-[#fff9e6] p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Link to="/" className="mr-4 p-2 rounded-full hover:bg-[#3e1f0d]/10" aria-label="Kembali ke halaman utama">
            <FaArrowLeft className="text-[#3e1f0d]" />
          </Link>
          <h1 className="text-3xl font-bold text-[#3e1f0d] flex items-center">
            <FaUsers className="inline mr-3" />
            Manajemen Anggota
          </h1>
        </div>
        
        <Link 
          to="/members/add" 
          className="flex items-center px-4 py-2 bg-[#3e1f0d] text-[#fff9e6] rounded-lg hover:bg-[#3e1f0d]/90 transition-colors"
          aria-label="Tambah anggota baru"
        >
          <FaPlus className="mr-2" /> Tambah Anggota
        </Link>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#3e1f0d]" />
            <input
              type="text"
              placeholder="Cari anggota berdasarkan nama atau ID..."
              className="w-full pl-10 pr-4 py-2 border border-[#3e1f0d]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e1f0d]/50"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reset halaman ke 1 saat cari
              }}
              aria-label="Cari anggota"
            />
          </div>
          
          <div>
            <select
              className="w-full p-2 border border-[#3e1f0d]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e1f0d]/50 text-[#3e1f0d]"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1); // reset halaman ke 1 saat filter
              }}
              aria-label="Filter status anggota"
            >
              <option value="Semua">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Non-Aktif">Non-Aktif</option>
            </select>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#3e1f0d] text-[#fff9e6]">
              <tr>
                <th className="px-6 py-3 text-left">Nama</th>
                <th className="px-6 py-3 text-left">ID Anggota</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Tanggal Bergabung</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Buku Dipinjam</th>
                <th className="px-6 py-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentMembers.length > 0 ? (
                currentMembers.map(member => (
                  <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-[#3e1f0d]">{member.name}</td>
                    <td className="px-6 py-4 flex items-center">
                      <FaIdCard className="mr-2 text-[#3e1f0d]/70" />
                      {member.memberId}
                    </td>
                    <td className="px-6 py-4 flex items-center">
                      <FaEnvelope className="mr-2 text-[#3e1f0d]/70" />
                      {member.email}
                    </td>
                    <td className="px-6 py-4 flex items-center">
                      <FaCalendarAlt className="mr-2 text-[#3e1f0d]/70" />
                      {new Date(member.joinDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        member.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        member.borrowedBooks > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {member.borrowedBooks} buku
                      </span>
                    </td>
                    <td className="px-6 py-4 flex space-x-2">
                      <Link 
                        to={`/members/edit/${member.id}`}
                        className="p-2 text-[#3e1f0d] hover:bg-[#3e1f0d]/10 rounded-lg transition-colors"
                        title="Edit"
                        aria-label={`Edit anggota ${member.name}`}
                      >
                        <FaEdit />
                      </Link>
                      <button 
                        type="button"
                        onClick={() => deleteMember(member.id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Hapus"
                        aria-label={`Hapus anggota ${member.name}`}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    Tidak ada anggota yang ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Menampilkan {filteredMembers.length === 0 ? 0 : indexOfFirst + 1} sampai {Math.min(indexOfLast, filteredMembers.length)} dari {filteredMembers.length} anggota
          </div>
          <div className="flex space-x-1">
            <button
              className="px-3 py-1 rounded border border-[#3e1f0d]/30 text-[#3e1f0d] hover:bg-[#3e1f0d]/10"
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Halaman sebelumnya"
            >
              Sebelumnya
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  className={`px-3 py-1 rounded ${
                    currentPage === page ? 'bg-[#3e1f0d] text-[#fff9e6]' : 'border border-[#3e1f0d]/30 text-[#3e1f0d] hover:bg-[#3e1f0d]/10'
                  }`}
                  type="button"
                  onClick={() => goToPage(page)}
                  aria-label={`Halaman ${page}`}
                >
                  {page}
                </button>
              );
            })}

            <button
              className="px-3 py-1 rounded border border-[#3e1f0d]/30 text-[#3e1f0d] hover:bg-[#3e1f0d]/10"
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              aria-label="Halaman berikutnya"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>

      {/* Statistik */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md flex justify-around text-[#3e1f0d]">
        <div className="text-center">
          <h2 className="text-xl font-bold">{members.length}</h2>
          <p>Total Anggota</p>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold">{members.filter(m => m.status === 'Aktif').length}</h2>
          <p>Anggota Aktif</p>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold">{members.filter(m => m.status === 'Non-Aktif').length}</h2>
          <p>Anggota Non-Aktif</p>
        </div>
      </div>
    </div>
  );
}
