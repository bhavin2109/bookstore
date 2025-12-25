import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const ProductCard = ({ book, index = 0, variants, onClick }) => {
  // Use book or props to safely access data
  const { title, image, price, category, author, description } = book;

  return (
    <motion.article
      variants={variants}
      className={`group relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-100 shadow-md hover:shadow-xl transition-all duration-300 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Background Image - Full Cover */}
      <img
        src={image || "https://via.placeholder.com/400?text=No+Image"}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />

      {/* Category Badge - Always Visible (Optional, currently top left) */}
      {category && (
        <div className="absolute left-3 top-3 z-10 rounded bg-black/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
          {category}
        </div>
      )}

      {/* Hover Overlay with Details */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/80 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="transform translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
          <h3 className="mb-1 line-clamp-2 text-lg font-bold text-white">
            {title}
          </h3>
          
          {author && (
            <p className="mb-2 text-sm font-medium text-gray-300">
              by {author}
            </p>
          )}

          {description && (
            <p className="mb-4 line-clamp-3 text-xs text-gray-400">
              {description}
            </p>
          )}

          {/* Price and Action */}
          <div className="flex items-center justify-between border-t border-white/20 pt-3">
            <span className="text-xl font-bold text-white">
              ₹{typeof price === 'number' ? price.toFixed(2) : price}
            </span>
            
            <button
              className="rounded-full bg-white px-4 py-2 text-xs font-bold text-black transition-colors hover:bg-gray-200"
              onClick={(e) => {
                if (onClick) {
                    // Start propagation handled by parent onClick, or specifically here if needed
                }
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
