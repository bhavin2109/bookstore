import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getWishlist, toggleWishlist } from "../services/authServices";
import BookCard from "../components/BookCard";
import { toast } from "react-toastify";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const data = await getWishlist();
      setWishlist(data);
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (bookId) => {
    try {
      await toggleWishlist(bookId);
      setWishlist((prev) => prev.filter((book) => book._id !== bookId));
      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error("Failed to remove from wishlist");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900">
        <p className="text-lg font-bold text-emerald-400">
          Loading wishlist...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-3">
            Your Wishlist
          </h1>
          <p className="text-slate-400 text-lg">Books you've saved for later</p>
        </motion.div>

        {wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-slate-950/50 rounded-2xl border border-white/5"
          >
            <span className="text-6xl mb-4 block">💔</span>
            <p className="text-xl font-medium text-slate-400 mb-6">
              Your wishlist is empty.
            </p>
            <Link
              to="/books"
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold transition-colors shadow-lg shadow-emerald-500/20"
            >
              Browse Books
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
          >
            {wishlist.map((book, index) => (
              <BookCard
                key={book._id}
                book={book}
                index={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                isWishlistPage={true}
                onRemove={() => removeFromWishlist(book._id)}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
