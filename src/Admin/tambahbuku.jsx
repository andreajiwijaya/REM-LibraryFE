import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBook, FaArrowLeft, FaSave } from 'react-icons/fa';

export default function TambahBuku() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    categoryIds: [],
  });

  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    if (!token) {
      setServerError('Token tidak ditemukan. Silakan login ulang.');
      return;
    }

    fetch('https://rem-library.up.railway.app/categories?limit=1000', {
      headers: { 'Authorization': `Bearer ${token}` },
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
        } else {
          setServerError('Data kategori tidak valid.');
        }
      })
      .catch((err) => {
        setServerError(err.message);
      });
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const categoryId = parseInt(e.target.value);
    setFormData((prev) => {
      const newCategoryIds = prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId) 
        : [...prev.categoryIds, categoryId]; 
      return { ...prev, categoryIds: newCategoryIds };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Judul harus diisi';
    if (!formData.author) newErrors.author = 'Pengarang harus diisi';
    if (formData.categoryIds.length === 0) newErrors.categories = 'Minimal satu kategori harus dipilih';

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
      description: formData.description,
      categoryIds: formData.categoryIds,
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
        navigate('/admin/manajemen-buku');
      })
      .catch((err) => {
        alert('Error: ' + err.message);
      });
  };

  return (
    <div className="min-h-screen bg-[#fefae0] py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center gap-6 mb-6">
            <Link
              to="/admin/manajemen-buku"
              className="group flex items-center justify-center w-12 h-12 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            >
              <FaArrowLeft className="text-gray-600 group-hover:text-[#4a2515] transition-colors" />
            </Link>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#2D1E17] rounded-2xl flex items-center justify-center shadow-lg">
                <FaBook className="text-2xl text-[#fefae0]" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-[#2D1E17]">
                  Tambah Buku Baru
                </h1>
                <p className="text-gray-600 mt-2">Tambahkan buku baru ke dalam koleksi perpustakaan</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Server Error Alert */}
        {serverError && (
             <div className="mb-8 max-w-2xl mx-auto">
               <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm">
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
            <div className="bg-[#4a2515] p-8">
              <h2 className="text-2xl font-bold text-[#fefae0] mb-2">Informasi Buku</h2>
              <p className="text-[#fefae0]/80">Lengkapi form di bawah untuk menambahkan buku baru</p>
            </div>

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
                          : 'border-gray-200 focus:border-[#4a2515] focus:ring-4 focus:ring-[#d4c6a6] hover:border-gray-300'
                      }`}
                      placeholder="Masukkan judul buku yang akan ditambahkan"
                    />
                    {formData.title && !errors.title && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.title && (
                    <div className="flex items-center gap-2 mt-3 text-red-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
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
                          : 'border-gray-200 focus:border-[#4a2515] focus:ring-4 focus:ring-[#d4c6a6] hover:border-gray-300'
                      }`}
                      placeholder="Masukkan nama pengarang buku"
                    />
                     {formData.author && !errors.author && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.author && (
                    <div className="flex items-center gap-2 mt-3 text-red-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span className="text-sm font-medium">{errors.author}</span>
                    </div>
                  )}
                </div>
                
                {/* Description Field */}
                <div className="group">
                  <label className="block text-gray-800 font-semibold mb-3 text-lg">Deskripsi</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-6 py-4 border-2 rounded-2xl text-gray-800 text-lg transition-all duration-300 focus:outline-none border-gray-200 focus:border-[#4a2515] focus:ring-4 focus:ring-[#d4c6a6] hover:border-gray-300 resize-y"
                    placeholder="Masukkan deskripsi buku (opsional)"
                    rows="4"
                  ></textarea>
                </div>

                {/* Categories Checkbox Grid */}
                <div className="group">
                  <label className="block text-gray-800 font-semibold mb-3 text-lg">
                    Kategori <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className={`p-4 rounded-2xl border-2 max-h-60 overflow-y-auto ${errors.categories ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                    {categories.length === 0 ? (
                      <p className="text-gray-500 text-center">Memuat kategori...</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {categories.map((cat) => (
                          <div key={cat.id} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`cat-${cat.id}`}
                              value={cat.id}
                              checked={formData.categoryIds.includes(cat.id)}
                              onChange={handleCategoryChange}
                              className="h-5 w-5 rounded border-gray-300 text-[#4a2515] focus:ring-[#4a2515]"
                            />
                            <label htmlFor={`cat-${cat.id}`} className="ml-3 text-gray-700 select-none cursor-pointer">
                              {cat.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                   {errors.categories && (
                     <div className="flex items-center gap-2 mt-3 text-red-600">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                       <span className="text-sm font-medium">{errors.categories}</span>
                     </div>
                   )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-8">
                  <Link
                    to="/admin/manajemen-buku"
                    className="flex-1 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold text-center flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Batal</span>
                  </Link>
                  <button
                    type="submit"
                    className="flex-1 px-8 py-4 bg-[#4a2515] text-white rounded-2xl hover:bg-[#3e1f0d] transition-all duration-300 font-semibold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <FaSave className="text-lg" />
                    <span>Simpan Buku</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}