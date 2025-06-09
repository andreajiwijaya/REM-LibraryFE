import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { Edit, Mail, X, LogOut, BadgeInfo, User, Settings, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Profil({ onLogout }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    role: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userData);

  const token = localStorage.getItem("token"); // Ambil token dari localStorage

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`https://rem-library.up.railway.app/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`, // Kirim token di header
          },
        });

        if (!res.ok) throw new Error("Gagal mengambil data user");

        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    if (token) fetchUserData();
  }, [token]);

  const handleEditClick = () => {
    setFormData(userData);
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`https://rem-library.up.railway.app/users/${userData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Kirim token saat update juga
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Gagal menyimpan data");

      const updated = await res.json();
      setUserData(updated);
      setIsEditing(false);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleCancel = () => setIsEditing(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    onLogout();
    navigate("/signin");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-32 w-64 h-64 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-100/20 to-blue-100/20 rounded-full blur-3xl"></div>
      </div>

      <Navbar />

      <div className="flex flex-col items-center px-4 py-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Main Profile Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden mb-6"
          >
            {/* Header Section with Gradient */}
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 text-center relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="relative w-32 h-32 mx-auto mb-4"
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-white/20 to-white/10 p-1 backdrop-blur-sm">
                    <img
                      src="https://static.promediateknologi.id/crop/0x5:800x598/0x0/webp/photo/p2/222/2024/08/14/3-63818274.jpg"
                      alt="User"
                      className="w-full h-full rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleEditClick}
                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-white text-indigo-600 rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-50 transition-colors"
                  >
                    <Edit size={18} />
                  </motion.button>
                </motion.div>
                
                <h2 className="text-2xl font-bold text-white mb-2">
                  {userData.username || "Loading..."}
                </h2>
                
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Shield size={16} className="text-white/80" />
                  <span className="text-white/90 text-sm font-medium capitalize">
                    {userData.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="p-8 space-y-6">
              <motion.div variants={itemVariants} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User size={20} className="text-indigo-500" />
                  Profile Information
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <User size={18} className="text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 font-medium">Username</p>
                      <p className="text-gray-800 font-semibold">{userData.username}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mail size={18} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 font-medium">Email</p>
                      <p className="text-gray-800 font-semibold">{userData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <BadgeInfo size={18} className="text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 font-medium">Role</p>
                      <p className="text-gray-800 font-semibold capitalize">{userData.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div variants={itemVariants} className="space-y-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEditClick}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Settings size={20} />
                  Edit Profile
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <LogOut size={20} />
                  Logout
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Modal Edit */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white/95 backdrop-blur-xl w-full max-w-md rounded-3xl shadow-2xl border border-white/30 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 text-center relative">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCancel}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X size={18} />
                </motion.button>
                <h3 className="text-xl font-bold text-white">Edit Profile</h3>
                <p className="text-white/80 text-sm mt-1">Update your profile information</p>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        placeholder="Enter username"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        placeholder="Enter email"
                      />
                    </div>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancel}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Save Changes
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center py-8 px-4 relative z-10"
      >
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl py-4 px-6 inline-block">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Digital Library Platform
          </p>
        </div>
      </motion.footer>
    </div>
  );
}