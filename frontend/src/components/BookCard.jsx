import React, { useState } from "react";
import { motion } from "framer-motion";
import { toggleWishlist } from "../services/authServices";
import { toast } from "react-toastify";

const BookCard = ({ book, variants, onClick, isWishlistPage, onRemove }) => {
  // Use book or props to safely access data
  const { title, image, price, genre, author, description, _id } = book;
  const [liked, setLiked] = useState(isWishlistPage); // Assuming on wishlist page it's already liked

  const handleWishlist = async (e) => {
    e.stopPropagation();
    if (!localStorage.getItem("token")) {
      toast.error("Please login to use wishlist");
      return;
    }
    try {
      if (onRemove) {
        onRemove();
        return;
      }
      await toggleWishlist(_id);
      setLiked(!liked);
      toast.success(liked ? "Removed from wishlist" : "Added to wishlist");
    } catch (err) {
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <motion.article
      variants={variants}
      className={`group relative aspect-2/3 overflow-hidden rounded-xl bg-slate-950 shadow-lg border border-white/10 hover:shadow-2xl hover:border-emerald-500/30 transition-all duration-300 ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
    >
      {/* Background Image - Full Cover */}
      <img
        src={image || "https://via.placeholder.com/400?text=No+Image"}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
        loading="lazy"
      />

      {/* Genre Badge - Always Visible (Optional, currently top left) */}
      {genre && (
        <div className="absolute left-3 top-3 z-10 rounded-full bg-slate-900/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-white/10 backdrop-blur-sm shadow-xl">
          {genre}
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className="absolute right-3 top-3 z-20 rounded-full bg-slate-900/90 p-2 text-white border border-white/10 backdrop-blur-sm shadow-xl hover:bg-white/10 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={liked ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`w-5 h-5 ${liked ? "text-red-500" : "text-slate-300"}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
      </button>

      {/* Hover Overlay with Details */}
      <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-slate-950 via-slate-950/90 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="transform translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
          <h3 className="mb-1 line-clamp-2 text-lg font-bold text-white">
            {title}
          </h3>

          {author && (
            <p className="mb-2 text-sm font-medium text-slate-400">
              by {author}
            </p>
          )}

          {description && (
            <p className="mb-4 line-clamp-2 text-xs text-slate-400 leading-relaxed">
              {description}
            </p>
          )}

          {/* Price and Action */}
          <div className="flex items-center justify-between border-t border-white/10 pt-3">
            <span className="text-xl font-bold text-emerald-400">
              ₹{typeof price === "number" ? price.toFixed(2) : price}
            </span>

            <button
              className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600 active:scale-95"
              onClick={(ev) => {
                ev.stopPropagation();
                if (onClick) onClick();
              }}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default BookCard;
