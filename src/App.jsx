import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import SignIn from "./Pages/SignIn";

// Admin
import AdminHome from "./Admin/Home";
import Kembalikan from "./Admin/KembaliIni";
import ManajemenBuku from "./Admin/ManajemenBuku";
import ManajemenAnggota from "./Admin/ManajemenAnggota";
import Peminjaman from "./Admin/Peminjaman";
import PinjamIni from "./Admin/PinjamIni";
import ProfileAdmin from "./Admin/Profile";
import TambahAnggota from "./Admin/TambahAnggota";
import TambahBuku from "./Admin/tambahbuku";
import EditAnggota from "./Admin/EditAnggota";
import EditBuku from "./Admin/EditBuku";

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
            <Route path="/admin/dashboard" element={<AdminHome onLogout={handleLogout} />} />
            <Route path="/admin/manajemen-buku" element={<ManajemenBuku />} />
            <Route path="/admin/add-books" element={<TambahBuku />} />
            <Route path="/admin/edit-books/:id" element={<EditBuku />} />
            <Route path="/admin/manajemen-anggota" element={<ManajemenAnggota />} />
            <Route path="/admin/add-members" element={<TambahAnggota />} />
            <Route path="/admin/edit-members/:id" element={<EditAnggota />} />
            <Route path="/admin/pengembalian" element={<Kembalikan />} />
            <Route path="/admin/peminjaman" element={<Peminjaman />} />
            <Route path="/admin/pinjam" element={<PinjamIni />} />
            <Route path="/admin/profile" element={<ProfileAdmin />} />
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
