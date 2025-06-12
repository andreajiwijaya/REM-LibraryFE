import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaBook, FaPlus, FaUndo, FaPencilAlt, FaTrash, FaArrowLeft } from 'react-icons/fa';

const ManajemenBuku = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let url = `https://rem-library.up.railway.app/books?page=${page}&limit=9`; // Limit 9 for better grid layout (3x3)

      if (selectedCategory) {
        url += `&category=${selectedCategory}`;
      }

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal mengambil data buku');
      }

      const data = await res.json();

      if (!Array.isArray(data.data)) {
        throw new Error('Format data buku tidak valid');
      }

      setBooks(data.data);
      setTotalPages(data.meta?.totalPages || 1);
      setError('');
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Gagal memuat data buku.');
    } finally {
        setLoading(false);
    }
  }, [page, selectedCategory]);

  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        'https://rem-library.up.railway.app/categories?page=1&limit=100',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (!Array.isArray(data.data)) {
        throw new Error('Format data kategori tidak valid');
      }
      setCategories(data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Gagal memuat kategori.');
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1);
  };

  const handleResetFilter = () => {
    setSelectedCategory('');
    setPage(1);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Apakah kamu yakin ingin menghapus buku ini?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://rem-library.up.railway.app/books/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error('Gagal menghapus buku');
      }

      alert('Buku berhasil dihapus');
      fetchBooks(); // Refresh data buku
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Gagal menghapus buku');
    }
  };

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

        {/* Header Section */}
        <div className="mb-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#2D1E17] rounded-2xl flex items-center justify-center shadow-lg">
                <FaBook className="text-2xl text-[#fefae0]" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-[#2D1E17]">Manajemen Buku</h1>
                <p className="text-gray-600 mt-1 sm:mt-2">Kelola koleksi buku perpustakaan digital Anda</p>
              </div>
            </div>
        </div>
        
        {/* Control Bar */}
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 mb-10 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <button
              onClick={() => navigate('/admin/add-books')}
              className="w-full md:w-auto group relative px-6 py-4 bg-[#4a2515] text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold"
            >
              <div className="flex items-center justify-center gap-3">
                <FaPlus />
                <span>Tambah Buku Baru</span>
              </div>
            </button>

            <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="relative w-full sm:w-auto">
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="w-full appearance-none bg-gray-50 border-2 border-gray-200 rounded-2xl px-6 py-3 pr-12 text-gray-700 font-medium focus:outline-none focus:border-[#4a2515] focus:ring-4 focus:ring-[#fefae0] transition-all cursor-pointer shadow-sm hover:shadow-md"
                >
                  <option value="">Semua Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>

              <button
                onClick={handleResetFilter}
                className="w-full sm:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-medium transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              >
                <FaUndo />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Loading and Error State */}
        {loading ? (
            <div className="text-center py-20"><p className="text-gray-500">Memuat data buku...</p></div>
        ) : error ? (
            <div className="text-center py-20"><p className="text-red-500 font-medium">{error}</p></div>
        ) : (
            <>
                {/* Books Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {books.map((book) => (
                    <div key={book.id} className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col">
                      <div className="h-2 bg-gradient-to-r from-[#d4c6a6] to-[#4a2515]"></div>
                      <div className="p-8 flex-grow flex flex-col">
                        <div className="mb-6 flex-grow">
                          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#4a2515] transition-colors line-clamp-2 h-14">
                            {book.title}
                          </h3>
                          <div className="flex items-center gap-2 mb-4">
                            <p className="text-sm font-medium text-[#2D1E17]">{book.author}</p>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                            {book.description || "Tidak ada deskripsi."}
                          </p>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-gray-100 mt-auto">
                          <button onClick={() => navigate(`/admin/edit-books/${book.id}`)} className="flex-1 py-3 bg-[#4a2515] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                            <FaPencilAlt /> <span>Edit</span>
                          </button>
                          <button onClick={() => handleDelete(book.id)} className="flex-1 py-3 bg-[#a54c30] hover:bg-[#8e4229] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                            <FaTrash /> <span>Hapus</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <button
                          onClick={() => page > 1 && setPage((p) => p - 1)}
                          disabled={page === 1}
                          className="w-full sm:w-auto group px-6 py-3 rounded-2xl bg-gray-100 text-gray-700 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3"
                        >
                           <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                           <span>Sebelumnya</span>
                        </button>
                        
                        <div className="flex items-center gap-2">
                           <span className="text-gray-600 font-medium">Halaman</span>
                           <span className="bg-[#4a2515] text-white px-4 py-2 rounded-xl shadow-lg font-bold">{page}</span>
                           <span className="text-gray-600 font-medium">dari {totalPages}</span>
                        </div>
                        
                        <button
                          onClick={() => page < totalPages && setPage((p) => p + 1)}
                          disabled={page === totalPages}
                          className="w-full sm:w-auto group px-6 py-3 rounded-2xl bg-gray-100 text-gray-700 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3"
                        >
                           <span>Selanjutnya</span>
                           <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                      </div>
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
};

export default ManajemenBuku;