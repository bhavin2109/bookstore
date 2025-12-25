import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const ProductCard = ({ book, variants, onClick }) => {
  // Use book or props to safely access data
  const { title, image, price, category, author, description } = book;

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

      {/* Category Badge - Always Visible (Optional, currently top left) */}
      {category && (
        <div className="absolute left-3 top-3 z-10 rounded-full bg-slate-900/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-white/10 backdrop-blur-sm shadow-xl">
          {category}
        </div>
      )}

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

export default ProductCard;
