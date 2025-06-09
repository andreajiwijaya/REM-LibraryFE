import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBook, FaArrowLeft, FaSave } from 'react-icons/fa';
import "./index.css";

export default function tambahbuku() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    categoryId: '',  // note: pakai id kategori, bukan nama
  });

  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [serverError, setServerError] = useState(null);

  // Ambil token dari localStorage (sesuaikan kalau kamu punya cara lain)
  const token = localStorage.getItem('token');

  useEffect(() => {
  if (!token) {
    setServerError('Token tidak ditemukan. Silakan login ulang.');
    return;
  }

  fetch('https://rem-library.up.railway.app/categories?limit=1000', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal mengambil kategori.');
      }
      return res.json();
    })
    .then((response) => {
      if (Array.isArray(response.data)) {
        setCategories(response.data);
        setServerError(null);
      } else {
        setCategories([]);
        setServerError('Data kategori tidak valid.');
      }
    })
    .catch((err) => {
      setServerError(err.message);
      setCategories([]);
    });
}, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Judul harus diisi';
    if (!formData.author) newErrors.author = 'Pengarang harus diisi';
    if (!formData.categoryId) newErrors.categoryId = 'Kategori harus dipilih';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!token) {
      alert('Anda harus login terlebih dahulu.');
      return;
    }

    const payload = {
      title: formData.title,
      author: formData.author,
      categoryId: parseInt(formData.categoryId),
    };

    fetch('https://rem-library.up.railway.app/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Gagal menambahkan buku.');
        }
        return res.json();
      })
      .then(() => {
        alert('Buku berhasil ditambahkan!');
        navigate('/books');
      })
      .catch((err) => {
        alert('Error: ' + err.message);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center gap-6 mb-6">
            <Link 
              to="/books" 
              className="group flex items-center justify-center w-12 h-12 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            >
              <FaArrowLeft className="text-gray-600 group-hover:text-indigo-600 transition-colors" />
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FaBook className="text-2xl text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Tambah Buku Baru
                </h1>
                <p className="text-gray-600 mt-2">Tambahkan buku baru ke dalam koleksi perpustakaan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Server Alert */}
        {serverError && (
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-800 mb-1">Terjadi Kesalahan</h3>
                  <p className="text-red-700">{serverError}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8">
              <h2 className="text-2xl font-bold text-white mb-2">Informasi Buku</h2>
              <p className="text-indigo-100">Lengkapi form di bawah untuk menambahkan buku baru</p>
            </div>

            {/* Form Content */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Title Field */}
                <div className="group">
                  <label className="block text-gray-800 font-semibold mb-3 text-lg">
                    Judul Buku
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`w-full px-6 py-4 border-2 rounded-2xl text-gray-800 text-lg transition-all duration-300 focus:outline-none ${
                        errors.title 
                          ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100 bg-red-50' 
                          : 'border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 hover:border-gray-300'
                      }`}
                      placeholder="Masukkan judul buku yang akan ditambahkan"
                    />
                    {formData.title && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.title && (
                    <div className="flex items-center gap-2 mt-3 text-red-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium">{errors.title}</span>
                    </div>
                  )}
                </div>

                {/* Author Field */}
                <div className="group">
                  <label className="block text-gray-800 font-semibold mb-3 text-lg">
                    Pengarang
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      className={`w-full px-6 py-4 border-2 rounded-2xl text-gray-800 text-lg transition-all duration-300 focus:outline-none ${
                        errors.author 
                          ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100 bg-red-50' 
                          : 'border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 hover:border-gray-300'
                      }`}
                      placeholder="Masukkan nama pengarang buku"
                    />
                    {formData.author && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.author && (
                    <div className="flex items-center gap-2 mt-3 text-red-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium">{errors.author}</span>
                    </div>
                  )}
                </div>

                {/* Category Field */}
                <div className="group">
                  <label className="block text-gray-800 font-semibold mb-3 text-lg">
                    Kategori
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className={`w-full px-6 py-4 border-2 rounded-2xl text-gray-800 text-lg transition-all duration-300 focus:outline-none appearance-none cursor-pointer ${
                        errors.categoryId 
                          ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100 bg-red-50' 
                          : 'border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 hover:border-gray-300'
                      }`}
                    >
                      <option value="">Pilih kategori buku</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {errors.categoryId && (
                    <div className="flex items-center gap-2 mt-3 text-red-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium">{errors.categoryId}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-8">
                  <Link
                    to="/books"
                    className="flex-1 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold text-center flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Batal</span>
                  </Link>
                  <button
                    type="submit"
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <FaSave className="text-lg" />
                    <span>Simpan Buku</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Additional Info Card */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 mb-1">Tips</h3>
                <p className="text-blue-700 text-sm">Pastikan semua field yang bertanda (*) sudah diisi dengan benar sebelum menyimpan buku.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}