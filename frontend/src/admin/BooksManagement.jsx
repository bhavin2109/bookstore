import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBooks, deleteBook } from "../services/bookServices";
import { toast } from "react-toastify";

const BooksManagement = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await getAllBooks();
      if (res && Array.isArray(res.books)) {
        setBooks(res.books);
      } else {
        setBooks([]);
      }
    } catch (err) {
      toast.error(err?.message || err || "Failed to fetch books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("You need to be logged in to delete.");
          return;
        }
        await deleteBook(id, token);
        toast.success("Book deleted successfully");
        // Refresh list
        fetchBooks();
      } catch (err) {
        toast.error(err.message || "Failed to delete book");
      }
    }
  };

  // ⏳ loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-slate-900">
        <p className="text-lg font-bold text-emerald-400">Loading books...</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto h-[calc(100vh-4rem)] relative">
      {/* Desktop Table View */}
      <div className="hidden md:block min-w-[800px]">
        <table className="w-full text-left border-collapse relative">
          <thead className="bg-slate-800 text-white uppercase text-xs font-bold whitespace-nowrap">
            <tr>
              <th className="py-4 px-4 sticky top-0 z-20 bg-slate-800 border-b border-slate-700 shadow-sm">
                Cover
              </th>
              <th className="py-4 px-4 sticky top-0 z-20 bg-slate-800 border-b border-slate-700 shadow-sm">
                Title
              </th>
              <th className="py-4 px-4 sticky top-0 z-20 bg-slate-800 border-b border-slate-700 shadow-sm">
                Author
              </th>
              <th className="py-4 px-4 sticky top-0 z-20 bg-slate-800 border-b border-slate-700 shadow-sm">
                Price
              </th>
              <th className="py-4 px-4 text-right sticky top-0 z-20 bg-slate-800 border-b border-slate-700 shadow-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-slate-800/50">
            {books.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-4 text-center text-slate-500">
                  No books found.
                </td>
              </tr>
            ) : (
              books.map((book) => (
                <tr
                  key={book._id}
                  className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="h-24 w-16 object-cover rounded shadow-sm bg-slate-700"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </td>
                  <td className="py-3 px-4 font-medium text-white">
                    {book.title}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {book.author ? (
                      book.author
                    ) : (
                      <span className="text-red-500 font-bold">MISSING</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">
                    ${book.price}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() =>
                          navigate(`/admin/books/edit/${book._id}`)
                        }
                        className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4 p-4 pb-20">
        {books.length === 0 ? (
          <div className="text-center text-slate-500 py-10">
            No books found.
          </div>
        ) : (
          books.map((book) => (
            <div
              key={book._id}
              className="bg-slate-900 rounded-xl p-4 border border-white/5 shadow-md flex gap-4"
            >
              {/* Image */}
              <div className="shrink-0">
                <img
                  src={book.image}
                  alt={book.title}
                  className="h-32 w-24 object-cover rounded-md shadow-sm bg-slate-700"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight mb-1 truncate">
                    {book.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-2 truncate">
                    by{" "}
                    {book.author || (
                      <span className="text-red-500">Unknown</span>
                    )}
                  </p>
                  <p className="text-emerald-400 font-bold text-lg">
                    ${book.price}
                  </p>
                </div>

                <div className="flex gap-3 mt-3 pt-3 border-t border-white/5">
                  <button
                    onClick={() => navigate(`/admin/books/edit/${book._id}`)}
                    className="flex-1 py-1.5 rounded bg-blue-500/10 text-blue-400 text-sm font-medium hover:bg-blue-500/20 transition-colors text-center"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="flex-1 py-1.5 rounded bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors text-center"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BooksManagement;
