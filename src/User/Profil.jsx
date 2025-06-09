import React, { useState, useEffect } from "react";
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
        setFormData(data); // Also set formData initially
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    if (token) fetchUserData();
  }, [token]);

  const handleEditClick = () => {
    setFormData(userData); // Ensure formData is in sync with current userData
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
      alert("Failed to update profile: " + err.message); // Provide user feedback
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
    <div className="min-h-screen bg-[#fefae0] relative overflow-hidden">
      {/* Subtle background pattern/texture */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23d4c6a6\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 6V5zM6 5v1H5z\'/%3E%3C/g%3E%3C/svg%3E")', backgroundSize: '30px 30px' }}></div>

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
            className="bg-white rounded-3xl shadow-2xl border border-[#d4c6a6] overflow-hidden mb-6"
          >
            {/* Header Section */}
            <div className="bg-[#2D1E17] p-8 text-center relative">
              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="relative w-32 h-32 mx-auto mb-4"
                >
                  <div className="w-full h-full rounded-full bg-[#4a2515] p-1 shadow-inner flex items-center justify-center">
                    <img
                      src="https://static.promediateknologi.id/crop/0x5:800x598/0x0/webp/photo/p2/222/2024/08/14/3-63818274.jpg"
                      alt="User"
                      className="w-full h-full rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: "#e8d2ac" }} // Lighter cream on hover
                    whileTap={{ scale: 0.9 }}
                    onClick={handleEditClick}
                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#fefae0] text-[#2D1E17] rounded-full shadow-lg flex items-center justify-center transition-colors"
                  >
                    <Edit size={18} />
                  </motion.button>
                </motion.div>

                <h2 className="text-2xl font-bold text-[#fefae0] mb-2">
                  {userData.username || "Loading..."}
                </h2>

                <div className="inline-flex items-center gap-2 bg-[#4a2515] px-4 py-2 rounded-full shadow-inner text-[#fefae0]">
                  <Shield size={16} className="text-[#fefae0]" />
                  <span className="text-sm font-medium capitalize">
                    {userData.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="p-8 space-y-6 bg-[#fefae0]">
              <motion.div variants={itemVariants} className="space-y-4">
                <h3 className="text-lg font-semibold text-[#2D1E17] mb-4 flex items-center gap-2">
                  <User size={20} className="text-[#4a2515]" />
                  Profile Information
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-[#d4c6a6] shadow-sm">
                    <div className="w-10 h-10 bg-[#e8d2ac] rounded-full flex items-center justify-center shadow-inner">
                      <User size={18} className="text-[#4a2515]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-[#2D1E17]/70 font-medium">Username</p>
                      <p className="text-[#2D1E17] font-semibold">{userData.username}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-[#d4c6a6] shadow-sm">
                    <div className="w-10 h-10 bg-[#e8d2ac] rounded-full flex items-center justify-center shadow-inner">
                      <Mail size={18} className="text-[#4a2515]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-[#2D1E17]/70 font-medium">Email</p>
                      <p className="text-[#2D1E17] font-semibold">{userData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-[#d4c6a6] shadow-sm">
                    <div className="w-10 h-10 bg-[#e8d2ac] rounded-full flex items-center justify-center shadow-inner">
                      <BadgeInfo size={18} className="text-[#4a2515]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-[#2D1E17]/70 font-medium">Role</p>
                      <p className="text-[#2D1E17] font-semibold capitalize">{userData.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div variants={itemVariants} className="space-y-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2, backgroundColor: "#3e1f0d" }} // Darker brown on hover
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEditClick}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#4a2515] text-[#fefae0] rounded-2xl font-semibold shadow-md transition-all duration-300"
                >
                  <Settings size={20} />
                  Edit Profile
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2, backgroundColor: "#7e2a2a" }} // Slightly lighter red for hover
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#6b1e1e] text-[#fefae0] rounded-2xl font-semibold shadow-md transition-all duration-300"
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
            className="fixed inset-0 bg-[#2D1E17]/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-[#d4c6a6] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-[#2D1E17] p-6 text-center relative">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90, backgroundColor: "#4a2515" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCancel}
                  className="absolute top-4 right-4 w-8 h-8 bg-[#4a2515] text-[#fefae0] rounded-full flex items-center justify-center transition-colors"
                >
                  <X size={18} />
                </motion.button>
                <h3 className="text-xl font-bold text-[#fefae0]">Edit Profile</h3>
                <p className="text-[#fefae0]/80 text-sm mt-1">Update your profile information</p>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6 bg-[#fefae0]">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#2D1E17] mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2D1E17]/60" />
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-[#d4c6a6] rounded-xl focus:ring-1 focus:ring-[#4a2515] focus:border-[#4a2515] outline-none transition-all text-[#2D1E17] shadow-sm"
                        placeholder="Enter username"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2D1E17] mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2D1E17]/60" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-[#d4c6a6] rounded-xl focus:ring-1 focus:ring-[#4a2515] focus:border-[#4a2515] outline-none transition-all text-[#2D1E17] shadow-sm"
                        placeholder="Enter email"
                      />
                    </div>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: "#e8d2ac" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancel}
                    className="flex-1 px-4 py-3 bg-[#fcf7e8] text-[#2D1E17] rounded-2xl font-semibold shadow-sm transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: "#3e1f0d" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="flex-1 px-4 py-3 bg-[#4a2515] text-[#fefae0] rounded-2xl font-semibold shadow-md transition-all"
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
        <div className="bg-white rounded-2xl py-4 px-6 inline-block shadow-md border border-[#d4c6a6]">
          <p className="text-sm text-[#2D1E17]/80">
            &copy; {new Date().getFullYear()} Raema Perpustakaan Digital. All rights reserved.
          </p>
        </div>
      </motion.footer>
    </div>
  );
}