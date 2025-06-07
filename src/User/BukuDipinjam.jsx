import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import {Pencil, Calendar, BookOpen, Clock, CheckCircle, AlertTriangle,} from "lucide-react";

function BukuDipinjam() {
  const [bukuDipinjam, setBukuDipinjam] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem("bukuDipinjam");
    if (data) {
      setBukuDipinjam(JSON.parse(data));
    }
  }, []);

  const hitungTenggat = (tanggalPinjam) => {
    const tanggal = new Date(tanggalPinjam);
    tanggal.setDate(tanggal.getDate() + 7);
    return tanggal;
  };

  const statusTerlambat = (tanggalPinjam) => {
    return new Date() > hitungTenggat(tanggalPinjam)
      ? "Terlambat"
      : "Belum Terlambat";
  };

  const handleKembalikan = (id) => {
    if (window.confirm("Yakin ingin mengembalikan buku ini?")) {
      const updatedList = bukuDipinjam.filter((buku) => buku.id !== id);
      setBukuDipinjam(updatedList);
      localStorage.setItem("bukuDipinjam", JSON.stringify(updatedList));

      const dataPeminjaman = JSON.parse(localStorage.getItem("dataPeminjaman"));
      if (dataPeminjaman) {
        const updatedPeminjaman = dataPeminjaman.filter((p) => p.id !== id);
        localStorage.setItem("dataPeminjaman", JSON.stringify(updatedPeminjaman));
      }

      const dataBuku = JSON.parse(localStorage.getItem("dataBuku"));
      if (dataBuku) {
        const updatedBuku = dataBuku.map((b) =>
          b.id === id ? { ...b, tersedia: b.tersedia + 1 } : b
        );
        localStorage.setItem("dataBuku", JSON.stringify(updatedBuku));
      }

      alert("📚 Buku berhasil dikembalikan!");
    }
  };

  if (bukuDipinjam.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fefae0] to-[#e6dcc8] text-[#2e2e2e] font-serif">
        <Navbar />
        <main className="max-w-5xl mx-auto p-8 text-center">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-[#d6caa3]/30 p-12 animate-pulse">
            <BookOpen size={80} className="mx-auto text-[#3e1f0d]/50 mb-6" />
            <h2 className="text-5xl font-bold text-[#3e1f0d] mb-2">📚 Buku Dipinjam</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#3e1f0d] to-[#d6caa3] mx-auto mb-4 rounded-full" />
            <p className="text-xl text-gray-600">Anda belum meminjam buku apapun.</p>
            <p className="text-gray-500 mt-2">Silakan telusuri koleksi kami!</p>
          </div>
        </main>
        <footer className="mt-12 p-6 text-sm text-gray-500 text-center bg-white/30 backdrop-blur-sm">
          &copy; {new Date().getFullYear()} Perpustakaan Digital
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fefae0] to-[#e6dcc8] text-[#2e2e2e] font-serif">
      <Navbar />

      <header className="bg-gradient-to-r from-[#f2e8cf] to-[#fefae0] py-12 shadow-inner relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg...')]"></div>
        <div className="relative text-center">
          <BookOpen size={48} className="mx-auto text-[#3e1f0d] mb-4" />
          <h2 className="text-5xl font-bold text-[#3e1f0d]">📚 Buku Dipinjam</h2>
          <p className="mt-2 text-[#3e1f0d]/70 text-lg">Kelola koleksi buku yang Anda pinjam</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatBox icon={<BookOpen />} title="Total Dipinjam" value={bukuDipinjam.length} />
          <StatBox
            icon={<CheckCircle className="text-green-600" />}
            title="Tepat Waktu"
            value={bukuDipinjam.filter(b => statusTerlambat(b.dateBorrowed) === "Belum Terlambat").length}
            color="green"
          />
          <StatBox
            icon={<AlertTriangle className="text-red-600" />}
            title="Terlambat"
            value={bukuDipinjam.filter(b => statusTerlambat(b.dateBorrowed) === "Terlambat").length}
            color="red"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {bukuDipinjam.map((buku) => {
            const tenggat = hitungTenggat(buku.dateBorrowed);
            const status = statusTerlambat(buku.dateBorrowed);
            const isLate = status === "Terlambat";

            return (
              <div
                key={buku.id}
                className={`group bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 ${
                  isLate ? "border-red-200 ring-2 ring-red-100" : "border-[#d6caa3]/30"
                } transition-transform hover:scale-[1.03]`}
              >
                {isLate && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full shadow">
                    TERLAMBAT
                  </div>
                )}

                <div className="aspect-[2/3] relative">
                  <img
                    src={buku.cover}
                    alt={buku.title}
                    className="absolute inset-0 w-full h-full object-cover rounded-t-3xl"
                    loading="lazy"
                  />
                </div>

                <div className="p-6 flex flex-col space-y-4">
                  <div>
                    <h4 className="font-bold text-xl text-[#3e1f0d] line-clamp-2">{buku.title}</h4>
                    <p className="flex items-center text-gray-700">
                      <Pencil size={16} className="mr-2" />
                      {buku.author}
                    </p>
                  </div>

                  <div className="text-sm space-y-2">
                    <DateInfo icon={<Calendar size={16} />} label="Tanggal Pinjam" value={buku.dateBorrowed} />
                    <DateInfo icon={<Calendar size={16} />} label="Batas Pengembalian" value={tenggat.toLocaleDateString()} />
                    <StatusBadge status={status} />
                  </div>

                  <button
                    onClick={() => handleKembalikan(buku.id)}
                    className="mt-auto bg-gradient-to-r from-red-500 to-red-700 text-white font-bold rounded-2xl py-3 transition hover:shadow-lg"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <BookOpen size={18} />
                      Kembalikan Buku
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="mt-16 bg-white/40 backdrop-blur-sm border-t border-[#d6caa3]/30">
        <div className="max-w-7xl mx-auto p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen size={24} className="text-[#3e1f0d]" />
            <span className="text-lg font-semibold text-[#3e1f0d]">Perpustakaan Digital</span>
          </div>
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Menghubungkan Anda dengan Dunia Pengetahuan
          </p>
        </div>
      </footer>
    </div>
  );
}

// Komponen tambahan untuk perapian
const StatBox = ({ icon, title, value, color = "brown" }) => {
  const baseColor = color === "green" ? "text-green-600" : color === "red" ? "text-red-600" : "text-[#3e1f0d]";
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center hover:scale-105 transition">
      <div className={`mx-auto mb-3 ${baseColor}`}>{icon}</div>
      <h3 className={`text-2xl font-bold ${baseColor}`}>{value}</h3>
      <p className="text-gray-600 font-medium">{title}</p>
    </div>
  );
};

const DateInfo = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3 text-gray-700">
    {icon}
    <div>
      <p className="font-medium">{label}</p>
      <p className="text-gray-600">{value}</p>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const isLate = status === "Terlambat";
  return (
    <div
      className={`flex items-center gap-2 font-semibold rounded-lg p-3 ${
        isLate
          ? "bg-red-50 text-red-700 border border-red-200"
          : "bg-green-50 text-green-700 border border-green-200"
      }`}
    >
      <Clock size={16} />
      <div className="flex-1">
        <p className="text-xs uppercase opacity-70">Status</p>
        <p className="font-bold">{status}</p>
      </div>
      {isLate ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
    </div>
  );
};

export default BukuDipinjam;
