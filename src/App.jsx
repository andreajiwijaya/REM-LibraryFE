import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import SignIn from "./pages/SignIn";

// Admin
import AdminHome from "./admin/Home";
import Kembalikan from "./admin/KembaliIni";
import ManajemenBuku from "./admin/ManajemenBuku";
import ManajemenAnggota from "./admin/ManajemenAnggota";
import Peminjaman from "./admin/Peminjaman";
import PinjamIni from "./admin/PinjamIni";
import ProfileAdmin from "./admin/Profile";
import TambahBuku from "./admin/tambahbuku";
import TambahAnggota from "./admin/TambahAnggota";
import EditAnggota from "./admin/EditAnggota";
import EditBuku from "./admin/EditBuku";

// User
import DashboardUser from "./user/Dashboard";
import BukuDipinjam from "./user/BukuDipinjam";
import DataBuku from "./user/DataBuku";
import ProfilUser from "./user/Profil";

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
            <Route path="/books/edit/:id" element={<EditBuku />} />
            <Route path="/manajemen-anggota" element={<ManajemenAnggota />} />
            <Route path="/members/add" element={<TambahAnggota />} />
            <Route path="/members/edit/:id" element={<EditAnggota />} />
            <Route path="/kembalikan" element={<Kembalikan />} />
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
