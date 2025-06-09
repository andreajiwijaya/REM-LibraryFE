import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUserEdit, FaKey, FaSignOutAlt, FaArrowLeft,
  FaUserCircle, FaEnvelope, FaPhone, FaCalendarAlt, FaMapMarkerAlt
} from 'react-icons/fa';
import './index.css';

export default function Profile() {
  const [user, setUser] = useState({
    name: 'Admin Perpustakaan',
    email: 'admin@perpustakaan.com',
    phone: '+62 812-3456-7890',
    joinDate: '15 Januari 2023',
    role: 'Administrator',
    address: 'Jl. Perpustakaan No. 123, Kota Bandung',
  });

  const [editMode, setEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [tempUser, setTempUser] = useState({ ...user });
  const [passwordData, setPasswordData] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempUser({ ...tempUser, [name]: value });
  };

  const handleSave = () => {
    setUser({ ...tempUser });
    setEditMode(false);
  };

  const handleCancel = () => {
    setTempUser({ ...user });
    setEditMode(false);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleSubmitPassword = (e) => {
    e.preventDefault();
    // Validasi dan proses ubah password
    if (passwordData.newPass !== passwordData.confirm) {
      alert('Password baru dan konfirmasi tidak cocok.');
      return;
    }
    alert('Password berhasil diubah!');
    setPasswordData({ current: '', newPass: '', confirm: '' });
    setShowPasswordForm(false);
  };

  return (
    <div className="flex-1 p-8 flex flex-col min-h-screen bg-[#fff9e6]">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Link to="/" className="mr-4 p-2 rounded-full hover:bg-[#2D1E17]/10">
            <FaArrowLeft className="text-[#2D1E17]" />
          </Link>
          <h2 className="text-2xl font-bold text-[#2D1E17]">Profil Saya</h2>
        </div>

        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center px-4 py-2 bg-[#2D1E17] text-[#fff9e6] rounded-lg hover:bg-[#2D1E17]/90"
          >
            <FaUserEdit className="mr-2" /> Edit Profil
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-[#2D1E17] text-[#2D1E17] rounded-lg hover:bg-[#2D1E17]/10"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#2D1E17] text-[#fff9e6] rounded-lg hover:bg-[#2D1E17]/90"
            >
              Simpan Perubahan
            </button>
          </div>
        )}
      </header>

      {/* Konten Profil */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kartu Profil */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <FaUserCircle className="text-[#2D1E17] text-8xl" />
              </div>

              <h3 className="text-xl font-bold text-[#2D1E17] text-center">
                {editMode ? (
                  <input
                    type="text"
                    name="name"
                    value={tempUser.name}
                    onChange={handleInputChange}
                    className="w-full text-center border-b border-[#2D1E17] focus:outline-none"
                  />
                ) : (
                  user.name
                )}
              </h3>
              <p className="text-gray-500 mt-1">{user.role}</p>

              <div className="w-full mt-6 space-y-4">
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="flex items-center w-full px-4 py-2 bg-[#2D1E17]/10 text-[#2D1E17] rounded-lg hover:bg-[#2D1E17]/20"
                >
                  <FaKey className="mr-3" /> Ubah Password
                </button>

                <Link
                  to="/logout"
                  className="flex items-center px-4 py-2 bg-[#2D1E17]/10 text-[#2D1E17] rounded-lg hover:bg-[#2D1E17]/20"
                >
                  <FaSignOutAlt className="mr-3" /> Keluar
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Profil */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-[#2D1E17] mb-6">Informasi Profil</h3>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start">
                <div className="p-3 bg-[#2D1E17]/10 text-[#2D1E17] rounded-full mr-4">
                  <FaEnvelope />
                </div>
                <div className="flex-1">
                  <h4 className="text-gray-500 text-sm">Email</h4>
                  {editMode ? (
                    <input
                      type="email"
                      name="email"
                      value={tempUser.email}
                      onChange={handleInputChange}
                      className="w-full border-b border-[#2D1E17] focus:outline-none py-1"
                    />
                  ) : (
                    <p className="text-gray-800">{user.email}</p>
                  )}
                </div>
              </div>

              {/* Nomor Telepon */}
              <div className="flex items-start">
                <div className="p-3 bg-[#2D1E17]/10 text-[#2D1E17] rounded-full mr-4">
                  <FaPhone />
                </div>
                <div className="flex-1">
                  <h4 className="text-gray-500 text-sm">Nomor Telepon</h4>
                  {editMode ? (
                    <input
                      type="tel"
                      name="phone"
                      value={tempUser.phone}
                      onChange={handleInputChange}
                      className="w-full border-b border-[#2D1E17] focus:outline-none py-1"
                    />
                  ) : (
                    <p className="text-gray-800">{user.phone}</p>
                  )}
                </div>
              </div>

              {/* Tanggal Bergabung */}
              <div className="flex items-start">
                <div className="p-3 bg-[#2D1E17]/10 text-[#2D1E17] rounded-full mr-4">
                  <FaCalendarAlt />
                </div>
                <div className="flex-1">
                  <h4 className="text-gray-500 text-sm">Tanggal Bergabung</h4>
                  <p className="text-gray-800">{user.joinDate}</p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-start">
                <div className="p-3 bg-[#2D1E17]/10 text-[#2D1E17] rounded-full mr-4">
                  <FaUserCircle />
                </div>
                <div className="flex-1">
                  <h4 className="text-gray-500 text-sm">Role</h4>
                  <p className="text-gray-800">{user.role}</p>
                </div>
              </div>

              {/* Alamat */}
              <div className="flex items-start">
                <div className="p-3 bg-[#2D1E17]/10 text-[#2D1E17] rounded-full mr-4">
                  <FaMapMarkerAlt />
                </div>
                <div className="flex-1">
                  <h4 className="text-gray-500 text-sm">Alamat</h4>
                  {editMode ? (
                    <textarea
                      name="address"
                      value={tempUser.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full border border-[#2D1E17] rounded-md focus:outline-none p-2"
                    />
                  ) : (
                    <p className="text-gray-800">{user.address}</p>
                  )}
                </div>
              </div>

              {/* Form Ubah Password */}
              {showPasswordForm && (
                <form onSubmit={handleSubmitPassword} className="mt-8 space-y-4 border-t pt-6">
                  <h4 className="text-lg font-semibold text-[#2D1E17]">Form Ubah Password</h4>
                  <input
                    type="password"
                    name="current"
                    placeholder="Password Lama"
                    value={passwordData.current}
                    onChange={handlePasswordChange}
                    className="w-full border p-2 rounded-md focus:outline-none"
                  />
                  <input
                    type="password"
                    name="newPass"
                    placeholder="Password Baru"
                    value={passwordData.newPass}
                    onChange={handlePasswordChange}
                    className="w-full border p-2 rounded-md focus:outline-none"
                  />
                  <input
                    type="password"
                    name="confirm"
                    placeholder="Konfirmasi Password Baru"
                    value={passwordData.confirm}
                    onChange={handlePasswordChange}
                    className="w-full border p-2 rounded-md focus:outline-none"
                  />
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#2D1E17] text-[#fff9e6] rounded-md"
                    >
                      Simpan Password
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPasswordForm(false)}
                      className="px-4 py-2 border border-[#2D1E17] text-[#2D1E17] rounded-md"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
