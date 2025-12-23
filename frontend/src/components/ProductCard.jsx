import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const ProductCard = ({ book, index = 0, variants }) => {
  return (
    <motion.article
      variants={variants}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-lg bg-white border-2 border-black shadow-lg transition-all duration-300 hover:shadow-2xl w-full max-w-full"
    >
      {/* Minimal Category Badge - Black and White */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 + 0.2 }}
        className="absolute left-4 top-4 z-10 rounded-md bg-black px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white border border-white"
      >
        {book.category}
      </motion.div>

      {/* Book Image - Black and White Theme */}
      <div className="relative aspect-[3/4] overflow-hidden bg-white border-b-2 border-black">
        <motion.img
          src={book.image}
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          whileHover={{ scale: 1.1 }}
        />
        {/* Black overlay on hover */}
        <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/10"></div>
      </div>

      {/* Book Info - Black and White */}
      <div className="flex flex-1 flex-col p-6 lg:p-7 bg-white">
        <h3 className="mb-2 line-clamp-2 text-xl lg:text-2xl font-bold leading-tight text-black group-hover:text-black transition-colors">
          {book.title}
        </h3>
        <p className="mb-4 text-base font-semibold text-black/70">
          {book.author}
        </p>
        <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-black/60">
          {book.description}
        </p>

        {/* Price and Action - Black and White */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t-2 border-black">
          <motion.p
            className="text-3xl lg:text-4xl font-black text-black"
            whileHover={{ scale: 1.05 }}
          >
            ${book.price.toFixed(2)}
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-md bg-black px-5 py-2.5 text-sm font-bold text-white border-2 border-black transition-all hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            Add to Cart
          </motion.button>
        </div>
      </div>

      {/* Subtle shine effect - Black and White */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full pointer-events-none"></div>
    </motion.article>
  );
};

export default ProductCard;
