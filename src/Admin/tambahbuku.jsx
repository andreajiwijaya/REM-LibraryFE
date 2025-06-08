import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBook, FaArrowLeft, FaSave } from 'react-icons/fa';
import "./index.css";

export default function TambahBuku() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    year: '',
    category: '',
    available: '',
    cover: ''
  });

  const [errors, setErrors] = useState({});

  const categories = ['Pemrograman', 'Web Development', 'Fiksi', 'Non-Fiksi', 'Lainnya'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Judul harus diisi';
    if (!formData.author) newErrors.author = 'Pengarang harus diisi';
    if (!formData.isbn) newErrors.isbn = 'ISBN harus diisi';
    if (!formData.year || isNaN(formData.year)) newErrors.year = 'Tahun harus angka';
    if (!formData.category) newErrors.category = 'Kategori harus dipilih';
    if (!formData.available || isNaN(formData.available)) newErrors.available = 'Jumlah harus angka';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert('Buku berhasil ditambahkan!');
      navigate('/books');  // Pakai navigate, bukan history.push
    }
  };

  return (
    <div className="min-h-screen bg-[#fff9e6] p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Link to="/books" className="mr-4 p-2 rounded-full hover:bg-[#2D1E17]/10">
            <FaArrowLeft className="text-[#2D1E17]" />
          </Link>
          <h1 className="text-3xl font-bold text-[#2D1E17]">
            <FaBook className="inline mr-3" />
            Tambah Buku Baru
          </h1>
        </div>
      </div>

      {/* Form Tambah Buku */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kolom Kiri */}
            <div>
              <div className="mb-4">
                <label className="block text-[#2D1E17] font-medium mb-2">Judul Buku*</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.title ? 'border-red-500 focus:ring-red-200' : 'border-[#2D1E17]/30 focus:ring-[#2D1E17]/50'
                  }`}
                  placeholder="Masukkan judul buku"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-[#2D1E17] font-medium mb-2">Pengarang*</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.author ? 'border-red-500 focus:ring-red-200' : 'border-[#2D1E17]/30 focus:ring-[#2D1E17]/50'
                  }`}
                  placeholder="Masukkan nama pengarang"
                />
                {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-[#2D1E17] font-medium mb-2">ISBN*</label>
                <input
                  type="text"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.isbn ? 'border-red-500 focus:ring-red-200' : 'border-[#2D1E17]/30 focus:ring-[#2D1E17]/50'
                  }`}
                  placeholder="Masukkan nomor ISBN"
                />
                {errors.isbn && <p className="text-red-500 text-sm mt-1">{errors.isbn}</p>}
              </div>
            </div>

            {/* Kolom Kanan */}
            <div>
              <div className="mb-4">
                <label className="block text-[#2D1E17] font-medium mb-2">Tahun Terbit*</label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.year ? 'border-red-500 focus:ring-red-200' : 'border-[#2D1E17]/30 focus:ring-[#2D1E17]/50'
                  }`}
                  placeholder="Masukkan tahun terbit"
                />
                {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-[#2D1E17] font-medium mb-2">Kategori*</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.category ? 'border-red-500 focus:ring-red-200' : 'border-[#2D1E17]/30 focus:ring-[#2D1E17]/50'
                  }`}
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-[#2D1E17] font-medium mb-2">Jumlah Tersedia*</label>
                <input
                  type="text"
                  name="available"
                  value={formData.available}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.available ? 'border-red-500 focus:ring-red-200' : 'border-[#2D1E17]/30 focus:ring-[#2D1E17]/50'
                  }`}
                  placeholder="Masukkan jumlah buku yang tersedia"
                />
                {errors.available && <p className="text-red-500 text-sm mt-1">{errors.available}</p>}
              </div>
            </div>
          </div>

          {/* URL Cover Buku */}
          <div className="mb-6">
            <label className="block text-[#2D1E17] font-medium mb-2">URL Cover Buku</label>
            <input
              type="text"
              name="cover"
              value={formData.cover}
              onChange={handleChange}
              className="w-full p-2 border border-[#2D1E17]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D1E17]/50"
              placeholder="Masukkan URL gambar cover (opsional)"
            />
            {formData.cover && (
              <div className="mt-2">
                <p className="text-sm text-[#2D1E17]/70 mb-1">Preview Cover:</p>
                <img
                  src={formData.cover}
                  alt="Preview cover"
                  className="h-32 object-contain border rounded"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150x200?text=Cover+Tidak+Tersedia';
                  }}
                />
              </div>
            )}
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-end space-x-3">
            <Link
              to="/books"
              className="px-4 py-2 border border-[#2D1E17] text-[#2D1E17] rounded-lg hover:bg-[#2D1E17]/10 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-[#2D1E17] text-[#fff9e6] rounded-lg hover:bg-[#2D1E17]/90 transition-colors"
            >
              <FaSave className="mr-2" /> Simpan Buku
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
