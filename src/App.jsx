import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // <-- IMPORT LIBRARY INI

// Import komponen Anda
import SignIn from "./Pages/SignIn";
import AdminHome from "./Admin/Home";
import Kembalikan from "./Admin/ManajemenPengembalian";
import ManajemenBuku from "./Admin/ManajemenBuku";
import ManajemenAnggota from "./Admin/ManajemenAnggota";
import Peminjaman from "./Admin/Peminjaman";
import ProfileAdmin from "./Admin/Profile";
import TambahAnggota from "./Admin/TambahAnggota";
import TambahBuku from "./Admin/tambahbuku";
import EditAnggota from "./Admin/EditAnggota";
import EditBuku from "./Admin/EditBuku";
import DashboardUser from "./User/Dashboard";
import BukuDipinjam from "./User/BukuDipinjam";
import DataBuku from "./User/DataBuku";
import ProfilUser from "./User/Profil";

function App() {
  
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          setRole(decodedToken.role);
        } else {
          localStorage.removeItem('token');
        }
      }
    } catch (error) {
      console.error("Gagal decode token:", error);

      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []); 

  const handleLogin = (token) => {
    try {
      localStorage.setItem('token', token);
      const decodedToken = jwtDecode(token);
      setRole(decodedToken.role); // Set role dari token baru
    } catch (error) {
      console.error("Gagal memproses token login:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setRole(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Memuat aplikasi...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Logika routing tidak berubah, tapi sekarang didasarkan pada state yang persisten */}
        {!role ? (
          <>
            <Route path="/signin" element={<SignIn onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </>
        ) : role === "admin" ? (
          <>
            <Route path="/admin/dashboard" element={<AdminHome onLogout={handleLogout} />} />
            <Route path="/admin/manajemen-buku" element={<ManajemenBuku />} />
            <Route path="/admin/add-books" element={<TambahBuku />} />
            <Route path="/admin/edit-books/:id" element={<EditBuku />} />
            <Route path="/admin/manajemen-anggota" element={<ManajemenAnggota />} />
            <Route path="/admin/add-members" element={<TambahAnggota />} />
            <Route path="/admin/edit-members/:id" element={<EditAnggota />} />
            <Route path="/admin/pengembalian" element={<Kembalikan />} />
            <Route path="/admin/peminjaman" element={<Peminjaman />} />
            <Route path="/admin/profile" element={<ProfileAdmin onLogout={handleLogout} />} />
            {/* Redirect dari root ke dashboard admin jika sudah login sebagai admin */}
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </>
        ) : ( // role === "user"
          <>
            <Route path="/user/dashboard" element={<DashboardUser onLogout={handleLogout} />} />
            <Route path="/user/buku" element={<DataBuku />} />
            <Route path="/user/buku-dipinjam" element={<BukuDipinjam />} />
            <Route path="/user/profil" element={<ProfilUser onLogout={handleLogout} />} />
            {/* Redirect dari root ke dashboard user jika sudah login sebagai user */}
            <Route path="/" element={<Navigate to="/user/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;