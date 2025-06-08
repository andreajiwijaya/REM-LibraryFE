import React, { useState } from "react";
import Navbar from "./Navbar";
import { Edit, Mail, Phone, MapPin, X, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Profil({onLogout}) {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "User Bima",
    email: "user.bima@oneit.ac.id",
    phone: "0857-1234-5678",
    address: "Jl. Mahasiswa No. 10, One IT",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userData);

  const handleEditClick = () => {
    setFormData(userData); // salin data lama untuk edit
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setUserData(formData); // simpan perubahan
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false); // tutup modal tanpa menyimpan
  };

  const handleLogout = () => {
    // lakukan proses logout (misal hapus token, dll.)
    // lalu redirect ke halaman login
    navigate("/login");
  };

  return (
    <div className="bg-[#fefae0] min-h-screen font-serif flex flex-col items-center mx-auto">
      <Navbar />

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mt-8 w-full max-w-sm bg-[#fdfcf7] rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="flex flex-col items-center p-6">
            <div className="relative w-28 h-28 mb-4">
              <img
                src="https://static.promediateknologi.id/crop/0x5:800x598/0x0/webp/photo/p2/222/2024/08/14/3-63818274.jpg"
                alt="Bima"
                className="w-full h-full rounded-full border-4 border-[#2D1E17] object-cover shadow-md"
              />
              <div
                className="absolute bottom-0 right-0 bg-[#2D1E17] text-white p-1.5 rounded-full shadow hover:bg-[#2a0707] cursor-pointer transition-colors"
                onClick={handleEditClick}
              >
                <Edit size={16} />
              </div>
            </div>

            <h2 className="text-xl font-bold text-[#2D1E17] mb-1">
              {userData.name}
            </h2>
            <p className="text-sm text-gray-500 mb-4">Anggota Perpustakaan</p>

            <div className="w-full text-left text-sm text-gray-700 space-y-3">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-[#2D1E17]" />
                <span>{userData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-[#2D1E17]" />
                <span>{userData.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[#2D1E17]" />
                <span>{userData.address}</span>
              </div>
            </div>

            <button
              onClick={handleEditClick}
              className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#2D1E17] text-white rounded-full font-bold transition-colors duration-300 hover:bg-[#2a0707]"
            >
              <Edit size={16} />
              Ubah Data
            </button>

            {/* Tombol Logout */}
            <button
               onClick={() => {
                onLogout();
                navigate("/signin");
            }}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#2D1E17] text-white rounded-full font-bold transition-colors duration-300 hover:bg-[#2a0707]"
            >
              <LogOut size={16} />
              Keluar
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Modal Edit */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#fefae0] bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 30 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white w-full max-w-sm rounded-lg shadow-lg p-6 relative"
            >
              <button
                onClick={handleCancel}
                className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
              >
                <X size={20} />
              </button>
              <h3 className="text-lg font-bold mb-4 text-[#2D1E17]">
                Ubah Data Profil
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm">Nama</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1 border rounded mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1 border rounded mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm">Nomor Telepon</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1 border rounded mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm">Alamat</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1 border rounded mt-1"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-1.5 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-1.5 bg-[#2D1E17] text-white rounded hover:bg-[#2a0707] transition-colors"
                >
                  Simpan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <footer className="mt-8 p-4 text-sm text-gray-600 text-center">
        &copy; {new Date().getFullYear()} Perpustakaan Digital
      </footer>
    </div>
  );
}
