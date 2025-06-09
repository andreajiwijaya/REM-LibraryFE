import React, { useEffect, useState } from 'react';
import { Loader2, BookOpen, CheckCircle, XCircle } from 'lucide-react';

const API_BASE = 'https://rem-library.up.railway.app/borrows';

export default function BorrowedBooks() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [returningId, setReturningId] = useState(null);

  // Ambil token dari localStorage (atau sesuaikan dari context/auth state)
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setError('User not authenticated');
      return;
    }

    const fetchBorrows = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/my`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        const data = await res.json();
        setBorrows(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBorrows();
  }, [token]);

  const handleReturn = async (borrowId) => {
    if (!token) {
      alert('User not authenticated');
      return;
    }

    if (!window.confirm('Are you sure you want to return this book?')) {
      return;
    }

    setReturningId(borrowId);
    try {
      const res = await fetch(`${API_BASE}/${borrowId}/return`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to return book');
      }
      // Update local state agar buku yang sudah return bisa langsung terlihat
      setBorrows((prev) =>
        prev.map((b) =>
          b.id === borrowId ? { ...b, returnDate: new Date().toISOString() } : b
        )
      );
      alert('Book returned successfully');
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setReturningId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <BookOpen size={28} /> My Borrowed Books
      </h1>

      {loading && (
        <div className="flex justify-center items-center">
          <Loader2 className="animate-spin" size={32} />
        </div>
      )}

      {error && (
        <div className="text-red-600 font-medium mb-4">
          {error}
        </div>
      )}

      {!loading && !error && borrows.length === 0 && (
        <p className="text-gray-600">You have no borrowed books currently.</p>
      )}

      <ul className="space-y-4">
        {borrows.map(({ id, book, borrowDate, returnDate, userId }) => {
          const isReturned = Boolean(returnDate);
          return (
            <li
              key={id}
              className="border rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">{book.title}</h2>
                <p className="text-sm text-gray-600">By {book.author}</p>
                <p className="text-sm text-gray-600">
                  Borrowed: {new Date(borrowDate).toLocaleDateString()}
                </p>
                {isReturned && (
                  <p className="text-sm text-green-700 font-semibold">
                    Returned: {new Date(returnDate).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="mt-3 sm:mt-0">
                {isReturned ? (
                  <div className="flex items-center gap-1 text-green-600 font-semibold">
                    <CheckCircle size={20} />
                    Returned
                  </div>
                ) : (
                  <button
                    disabled={returningId === id}
                    onClick={() => handleReturn(id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {returningId === id ? (
                      <Loader2 className="animate-spin mx-auto" size={20} />
                    ) : (
                      'Return Book'
                    )}
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
