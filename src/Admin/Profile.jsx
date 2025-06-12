import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import {
  FaUserEdit as FaUserEditReact, FaKey as FaKeyReact, FaSignOutAlt as FaSignOutAltReact, FaArrowLeft as FaArrowLeftReact,
  FaUserCircle as FaUserCircleReact, FaEnvelope as FaEnvelopeReact
} from 'react-icons/fa'; // Sticking to original react-icons/fa for consistent icons.
import { User, Settings, Shield } from 'lucide-react'; // Keeping Lucide icons for general use as they were already there.

import '../index.css'; // Assume this file exists for basic styling

export default function Profile({ onLogout }) { // Accept onLogout prop
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '', // Used for display, maps to API 'username'
    username: '', // Direct username from API
    email: '',
    role: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempUser, setTempUser] = useState({ ...userData }); // Initialize with initial userData structure
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });
  const [loading, setLoading] = useState(true); // Loading state for initial fetch

  const token = localStorage.getItem("token"); // Get token from localStorage

  // Function to display a custom message box
  const showMessageBox = (title, message) => {
    const messageBox = document.createElement('div');
    messageBox.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    messageBox.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        <p class="text-lg font-semibold ${title === "Error" ? "text-red-600" : "text-green-600"} mb-4">${title}</p>
        <p class="text-gray-700 mb-6">${message}</p>
        <button id="closeMessageBox" class="px-4 py-2 bg-[#4a2515] text-white rounded-md hover:bg-[#3e1f0d] transition-colors">Tutup</button>
      </div>
    `;
    document.body.appendChild(messageBox);

    document.getElementById('closeMessageBox').onclick = () => {
      document.body.removeChild(messageBox);
    };
  };

  // Handle logout functionality
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    // Call the onLogout prop if it's a function
    if (typeof onLogout === 'function') {
      onLogout();
    } else {
      console.warn("onLogout prop is not a function or not provided.");
    }
    navigate("/signin");
  };

  // Effect to fetch user data on component mount or token change
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://rem-library.up.railway.app/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in the header
          },
        });

        // Handle token expiration or invalidity
        if (res.status === 401) {
          handleLogout(); // Force logout
          showMessageBox("Sesi Kadaluarsa", "Sesi Anda telah berakhir. Mohon masuk kembali.");
          return;
        }

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Gagal mengambil data user");
        }

        const data = await res.json();
        setUserData({
          ...data,
          name: data.username || '', // Map API 'username' to local 'name' for display
        });
        setTempUser({
          ...data,
          name: data.username || '', // Map API 'username' to local 'name' for temporary editing
        }); // Also set tempUser initially
      } catch (err) {
        console.error("Fetch error:", err);
        showMessageBox("Error", `Gagal mengambil data profil: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserData();
    } else {
      // If no token, maybe redirect to login or handle unauthenticated state
      setLoading(false);
      showMessageBox("Peringatan", "Anda tidak terautentikasi. Mohon masuk.");
      navigate("/signin");
    }
  }, [token, navigate]); // Add navigate to dependency array

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempUser({ ...tempUser, [name]: value });
  };

  const handleSave = async () => {
    try {
      // Prepare payload to send to API
      const payload = {
        username: tempUser.name, // Send local 'name' (edited username) to API as 'username'
        email: tempUser.email,
        role: tempUser.role, // <-- Added role to payload
      };

      console.log("Payload yang dikirim:", payload); // Log payload for debugging

      const res = await fetch(`https://rem-library.up.railway.app/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token for update
        },
        body: JSON.stringify(payload), // Send the prepared payload
      });

      // Handle token expiration or invalidity during save
      if (res.status === 401) {
        handleLogout(); // Clear token and redirect to sign-in
        showMessageBox("Sesi Kadaluarsa", "Sesi Anda telah berakhir. Mohon masuk kembali.");
        return;
      }

      if (!res.ok) {
        const errorData = await res.json(); // Attempt to parse error data
        console.error("Respons error dari server:", errorData); // Log server error response
        // Use the error message from the server if available, otherwise a generic one
        throw new Error(errorData.message || "Gagal menyimpan data");
      }

      const updatedData = await res.json();
      console.log("Data yang diterima setelah update:", updatedData); // Log updated data from server

      // Update userData and tempUser with the response from the server
      setUserData({
        ...updatedData,
        name: updatedData.username || '', // Map API 'username' back to local 'name'
      });
      setTempUser({
        ...updatedData,
        name: updatedData.username || '', // Map API 'username' back to local 'name'
      });
      setIsEditing(false);
      showMessageBox("Sukses", "Profil berhasil diperbarui!");
    } catch (err) {
      console.error("Update error:", err);
      showMessageBox("Error", `Gagal memperbarui profil: ${err.message}`);
    }
  };

  const handleCancel = () => {
    setTempUser({ ...userData }); // Reset tempUser to original userData
    setIsEditing(false);
  };

  const handleSubmitPassword = (e) => {
    e.preventDefault();
    // Client-side validation for password change
    if (passwordData.newPass !== passwordData.confirm) {
      showMessageBox('Error', 'Password baru dan konfirmasi tidak cocok.');
      return;
    }
    // TODO: Implement API call for password change here.
    // For now, it's just client-side validation
    showMessageBox('Sukses', 'Password berhasil diubah (simulasi)!');
    setPasswordData({ current: '', newPass: '', confirm: '' });
    setShowPasswordForm(false);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fefae0]">
        <div className="text-center text-[#2D1E17]">
          <FaUserCircleReact className="text-4xl animate-pulse mx-auto mb-4" /> {/* Using React-Icons */}
          <p className="text-lg">Memuat Profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 flex flex-col min-h-screen bg-[#fff9e6]">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Link to="/admin/dashboard" className="mr-4 p-2 rounded-full hover:bg-[#2D1E17]/10">
            <FaArrowLeftReact className="text-[#2D1E17]" /> {/* Using React-Icons */}
          </Link>
          <h2 className="text-2xl font-bold text-[#2D1E17]">Profil Saya</h2>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 bg-[#2D1E17] text-[#fff9e6] rounded-lg hover:bg-[#2D1E17]/90"
          >
            <FaUserEditReact className="mr-2" /> Edit Profil {/* Using React-Icons */}
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
                <FaUserCircleReact className="text-[#2D1E17] text-8xl" /> {/* Using React-Icons */}
              </div>

              <h3 className="text-xl font-bold text-[#2D1E17] text-center">
                {isEditing ? (
                  <input
                    type="text"
                    name="name" // This input will now control the 'username' on save
                    value={tempUser.name}
                    onChange={handleInputChange}
                    className="w-full text-center border-b border-[#2D1E17] focus:outline-none"
                  />
                ) : (
                  userData.name || userData.username // Display name or username
                )}
              </h3>
              <p className="text-gray-500 mt-1">{userData.role}</p> {/* Display role here */}

              <div className="w-full mt-6 space-y-4">
                <button
                  onClick={handleLogout} // Use handleLogout for actual logout
                  className="flex items-center w-full px-4 py-2 bg-[#2D1E17]/10 text-[#2D1E17] rounded-lg hover:bg-[#2D1E17]/20"
                >
                  <FaSignOutAltReact className="mr-3" /> Keluar {/* Using React-Icons */}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Profil */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-[#2D1E17] mb-6">Informasi Profil</h3>

            <div className="space-y-6">
              {/* Username Input Field */}
              <div className="flex items-start">
                <div className="p-3 bg-[#2D1E17]/10 text-[#2D1E17] rounded-full mr-4">
                  <User size={20} className="text-[#2D1E17]" /> {/* Using Lucide React */}
                </div>
                <div className="flex-1">
                  <h4 className="text-gray-500 text-sm">Nama Pengguna</h4>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name" // This input updates tempUser.name, which is mapped to API 'username'
                      value={tempUser.name}
                      onChange={handleInputChange}
                      className="w-full border-b border-[#2D1E17] focus:outline-none py-1"
                      placeholder="Masukkan nama pengguna"
                    />
                  ) : (
                    <p className="text-gray-800">{userData.name || userData.username}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start">
                <div className="p-3 bg-[#2D1E17]/10 text-[#2D1E17] rounded-full mr-4">
                  <FaEnvelopeReact /> {/* Using React-Icons */}
                </div>
                <div className="flex-1">
                  <h4 className="text-gray-500 text-sm">Email</h4>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={tempUser.email}
                      onChange={handleInputChange}
                      className="w-full border-b border-[#2D1E17] focus:outline-none py-1"
                      placeholder="Masukkan email"
                    />
                  ) : (
                    <p className="text-gray-800">{userData.email}</p>
                  )}
                </div>
              </div>

              {/* Role - Made Editable */}
              <div className="flex items-start">
                <div className="p-3 bg-[#2D1E17]/10 text-[#2D1E17] rounded-full mr-4">
                  <Shield size={20} className="text-[#2D1E17]" /> {/* Using Lucide React */}
                </div>
                <div className="flex-1">
                  <h4 className="text-gray-500 text-sm">Role</h4>
                  {isEditing ? (
                    <input
                      type="text"
                      name="role" // Name matches the state field
                      value={tempUser.role}
                      onChange={handleInputChange}
                      className="w-full border-b border-[#2D1E17] focus:outline-none py-1"
                      placeholder="Masukkan peran"
                    />
                    
                  ) : (
                    <p className="text-gray-800">{userData.role}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
