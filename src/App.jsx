import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import SignIn from "./Pages/SignIn";

// Admin
import AdminHome from "./Admin/Home";
import Kembalikan from "./Admin/KembaliIni";
import ManajemenBuku from "./Admin/ManajemenBuku";
import ManajemenAnggota from "./Admin/ManajemenAnggota";
import Notifikasi from "./Admin/Notifikasi";
import Peminjaman from "./Admin/Peminjaman";
import PinjamIni from "./Admin/PinjamIni";
import ProfileAdmin from "./Admin/Profile";
import TambahBuku from "./Admin/tambahbuku";
import TambahAnggota from "./Admin/tambahanggota";

// User
import DashboardUser from "./User/Dashboard";
import BukuDipinjam from "./User/BukuDipinjam";
import DataBuku from "./User/DataBuku";
import ProfilUser from "./User/Profil";

function App() {
  const [role, setRole] = useState(null);

  const handleLogin = (userRole) => {
    setRole(userRole);
  };

  const handleLogout = () => {
    setRole(null);
  };

  return (
    <Router>
      <Routes>
        {!role ? (
          <>
            <Route path="/signin" element={<SignIn onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </>
        ) : role === "admin" ? (
          <>
            <Route path="/" element={<AdminHome onLogout={handleLogout} />} />
            <Route path="/manajemen-buku" element={<ManajemenBuku />} />
            <Route path="/books/add" element={<TambahBuku />} />
            <Route path="/manajemen-anggota" element={<ManajemenAnggota />} />
            <Route path="/members/add" element={<TambahAnggota />} />
            <Route path="/kembalikan" element={<Kembalikan />} />
            <Route path="/notifikasi" element={<Notifikasi />} />
            <Route path="/peminjaman" element={<Peminjaman />} />
            <Route path="/pinjam" element={<PinjamIni />} />
            <Route path="/profile-admin" element={<ProfileAdmin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<DashboardUser onLogout={handleLogout} />} />
            <Route path="/user/buku" element={<DataBuku />} />
            <Route path="/user/buku-dipinjam" element={<BukuDipinjam />} />
            <Route path="/user/profil" element={<ProfilUser />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
