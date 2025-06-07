import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaPlus, FaEdit, FaTrash, FaSearch, FaArrowLeft } from 'react-icons/fa';
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

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Kategori buku
  const categories = ['Semua', 'Pemrograman', 'Web Development', 'Fiksi', 'Non-Fiksi'];

  // Fungsi untuk menghapus buku
  const deleteBook = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
      setBooks(books.filter(book => book.id !== id));
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
          <Link to="/" className="mr-4 p-2 rounded-full hover:bg-[#3e1f0d]/10">
            <FaArrowLeft className="text-[#3e1f0d]" />
          </Link>
          <h1 className="text-3xl font-bold text-[#3e1f0d]">
            <FaBook className="inline mr-3" />
            Manajemen Buku
          </h1>
        </div>
        
        <Link 
          to="/books/add" 
          className="flex items-center px-4 py-2 bg-[#3e1f0d] text-[#fff9e6] rounded-lg hover:bg-[#3e1f0d]/90 transition-colors"
        >
          <FaPlus className="mr-2" /> Tambah Buku
        </Link>
      </div>

      {/* Filter dan Pencarian */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#3e1f0d]" />
            <input
              type="text"
              placeholder="Cari buku berdasarkan judul, pengarang, atau ISBN..."
              className="w-full pl-10 pr-4 py-2 border border-[#3e1f0d]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e1f0d]/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <select
              className="w-full p-2 border border-[#3e1f0d]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e1f0d]/50 text-[#3e1f0d]"
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
            <thead className="bg-[#3e1f0d] text-[#fff9e6]">
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
                    <td className="px-6 py-4 font-medium text-[#3e1f0d]">{book.title}</td>
                    <td className="px-6 py-4">{book.author}</td>
                    <td className="px-6 py-4">{book.isbn}</td>
                    <td className="px-6 py-4">{book.year}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-[#3e1f0d]/10 text-[#3e1f0d] rounded-full text-xs">
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
                      <Link 
                        to={`/books/edit/${book.id}`}
                        className="p-2 text-[#3e1f0d] hover:bg-[#3e1f0d]/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FaEdit />
                      </Link>
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
