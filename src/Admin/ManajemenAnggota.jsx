import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaSearch, FaUsers, FaPlus, FaArrowLeft } from 'react-icons/fa';

// Custom hook untuk menunda eksekusi (untuk search)
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

const ManajemenAnggota = () => {
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const membersPerPage = 8;

    const fetchMembers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://rem-library.up.railway.app/users', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (response.ok) {
                // Filter hanya role 'user' untuk ditampilkan sebagai anggota
                setMembers(data.data?.filter(user => user.role === 'user') || []);
            } else {
                setError(data.message || 'Gagal mengambil data anggota.');
            }
        } catch (err) {
            setError('Terjadi kesalahan jaringan atau server.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);
    
    const handleDelete = async (id) => {
        const confirmed = window.confirm('Yakin ingin menghapus anggota ini?');
        if (!confirmed) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://rem-library.up.railway.app/users/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.message || 'Gagal menghapus anggota.');
            }

            alert('Anggota berhasil dihapus.');
            setMembers(members.filter((member) => member.id !== id));
        } catch (error) {
            alert(`Terjadi kesalahan: ${error.message}`);
        }
    };
    
    // Logika filter dan paginasi di frontend
    const filteredMembers = useMemo(() => {
        return members.filter(member => 
            member.username?.toLowerCase().includes(debouncedSearchTerm) ||
            member.email?.toLowerCase().includes(debouncedSearchTerm)
        );
    }, [members, debouncedSearchTerm]);
    
    const totalPages = Math.ceil(filteredMembers.length / membersPerPage);
    const currentMembers = filteredMembers.slice((page - 1) * membersPerPage, page * membersPerPage);

    useEffect(() => {
        if (page > totalPages && totalPages > 0) {
            setPage(totalPages);
        }
    }, [page, totalPages]);


    return (
        <div className="min-h-screen bg-[#fefae0] p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {/* --- Tombol Kembali Ditambahkan --- */}
                <div className="mb-8">
                    <Link
                        to="/admin/dashboard"
                        className="inline-flex items-center gap-2 text-[#4a2515] hover:text-[#3e1f0d] font-medium transition-colors duration-200 group"
                    >
                        <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
                        <span>Kembali ke Dashboard</span>
                    </Link>
                </div>

                <div className="mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-[#2D1E17] rounded-2xl flex items-center justify-center shadow-lg">
                            <FaUsers className="text-2xl text-[#fefae0]" />
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-[#2D1E17]">Manajemen Anggota</h1>
                            <p className="text-gray-600 mt-1 sm:mt-2">Kelola data anggota perpustakaan digital Anda</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 mb-10 border border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <Link to="/admin/add-members" className="w-full md:w-auto order-1 md:order-2 flex items-center justify-center gap-3 px-6 py-4 bg-[#4a2515] text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold">
                            <FaPlus />
                            <span>Tambah Anggota</span>
                        </Link>
                        <div className="relative w-full md:flex-1 order-2 md:order-1">
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari berdasarkan nama atau email..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#fefae0] focus:border-[#4a2515] transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider">Anggota</th>
                                    <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-center font-semibold uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan="3" className="text-center py-16 text-gray-500">Memuat data...</td></tr>
                                ) : error ? (
                                    <tr><td colSpan="3" className="text-center py-16 text-red-500 font-medium">{error}</td></tr>
                                ) : currentMembers.length > 0 ? (
                                    currentMembers.map((member) => (
                                        <tr key={member.id} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0 bg-[#d4c6a6] rounded-full flex items-center justify-center text-[#2D1E17] font-bold">
                                                        {member.username?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="font-medium text-gray-900">{member.username}</div>
                                                        <div className="text-xs text-gray-500">ID: {member.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{member.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center space-x-3">
                                                    <button onClick={() => navigate(`/admin/edit-members/${member.id}`)} className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Anggota">
                                                        <FaEdit />
                                                    </button>
                                                    <button onClick={() => handleDelete(member.id)} className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors" title="Hapus Anggota">
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="3" className="text-center py-16 text-gray-500">Tidak ada anggota yang cocok.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {totalPages > 1 && (
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-sm text-gray-700">
                                    Menampilkan {filteredMembers.length > 0 ? (page - 1) * membersPerPage + 1 : 0} - {Math.min(page * membersPerPage, filteredMembers.length)} dari {filteredMembers.length} anggota
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="px-4 py-2 rounded-lg border border-gray-300 text-sm bg-white hover:bg-gray-100 disabled:opacity-50">Sebelumnya</button>
                                    <span className="px-4 py-2 text-sm font-semibold text-white bg-[#4a2515] rounded-lg">{page}</span>
                                    <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages} className="px-4 py-2 rounded-lg border border-gray-300 text-sm bg-white hover:bg-gray-100 disabled:opacity-50">Selanjutnya</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManajemenAnggota;