// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import SignIn from './SignIn';
import Layout from './Layout';
import Home from './Home';
import ManajemenBuku from './ManajemenBuku';
import ManajemenAnggota from './ManajemenAnggota';
import Peminjaman from './Peminjaman';
import PinjamIni from './PinjamIni';
import PengembalianIni from './KembaliIni';
import Notifikasi from './Notifikasi';
import Profile from './Profile';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        {!isLoggedIn ? (
          <>
            <Route path="/signin" element={<SignIn onLogin={() => setIsLoggedIn(true)} />} />
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/manajemen-buku" element={<ManajemenBuku />} />
            <Route path="/manajemen-anggota" element={<ManajemenAnggota />} />
            <Route path="/peminjaman" element={<Peminjaman />} />
            <Route path="/peminjaman-hari-ini" element={<PinjamIni />} />
            <Route path="/pengembalian-hari-ini" element={<PengembalianIni />} />
            <Route path="/notifikasi" element={<Notifikasi />} />
            <Route path="/profile" element={<Profile />} /> 
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
