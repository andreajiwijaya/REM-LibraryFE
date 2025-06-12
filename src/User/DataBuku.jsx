import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Search,
  BookOpen,
  AlertCircle,
  Star,
  Bookmark,
  Heart,
  Loader2,
  Library,
} from "lucide-react";

// Existing ModalKonfirmasi component (no changes needed)
const ModalKonfirmasi = ({ show, onClose, onConfirm, pesan }) => {
  if (!show) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white rounded-2xl p-8 w-full max-w-md text-center shadow-2xl border border-gray-100"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-[#2D1E17] to-[#d4a373] rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={32} className="text-white" />
        </div>
        <p className="mb-6 text-[#2D1E17] text-lg font-medium leading-relaxed">
          {pesan}
        </p>
        <div className="flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onConfirm}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Ya, Lanjutkan
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Batal
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

function DataBuku() {
  const [searchQuery, setSearchQuery] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("all"); // 'all' untuk semua kategori
  const [modal, setModal] = useState({ show: false, pesan: "", aksi: null });

  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [booksError, setBooksError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10); // Number of books per page

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  const [favoritesStatus, setFavoritesStatus] = useState({}); // { bookId: true/false }
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [favoritesError, setFavoritesError] = useState(null);

  const [myBorrows, setMyBorrows] = useState([]); // Array of borrowed book objects from API
  const [userData, setUserData] = useState(null); // To store current user data for userId

  const [ratings, setRatings] = useState(() => {
    const savedRatings = localStorage.getItem("bukuRatings");
    return savedRatings ? JSON.parse(savedRatings) : {};
  });

  const token = localStorage.getItem("token");

  const showMessageBox = (title, message) => {
    const messageBox = document.createElement("div");
    messageBox.className =
      "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
    messageBox.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        <p class="text-lg font-semibold ${
          title === "Error" ? "text-red-600" : "text-green-600"
        } mb-4">${title}</p>
        <p class="text-gray-700 mb-6">${message}</p>
        <button id="closeMessageBox" class="px-4 py-2 bg-[#4a2515] text-white rounded-md hover:bg-[#3e1f0d] transition-colors">Tutup</button>
      </div>
    `;
    document.body.appendChild(messageBox);

    document.getElementById("closeMessageBox").onclick = () => {
      document.body.removeChild(messageBox);
    };
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`https://rem-library.up.railway.app/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Gagal mengambil data user");
        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.error("Fetch user data error:", err);
      }
    };
    if (token) fetchUserData();
  }, [token]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      setCategoriesError(null);
      try {
        const res = await fetch(
          `https://rem-library.up.railway.app/categories`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Gagal mengambil kategori");
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch categories error:", err);
        setCategoriesError(err.message);
      } finally {
        setLoadingCategories(false);
      }
    };
    if (token) fetchCategories();
  }, [token]);

  const fetchBooks = useCallback(async () => {
    setBooksError(null);
    try {
      let baseUrl;
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
      });

      const useCategoryFilter = kategoriFilter && kategoriFilter !== "all";

      if (searchQuery && !useCategoryFilter) {
        baseUrl = `https://rem-library.up.railway.app/books/search`;
        params.append("title", searchQuery);
      } else {
        baseUrl = `https://rem-library.up.railway.app/books`;
        if (useCategoryFilter) {
          params.append("category", kategoriFilter);
        }
      }

      const finalUrl = `${baseUrl}?${params.toString()}`;
      console.log("Fetching books from URL:", finalUrl);

      const res = await fetch(finalUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error response data for books:", errorData);
        throw new Error(errorData.message || "Gagal mengambil buku");
      }

      const data = await res.json();
      console.log("Raw book data from API:", data);

      // --- PERBAIKAN DIMULAI DI SINI ---
      let booksArray = [];
      let fetchedTotalPages = 1;

      // Cek apakah respons API adalah array langsung (hasil dari /search)
      if (Array.isArray(data)) {
        booksArray = data;
        fetchedTotalPages = 1; // Asumsi hasil search tidak memiliki paginasi
      }
      // Cek apakah respons API adalah objek dengan properti .data (hasil dari /books biasa)
      else if (data && Array.isArray(data.data)) {
        booksArray = data.data;
        fetchedTotalPages = data.meta ? data.meta.totalPages : 1;
      }
      // --- PERBAIKAN SELESAI DI SINI ---

      // Terapkan filter judul di sisi klien HANYA jika filter kategori aktif
      if (searchQuery && useCategoryFilter) {
        // Pastikan booksArray yang sudah di-parse yang difilter
        booksArray = booksArray.filter((book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setBooks(booksArray);
      setTotalPages(fetchedTotalPages);
    } catch (err) {
      console.error("Fetch books error (catch block):", err);
      setBooksError(err.message);
    } finally {
      setLoadingBooks(false);
    }
  }, [currentPage, limit, searchQuery, kategoriFilter, token]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const fetchFavoriteStatus = useCallback(async () => {
    if (!userData?.id) {
      setLoadingFavorites(false);
      setFavoritesStatus({});
      return;
    }
    setLoadingFavorites(true);
    setFavoritesError(null);
    try {
      const res = await fetch(
        `https://rem-library.up.railway.app/favorites/user/${userData.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Gagal mengambil status favorit");
      const data = await res.json();
      const status = {};
      if (Array.isArray(data)) {
        data.forEach((fav) => {
          if (fav.bookId) status[fav.bookId] = true;
        });
      }
      setFavoritesStatus(status);
    } catch (err) {
      console.error("Fetch favorite status error:", err);
      setFavoritesError(err.message);
    } finally {
      setLoadingFavorites(false);
    }
  }, [userData, token]);

  useEffect(() => {
    fetchFavoriteStatus();
  }, [fetchFavoriteStatus]);

  const fetchMyBorrows = useCallback(async () => {
    if (!userData?.id) {
      setMyBorrows([]);
      return;
    }
    setMyBorrows([]);
    try {
      const res = await fetch(`https://rem-library.up.railway.app/borrows/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gagal mengambil buku dipinjam");
      const data = await res.json();
      setMyBorrows(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch my borrows error:", err);
    }
  }, [userData, token]);

  useEffect(() => {
    fetchMyBorrows();
  }, [fetchMyBorrows]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const konfirmasiPinjam = (bookId) => {
    if (!userData?.id) {
      showMessageBox("Peringatan", "Mohon login untuk meminjam buku.");
      return;
    }
    if (
      myBorrows.some((borrow) => borrow.bookId === bookId && !borrow.returnDate)
    ) {
      showMessageBox("Peringatan", "📚 Buku ini sudah Anda pinjam.");
      return;
    }

    const book = books.find((b) => b.id === bookId);
    if (!book || book.availableCopies <= 0) {
      showMessageBox(
        "Peringatan",
        "📚 Maaf, buku ini tidak tersedia untuk dipinjam."
      );
      return;
    }

    setModal({
      show: true,
      pesan: `Yakin ingin meminjam buku "${book.title}"? Maksimal 7 hari.`,
      aksi: () => handlePinjam(bookId),
    });
  };

  const handlePinjam = async (bookId) => {
    setModal({ show: false, pesan: "", aksi: null });
    try {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);

      const payload = {
        bookId: bookId,
        dueDate: dueDate.toISOString(),
        notes: "Peminjaman dari halaman DataBuku",
      };

      const res = await fetch(`https://rem-library.up.railway.app/borrows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal meminjam buku");
      }

      showMessageBox("Sukses", "📚 Buku berhasil dipinjam!");
      fetchBooks();
      fetchMyBorrows();
    } catch (err) {
      console.error("Borrow book error:", err);
      showMessageBox("Error", `Gagal meminjam buku: ${err.message}`);
    }
  };

  const konfirmasiKembalikan = (bookId) => {
    const borrowRecord = myBorrows.find(
      (b) => b.bookId === bookId && !b.returnDate
    );
    if (!borrowRecord) {
      showMessageBox("Peringatan", "Buku ini tidak sedang Anda pinjam.");
      return;
    }
    setModal({
      show: true,
      pesan: `Yakin ingin mengembalikan buku "${
        borrowRecord.book?.title || "ini"
      }"?`,
      aksi: () => handleKembalikan(borrowRecord.id),
    });
  };

  const handleKembalikan = async (borrowId) => {
    setModal({ show: false, pesan: "", aksi: null });
    console.log(borrowId);
    try {
      const res = await fetch(
        `https://rem-library.up.railway.app/borrows/${borrowId}/return`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal mengembalikan buku");
      }

      showMessageBox("Sukses", "📚 Buku berhasil dikembalikan!");
      fetchBooks();
      fetchMyBorrows();
    } catch (err) {
      console.error("Return book error:", err);
      showMessageBox("Error", `Gagal mengembalikan buku: ${err.message}`);
    }
  };

  const toggleFavorite = async (bookId) => {
    // Ensure the user is logged in before proceeding.
    if (!userData?.id) {
      showMessageBox("Peringatan", "Mohon login untuk menambahkan favorit.");
      return;
    }

    const isCurrentlyFavorite = favoritesStatus[bookId];
    try {
      // If the book is already a favorite, we need to remove it.
      if (isCurrentlyFavorite) {
        // First, get the list of the user's favorites to find the specific favorite entry ID.
        const favRes = await fetch(
          `https://rem-library.up.railway.app/favorites/user/${userData.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!favRes.ok)
          throw new Error("Gagal mengambil daftar favorit untuk penghapusan.");

        const favData = await favRes.json();
        const favoriteRecord = favData.find((fav) => fav.bookId === bookId);

        // If the favorite record is found, send a DELETE request.
        if (favoriteRecord) {
          const res = await fetch(
            `https://rem-library.up.railway.app/favorites/${favoriteRecord.id}`,
            {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (!res.ok) throw new Error("Gagal menghapus dari favorit.");

          showMessageBox("Sukses", "Buku dihapus dari favorit!");
          // Update the local state to reflect the change.
          setFavoritesStatus((prev) => ({ ...prev, [bookId]: false }));
        }
      } else {
        // If the book is not a favorite, add it by sending a POST request.
        const res = await fetch(
          `https://rem-library.up.railway.app/favorites`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            // The request body now includes both userId and bookId.
            body: JSON.stringify({ userId: userData.id, bookId }),
          }
        );

        if (!res.ok) throw new Error("Gagal menambahkan ke favorit.");

        showMessageBox("Sukses", "Buku ditambahkan ke favorit!");
        // Update the local state to reflect the change.
        setFavoritesStatus((prev) => ({ ...prev, [bookId]: true }));
      }
    } catch (err) {
      console.error("Toggle favorite error:", err);
      showMessageBox("Error", `Gagal mengubah status favorit: ${err.message}`);
    }
  };

  const handleRateBook = async (bookId, newRating) => {
    if (!userData?.id) {
      showMessageBox("Peringatan", "Mohon login untuk memberikan rating.");
      return;
    }
    if (!newRating) {
      showMessageBox("Peringatan", "Mohon berikan rating bintang.");
      return;
    }
    const parsedRating = parseInt(newRating);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      showMessageBox("Peringatan", "Rating harus antara 1 sampai 5.");
      return;
    }

    try {
      const res = await fetch(`https://rem-library.up.railway.app/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userData.id,
          bookId: bookId,
          rating: parsedRating,
          comment: "",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal mengirim rating");
      }

      showMessageBox("Sukses", "Rating berhasil ditambahkan!");
      setRatings((prevRatings) => ({
        ...prevRatings,
        [bookId]: [...(prevRatings[bookId] || []), parsedRating],
      }));
    } catch (err) {
      console.error("Rate book error:", err);
      showMessageBox("Error", `Gagal menambahkan rating: ${err.message}`);
    }
  };

  const getBookRatingInfo = (bookId) => {
    const bookRatings = ratings[bookId] || [];
    if (bookRatings.length === 0) {
      return { averageRating: 0, ratingCount: 0 };
    }
    const totalRating = bookRatings.reduce((sum, rating) => sum + rating, 0);
    const averageRating = (totalRating / bookRatings.length).toFixed(1);
    return {
      averageRating: parseFloat(averageRating),
      ratingCount: bookRatings.length,
    };
  };

  const renderStars = (rating, maxStars = 5) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = maxStars - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            size={16}
            fill="currentColor"
            className="text-yellow-400"
          />
        ))}
        {halfStar && (
          <Star key="half" size={16} fill="none" className="text-yellow-400" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            size={16}
            fill="none"
            className="text-gray-300"
          />
        ))}
      </div>
    );
  };

  const getCategoryStyle = (kategori) => {
    if (typeof kategori !== "string") {
      return "bg-gray-100 text-gray-700 border-gray-200";
    }
    switch (kategori.trim()) {
      case "Fiction":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Non-Fiction":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Science":
        return "bg-green-100 text-green-700 border-green-200";
      case "History":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Biography":
        return "bg-pink-100 text-pink-700 border-pink-200";
      case "Philosophy":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "Fantasy":
        return "bg-purple-200 text-purple-800 border-purple-300";
      case "Mystery":
        return "bg-gray-200 text-gray-800 border-gray-300";
      case "Romance":
        return "bg-red-100 text-red-700 border-red-200";
      case "Thriller":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Self-Help":
        return "bg-teal-100 text-teal-700 border-teal-200";
      case "Poetry":
        return "bg-lime-100 text-lime-700 border-lime-200";
      case "Drama":
        return "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200";
      case "Travel":
        return "bg-cyan-100 text-cyan-700 border-cyan-200";
      case "Religion":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Children":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Young Adult":
        return "bg-violet-100 text-violet-700 border-violet-200";
      case "Science Fiction":
        return "bg-blue-200 text-blue-800 border-blue-300";
      case "Art":
        return "bg-rose-100 text-rose-700 border-rose-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getCategoryIcon = (kategori) => {
    if (typeof kategori !== "string") {
      return "📚";
    }
    switch (kategori?.trim()) {
      case "Fiction":
        return "✨";
      case "Non-Fiction":
        return "🎓";
      case "Science":
        return "🔬";
      case "History":
        return "📜";
      case "Biography":
        return "👤";
      case "Philosophy":
        return "🤔";
      case "Fantasy":
        return "🐉";
      case "Mystery":
        return "🔎";
      case "Romance":
        return "❤️";
      case "Thriller":
        return "🔪";
      case "Self-Help":
        return "💡";
      case "Poetry":
        return "📝";
      case "Drama":
        return "🎭";
      case "Travel":
        return "✈️";
      case "Religion":
        return "🙏";
      case "Children":
        return "👶";
      case "Young Adult":
        return "🧑‍🤝‍🧑";
      case "Science Fiction":
        return "🚀";
      case "Art":
        return "🎨";
      default:
        return "📚";
    }
  };

  if (loadingBooks || loadingCategories || !userData || loadingFavorites) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fefae0]">
        <div className="text-center text-[#2D1E17]">
          <Loader2 size={40} className="animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold">Memuat data buku...</p>
        </div>
      </div>
    );
  }

  if (booksError || categoriesError || favoritesError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fefae0] text-red-600">
        <div className="text-center">
          <p className="text-lg font-semibold">
            Error: {booksError || categoriesError || favoritesError}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#4a2515] text-white rounded-md hover:bg-[#3e1f0d]"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const staticCategories = [
    "Fiction",
    "Non-Fiction",
    "Science",
    "History",
    "Biography",
    "Philosophy",
    "Fantasy",
    "Mystery",
    "Romance",
    "Thriller",
    "Self-Help",
    "Poetry",
    "Drama",
    "Travel",
    "Religion",
    "Children",
    "Young Adult",
    "Science Fiction",
    "Art",
  ];

  const uniqueCategoryNames = new Set(
    categories.map((cat) => cat.name.toLowerCase())
  );
  const combinedCategories = [
    ...categories.map((cat) => ({ id: cat.id, name: cat.name })),
    ...staticCategories
      .filter((catName) => !uniqueCategoryNames.has(catName.toLowerCase()))
      .map((catName, idx) => ({ id: `static-${idx}`, name: catName })),
  ];

  combinedCategories.sort((a, b) => a.name.localeCompare(b.name));

  const kategoriList = ["all", ...combinedCategories.map((cat) => cat.name)];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-screen w-full bg-gradient-to-br from-[#fefae0] via-[#fcf7e8] to-[#faf4e0] text-[#2e2e2e] font-serif"
    >
      <ModalKonfirmasi
        show={modal.show}
        onClose={() => setModal({ show: false, pesan: "", aksi: null })}
        onConfirm={modal.aksi}
        pesan={modal.pesan}
      />

      <main className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div>
              <h2 className="text-4xl text-[#2D1E17] font-bold drop-shadow-sm">
                📘 Daftar Buku Perpustakaan
              </h2>
              <p className="text-gray-700 text-lg mt-2">
                Koleksi buku terbaik yang tersedia dalam sistem perpustakaan.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col lg:flex-row lg:items-center gap-6 mb-8 p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50"
        >
          <div className="relative flex-1">
            <div className="relative flex items-center">
              <div className="absolute left-4">
                <div className="bg-[#d4a373] p-2 rounded-full">
                  <Search size={18} className="text-white" />
                </div>
              </div>
              <input
                type="text"
                placeholder="Cari buku berdasarkan judul atau penulis..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-[#2D1E17]/20 bg-white text-[#3b0a0a] focus:outline-none focus:ring-4 focus:ring-[#3b0a0a]/20 focus:border-[#3b0a0a] transition-all duration-300 shadow-sm hover:shadow-md text-lg"
              />
            </div>
          </div>

          <div className="relative">
            <select
              className="w-full lg:w-auto rounded-2xl border-2 border-[#2D1E17]/20 px-6 py-4 bg-white text-[#3b0a0a] focus:outline-none focus:ring-4 focus:ring-[#3b0a0a]/20 focus:border-[#3b0a0a] transition-all duration-300 shadow-sm hover:shadow-md text-lg font-medium cursor-pointer"
              value={kategoriFilter}
              onChange={(e) => {
                setKategoriFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              {kategoriList.map((catName) => (
                <option key={catName} value={catName}>
                  {catName === "all"
                    ? "📚 Semua Kategori"
                    : `${getCategoryIcon(catName)} ${catName}`}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-between mb-6"
          >
            <h3 className="text-2xl font-bold text-[#2D1E17] flex items-center gap-3">
              <BookOpen size={28} className="text-[#d4a373]" />
              Semua Buku
            </h3>
            <div className="text-sm text-gray-600 bg-white/70 px-4 py-2 rounded-full border border-gray-200">
              {books.length} buku ditemukan
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {books.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-16"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen size={48} className="text-gray-400" />
                </div>
                <p className="text-gray-500 text-xl font-medium">
                  Tidak ada buku ditemukan.
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Coba ubah kata kunci pencarian atau filter kategori.
                </p>
              </motion.div>
            ) : (
              books.map((book, index) => (
                <motion.div
                  key={book.id}
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.9 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 100,
                  }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col border border-gray-100 group overflow-hidden relative"
                >
                  <motion.div
                    whileTap={{ scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                    className="absolute top-4 left-4 z-10 cursor-pointer"
                    onClick={() => toggleFavorite(book.id)}
                  >
                    <Heart
                      size={24}
                      className={
                        favoritesStatus[book.id]
                          ? "text-red-500 fill-current drop-shadow-md"
                          : "text-gray-400 drop-shadow-md"
                      }
                    />
                  </motion.div>

                  <div className="absolute top-4 right-4 z-10">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        book.availableCopies > 0
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-red-100 text-red-700 border border-red-200"
                      }`}
                    >
                      {book.availableCopies > 0
                        ? `${book.availableCopies} tersedia`
                        : "Habis"}
                    </div>
                  </div>

                  <div className="flex-1 w-full flex flex-col justify-center items-center text-center py-4 px-2">
                    <h4 className="text-xl font-semibold text-[#2D1E17] mb-2 line-clamp-3">
                      {book.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-1 line-clamp-2">
                      Penulis:{" "}
                      <span className="font-medium">{book.author}</span>
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      Tahun: {book.publicationYear}
                    </p>
                  </div>

                  {book.categories && book.categories.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-1 mb-2">
                      {book.categories.map((cat, idx) => {
                        console.log("CAT:", cat);
                        console.log(
                          "cat.name (type):",
                          cat.name,
                          typeof cat.name
                        );

                        return (
                          <span
                            key={cat.id || idx}
                            className={`text-xs font-medium px-3 py-1 rounded-full inline-block border ${getCategoryStyle(
                              cat.name
                            )}`}
                          >
                            {getCategoryIcon(cat.name)} {cat.name}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-4 text-gray-700">
                    {renderStars(getBookRatingInfo(book.id).averageRating)}
                    <span className="text-sm font-medium">
                      {getBookRatingInfo(book.id).averageRating === 0
                        ? "Belum ada rating"
                        : `${getBookRatingInfo(book.id).averageRating} (${
                            getBookRatingInfo(book.id).ratingCount
                          } rating)`}
                    </span>
                  </div>

                  <div className="mt-6">
                    {myBorrows.some(
                      (borrow) =>
                        borrow.bookId === book.id && !borrow.returnDate
                    ) ? (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.03 }}
                        onClick={() => konfirmasiKembalikan(book.id)}
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        Kembalikan Buku
                      </motion.button>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.03 }}
                        onClick={() => konfirmasiPinjam(book.id)}
                        disabled={book.availableCopies === 0}
                        className={`w-full ${
                          book.availableCopies > 0
                            ? "bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800"
                            : "bg-gray-400 cursor-not-allowed"
                        } text-white px-4 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300`}
                      >
                        {book.availableCopies > 0
                          ? "Pinjam Buku"
                          : "Tidak Tersedia"}
                      </motion.button>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h5 className="font-semibold text-gray-800 mb-2">
                      Berikan Rating
                    </h5>
                    <div className="flex items-center justify-between gap-2">
                      <select
                        id={`rating-input-${book.id}`}
                        name="rating"
                        defaultValue=""
                        className="flex-1 p-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm"
                      >
                        <option value="" disabled>
                          Pilih rating
                        </option>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <option key={star} value={star}>
                            {star} Bintang
                          </option>
                        ))}
                      </select>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        whileHover={{ scale: 1.03 }}
                        onClick={() => {
                          const selectElement = document.getElementById(
                            `rating-input-${book.id}`
                          );
                          handleRateBook(book.id, selectElement.value);
                          selectElement.value = "";
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md font-semibold text-sm transition-colors duration-300"
                      >
                        Kirim
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-[#4a2515] text-[#fefae0] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3e1f0d] transition-all"
              >
                Sebelumnya
              </button>
              <span className="text-lg font-semibold text-[#2D1E17]">
                Halaman {currentPage} dari {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-[#4a2515] text-[#fefae0] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3e1f0d] transition-all"
              >
                Berikutnya
              </button>
            </div>
          )}
        </section>
      </main>
    </motion.div>
  );
}

export default DataBuku;
