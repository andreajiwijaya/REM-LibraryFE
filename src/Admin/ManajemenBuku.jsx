import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaPlus, FaEdit, FaTrash, FaSearch, FaArrowLeft, FaTags } from 'react-icons/fa';
import "./index.css";

export default function ManajemenBuku() {
  const [books, setBooks] = useState([
    { 
      id: 1, 
      title: 'Clean Code', 
      author: 'Robert C. Martin', 
      isbn: '9780132350884', 
      year: 2008, 
      category: 'Pemrograman', 
      available: 5,
      cover: 'https://m.media-amazon.com/images/I/41xShlnTZTL._SY445_SX342_.jpg'
    },
    { 
      id: 2, 
      title: 'React for Beginners', 
      author: 'John Doe', 
      isbn: '9781234567890', 
      year: 2020, 
      category: 'Web Development', 
      available: 3,
      cover: 'https://m.media-amazon.com/images/I/51Kwaw5nInL._SY425_.jpg'
    },
    { 
      id: 3, 
      title: 'JavaScript ES6', 
      author: 'Jane Smith', 
      isbn: '9780987654321', 
      year: 2019, 
      category: 'Web Development', 
      available: 7,
      cover: 'https://m.media-amazon.com/images/I/51W1yH6e3XL._SY425_.jpg'
    }
  ]);

  const [categories, setCategories] = useState(['Semua', 'Pemrograman', 'Web Development', 'Fiksi', 'Non-Fiksi']);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [editingBook, setEditingBook] = useState(null);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  // Fungsi untuk menghapus buku
  const deleteBook = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
      setBooks(books.filter(book => book.id !== id));
    }
  };

  // Fungsi untuk memulai edit buku
  const startEditBook = (book) => {
    setEditingBook({...book});
  };

  // Fungsi untuk menyimpan edit buku
  const saveEditBook = () => {
    if (editingBook) {
      setBooks(books.map(book => book.id === editingBook.id ? editingBook : book));
      setEditingBook(null);
    }
  };

  // Fungsi untuk menambah kategori baru
  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
      setShowAddCategoryModal(false);
    }
  };

  // Fungsi untuk memfilter buku
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn.includes(searchTerm);
    const matchesCategory = selectedCategory === 'Semua' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#fff9e6] p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Link to="/" className="mr-4 p-2 rounded-full hover:bg-[#2D1E17]/10">
            <FaArrowLeft className="text-[#2D1E17]" />
          </Link>
          <h1 className="text-3xl font-bold text-[#2D1E17]">
            <FaBook className="inline mr-3" />
            Manajemen Buku
          </h1>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAddCategoryModal(true)}
            className="flex items-center px-4 py-2 bg-[#2D1E17] text-[#fff9e6] rounded-lg hover:bg-[#2D1E17]/90 transition-colors"
          >
            <FaTags className="mr-2" /> Tambah Kategori
          </button>
          <Link 
            to="/books/add" 
            className="flex items-center px-4 py-2 bg-[#2D1E17] text-[#fff9e6] rounded-lg hover:bg-[#2D1E17]/90 transition-colors"
          >
            <FaPlus className="mr-2" /> Tambah Buku
          </Link>
        </div>
      </div>

      {/* Modal Tambah Kategori */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50">
          <div className="bg-[#fff9e6] p-6 rounded-lg shadow-lg w-96 border border-[#2D1E17]/30">
            <h2 className="text-xl font-bold mb-4 text-[#2D1E17]">Tambah Kategori Baru</h2>
            <input
              type="text"
              placeholder="Nama kategori baru"
              className="w-full p-2 border border-[#2D1E17]/30 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#2D1E17]/50 bg-white"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddCategoryModal(false)}
                className="px-4 py-2 border border-[#2D1E17] text-[#2D1E17] rounded-lg hover:bg-[#2D1E17]/10 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={addCategory}
                className="px-4 py-2 bg-[#2D1E17] text-[#fff9e6] rounded-lg hover:bg-[#2D1E17]/90 transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Buku */}
      {editingBook && (
        <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50">
          <div className="bg-[#fff9e6] p-6 rounded-lg shadow-lg w-96 border border-[#2D1E17]/30">
            <h2 className="text-xl font-bold mb-4 text-[#2D1E17]">Edit Buku</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-[#2D1E17]">Judul</label>
                <input
                  type="text"
                  className="w-full p-2 border border-[#2D1E17]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D1E17]/50 bg-white"
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({...editingBook, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D1E17]">Pengarang</label>
                <input
                  type="text"
                  className="w-full p-2 border border-[#2D1E17]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D1E17]/50 bg-white"
                  value={editingBook.author}
                  onChange={(e) => setEditingBook({...editingBook, author: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D1E17]">Jumlah Tersedia</label>
                <input
                  type="number"
                  className="w-full p-2 border border-[#2D1E17]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D1E17]/50 bg-white"
                  value={editingBook.available}
                  onChange={(e) => setEditingBook({...editingBook, available: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setEditingBook(null)}
                className="px-4 py-2 border border-[#2D1E17] text-[#2D1E17] rounded-lg hover:bg-[#2D1E17]/10 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={saveEditBook}
                className="px-4 py-2 bg-[#2D1E17] text-[#fff9e6] rounded-lg hover:bg-[#2D1E17]/90 transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter dan Pencarian */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2D1E17]" />
            <input
              type="text"
              placeholder="Cari buku berdasarkan judul, pengarang, atau ISBN..."
              className="w-full pl-10 pr-4 py-2 border border-[#2D1E17]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D1E17]/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <select
              className="w-full p-2 border border-[#2D1E17]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D1E17]/50 text-[#2D1E17]"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabel Buku */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#2D1E17] text-[#fff9e6]">
              <tr>
                <th className="px-6 py-3 text-left">Cover</th>
                <th className="px-6 py-3 text-left">Judul</th>
                <th className="px-6 py-3 text-left">Pengarang</th>
                <th className="px-6 py-3 text-left">ISBN</th>
                <th className="px-6 py-3 text-left">Tahun</th>
                <th className="px-6 py-3 text-left">Kategori</th>
                <th className="px-6 py-3 text-left">Tersedia</th>
                <th className="px-6 py-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.length > 0 ? (
                filteredBooks.map(book => (
                  <tr key={book.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <img 
                        src={book.cover} 
                        alt={book.title} 
                        className="w-12 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium text-[#2D1E17]">{book.title}</td>
                    <td className="px-6 py-4">{book.author}</td>
                    <td className="px-6 py-4">{book.isbn}</td>
                    <td className="px-6 py-4">{book.year}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-[#2D1E17]/10 text-[#2D1E17] rounded-full text-xs">
                        {book.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        book.available > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {book.available} {book.available > 0 ? 'Tersedia' : 'Habis'}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex space-x-2">
                      <button
                        onClick={() => startEditBook(book)}
                        className="p-2 text-[#2D1E17] hover:bg-[#2D1E17]/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => deleteBook(book.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500">
                    Buku tidak ditemukan.
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