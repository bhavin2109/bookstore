import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

import { toast } from "react-toastify";

import { getBookById } from "../services/bookServices.js";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/cartSlice";

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await getBookById(id);
        setBook(res.book || res); // Assuming API returns { book: ... } or just the book object
      } catch (err) {
        setError(err?.message || "Failed to fetch book details");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleAddToCart = () => {
    const user = localStorage.getItem("user");
    if (!user) {
      alert("Please login to add to cart");
      navigate("/login");
      return;
    }
    dispatch(
      addToCart({
        id: String(book.id || book._id),
        title: book.title,
        price: book.price,
        image: book.image,
        quantity: 1,
      })
    );
    toast.success("Book added to cart");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900">
        <p className="text-lg font-bold text-emerald-400">Loading book...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900">
        <p className="text-red-400 font-bold">{error}</p>
      </div>
    );
  }

  if (!book) return null;

  return (
    <div className="min-h-screen bg-slate-900 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-emerald-400 transition-colors uppercase tracking-wide group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">
            ←
          </span>
          Back to Collection
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start"
        >
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative aspect-3/4 rounded-2xl overflow-hidden bg-slate-950 border border-white/10 shadow-2xl group"
          >
            <div className="aspect-3/4 w-full bg-slate-800">
              <img
                src={
                  book.image || "https://via.placeholder.com/600?text=No+Image"
                }
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Details Section */}
          <div className="flex flex-col space-y-6">
            {/* Genre Badge */}
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="w-fit px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            >
              {book.genre || "Book"}
            </motion.span>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
            >
              {book.title}
            </motion.h1>

            {/* Author */}
            {book.author && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg font-medium text-slate-400"
              >
                by {book.author}
              </motion.p>
            )}

            {/* Price */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="py-6 border-y border-white/10"
            >
              <p className="text-4xl lg:text-5xl font-bold text-emerald-400">
                ₹{book.price}
              </p>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="space-y-3"
            >
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                About This Book
              </h2>
              <p className="text-slate-400 leading-relaxed text-base whitespace-pre-line">
                {book.description}
              </p>
            </motion.div>

            {/* Meta Information */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-2 gap-6 pt-4"
            >
              <div className="space-y-1">
                <p className="font-bold text-white uppercase tracking-wide text-xs">
                  Author
                </p>
                <p className="text-slate-400 font-medium text-base">
                  {book.author || "Unknown Author"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-white uppercase tracking-wide text-xs">
                  Published
                </p>
                <p className="text-slate-400 font-medium text-base">
                  {new Date(book.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </motion.div>

            {/* Add to Cart Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-8 py-4 rounded-lg bg-emerald-500 text-white font-bold text-lg shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all duration-200 uppercase tracking-wide"
              onClick={handleAddToCart}
            >
              Add to Cart
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default BookDetails;
