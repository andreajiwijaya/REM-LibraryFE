import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Layout from './Layout';
import Home from './Home';
import ManajemenBuku from './ManajemenBuku';
import ManajemenAnggota from './ManajemenAnggota';
import Peminjaman from './Peminjaman';
import PinjamIni from './PinjamIni';
import PengembalianIni from './KembaliIni'; 
import Notifikasi from './Notifikasi';

function AppWrapper() {
  const location = useLocation();

  // State untuk menyimpan apakah notifikasi sudah dibaca
  const [isNotifikasiRead, setIsNotifikasiRead] = useState(() => {
    // Ambil dari localStorage, default false artinya belum dibaca
    const saved = localStorage.getItem('isNotifikasiRead');
    return saved === 'true'; 
  });

  // Efek: Jika user buka halaman /notifikasi, tandai sudah dibaca
  useEffect(() => {
    if (location.pathname === '/notifikasi' && !isNotifikasiRead) {
      setIsNotifikasiRead(true);
      localStorage.setItem('isNotifikasiRead', 'true');
    }
  }, [location.pathname, isNotifikasiRead]);

  // hasNotification true kalau belum baca
  const hasNotification = !isNotifikasiRead;

  // Fungsi untuk wrap halaman dengan Layout kecuali halaman notifikasi
  const renderWithLayout = (component) => (
    <Layout hasNotification={hasNotification}>{component}</Layout>
  );

  return (
    <Routes>
      <Route path="/" element={renderWithLayout(<Home />)} />
      <Route path="/manajemen-buku" element={renderWithLayout(<ManajemenBuku />)} />
      <Route path="/manajemen-anggota" element={renderWithLayout(<ManajemenAnggota />)} />
      <Route path="/peminjaman" element={renderWithLayout(<Peminjaman />)} />
      <Route path="/peminjaman-hari-ini" element={renderWithLayout(<PinjamIni />)} />
      <Route path="/pengembalian-hari-ini" element={renderWithLayout(<PengembalianIni />)} />
      
      {/* Notifikasi tanpa layout */}
      <Route path="/notifikasi" element={<Notifikasi />} />
    </Routes>
  );
}

export default AppWrapper;
