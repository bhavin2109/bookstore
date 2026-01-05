import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProducts } from "../services/sellerServices";
import { deleteBook } from "../services/bookServices";
import { toast } from "react-toastify";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const SellerProducts = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await getMyProducts();
      // sellerServices returns array directly or valid response
      if (Array.isArray(res)) {
        setBooks(res);
      } else if (res && Array.isArray(res.books)) {
        setBooks(res.books);
      } else {
        setBooks([]);
      }
    } catch (err) {
      toast.error(err?.message || err || "Failed to fetch products.");
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
        if (!localStorage.getItem("token")) {
          toast.error("You need to be logged in to delete.");
          return;
        }
        await deleteBook(id);
        toast.success("Book deleted successfully");
        fetchBooks();
      } catch (err) {
        toast.error(err.message || "Failed to delete book");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-slate-900">
        <p className="text-lg font-bold text-emerald-400">
          Loading your products...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">My Products</h2>
        <button
          onClick={() => navigate("/seller/add-product")}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-lg shadow-emerald-500/20"
        >
          + Add New Product
        </button>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-white/5">
          <p className="text-slate-400 mb-4">
            You haven't added any products yet.
          </p>
          <button
            onClick={() => navigate("/seller/add-product")}
            className="text-emerald-400 hover:text-emerald-300 font-medium"
          >
            Create your first product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-slate-900 rounded-xl border border-white/5 overflow-hidden shadow-lg hover:shadow-xl transition-all hover:border-emerald-500/30 group"
            >
              <div className="aspect-2/3 relative overflow-hidden">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-linear-to-t from-black/80 to-transparent">
                  <p className="text-white font-bold text-lg truncate">
                    {book.title}
                  </p>
                  <p className="text-emerald-400 font-bold">${book.price}</p>
                </div>
              </div>
              <div className="p-4 flex gap-2">
                <button
                  onClick={() => navigate(`/seller/edit-product/${book._id}`)}
                  className="flex-1 py-2 rounded-lg bg-blue-500/10 text-blue-400 text-sm font-medium hover:bg-blue-500/20 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(book._id)}
                  className="flex-1 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default SellerProducts;
