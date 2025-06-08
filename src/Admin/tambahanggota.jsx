import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUsers, FaArrowLeft, FaSave, FaIdCard, FaEnvelope, FaCalendarAlt} from 'react-icons/fa';
import "./index.css";

export default function TambahAnggota() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() => ({
    name: '',
    memberId: `MBR${Math.floor(1000 + Math.random() * 9000)}`, // Generate random ID once
    email: '',
    joinDate: new Date().toISOString().split('T')[0], // Default to today
    status: 'Aktif',
    borrowedBooks: 0
  }));

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nama harus diisi';
    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email tidak valid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Simulasi penyimpanan data
      alert(`Anggota berhasil ditambahkan!\n\n` + JSON.stringify(formData, null, 2));
      navigate('/members'); // Kembali ke halaman manajemen anggota
    }
  };

  return (
    <div className="min-h-screen bg-[#fff9e6] p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Link to="/members" className="mr-4 p-2 rounded-full hover:bg-[#2D1E17]/10">
            <FaArrowLeft className="text-[#2D1E17]" />
          </Link>
          <h1 className="text-3xl font-bold text-[#2D1E17] flex items-center">
            <FaUsers className="inline mr-3" />
            Tambah Anggota Baru
          </h1>
        </div>
      </div>

      {/* Form Tambah Anggota */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kolom Kiri */}
            <div>
              <div className="mb-4">
                <label htmlFor="name" className="block text-[#2D1E17] font-medium mb-2 flex items-center">
                  <FaIdCard className="mr-2" /> Nama Lengkap*
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.name ? 'border-red-500 focus:ring-red-200' : 'border-[#2D1E17]/30 focus:ring-[#2D1E17]/50'
                  }`}
                  placeholder="Masukkan nama lengkap"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-[#2D1E17] font-medium mb-2 flex items-center">
                  <FaEnvelope className="mr-2" /> Email*
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.email ? 'border-red-500 focus:ring-red-200' : 'border-[#2D1E17]/30 focus:ring-[#2D1E17]/50'
                  }`}
                  placeholder="Masukkan alamat email"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Kolom Kanan */}
            <div>
              <div className="mb-4">
                <label htmlFor="memberId" className="block text-[#2D1E17] font-medium mb-2 flex items-center">
                  <FaIdCard className="mr-2" /> ID Anggota
                </label>
                <input
                  id="memberId"
                  type="text"
                  name="memberId"
                  value={formData.memberId}
                  readOnly
                  className="w-full p-2 border border-[#2D1E17]/30 rounded-lg bg-gray-100 text-[#2D1E17]"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="joinDate" className="block text-[#2D1E17] font-medium mb-2 flex items-center">
                  <FaCalendarAlt className="mr-2" /> Tanggal Bergabung
                </label>
                <input
                  id="joinDate"
                  type="date"
                  name="joinDate"
                  value={formData.joinDate}
                  onChange={handleChange}
                  className="w-full p-2 border border-[#2D1E17]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D1E17]/50"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="status" className="block text-[#2D1E17] font-medium mb-2">Status Keanggotaan</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 border border-[#2D1E17]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D1E17]/50 text-[#2D1E17]"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Non-Aktif">Non-Aktif</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-end space-x-3 mt-6">
            <Link
              to="/members"
              className="px-4 py-2 border border-[#2D1E17] text-[#2D1E17] rounded-lg hover:bg-[#2D1E17]/10 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-[#2D1E17] text-[#fff9e6] rounded-lg hover:bg-[#2D1E17]/90 transition-colors"
            >
              <FaSave className="mr-2" /> Simpan Anggota
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
