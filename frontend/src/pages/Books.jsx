import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBooks } from "../services/bookServices.js";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import BookCard from "../components/BookCard";

const GENRES = [
  "Fiction",
  "Non-Fiction",
  "Sci-Fi",
  "Mystery",
  "Romance",
  "Fantasy",
  "Biography",
  "History",
  "Self-Help",
];

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false); // Mobile toggle

  // Filters State
  const [filters, setFilters] = useState({
    genre: "",
    priceMin: "",
    priceMax: "",
    rating: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        ...filters,
      };
      // Clean up empty params
      Object.keys(params).forEach(
        (key) =>
          (params[key] === "" || params[key] === null) && delete params[key]
      );

      const res = await getAllBooks(params);

      if (res && Array.isArray(res.books)) {
        setBooks(res.books);
        setTotalPages(res.totalPages || 1);
      } else {
        setBooks([]);
      }
    } catch (err) {
      setError(
        err?.message || err || "Failed to fetch books. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1); // Reset to page 1 on filter change
  };

  const clearFilters = () => {
    setFilters({
      genre: "",
      priceMin: "",
      priceMax: "",
      rating: "",
    });
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-900 pt-16">
      <div className="flex items-start">
        {/* Sidebar Filters - Desktop */}
        <aside
          className={`hidden lg:block w-64 bg-slate-950 border-r border-white/10 fixed top-16 left-0 bottom-0 overflow-y-auto shrink-0 z-40 transition-all duration-300 custom-scrollbar`}
        >
          <div className="p-6 pb-24">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>🔍</span> Filters
              </h3>
              <button
                onClick={clearFilters}
                className="text-xs text-emerald-400 hover:text-emerald-300 underline"
              >
                Reset
              </button>
            </div>

            {/* Genre Filter */}
            <div className="mb-8">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                Genre
              </h4>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="genre"
                    value=""
                    checked={filters.genre === ""}
                    onChange={handleFilterChange}
                    className="w-4 h-4 text-emerald-500 bg-slate-900 border-slate-600 focus:ring-emerald-500 focus:ring-2"
                  />
                  <span
                    className={`text-sm transition-colors ${
                      filters.genre === ""
                        ? "text-white font-medium"
                        : "text-slate-400 group-hover:text-slate-300"
                    }`}
                  >
                    All Genres
                  </span>
                </label>
                {GENRES.map((g) => (
                  <label
                    key={g}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="genre"
                      value={g}
                      checked={filters.genre === g}
                      onChange={handleFilterChange}
                      className="w-4 h-4 text-emerald-500 bg-slate-900 border-slate-600 focus:ring-emerald-500 focus:ring-2"
                    />
                    <span
                      className={`text-sm transition-colors ${
                        filters.genre === g
                          ? "text-white font-medium"
                          : "text-slate-400 group-hover:text-slate-300"
                      }`}
                    >
                      {g}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-8">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                Price Range
              </h4>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="priceMin"
                  value={filters.priceMin}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-emerald-500 outline-none transition-colors"
                />
                <input
                  type="number"
                  name="priceMax"
                  value={filters.priceMax}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-emerald-500 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                Min Rating
              </h4>
              <div className="space-y-2">
                {[4, 3, 2, 1].map((r) => (
                  <label
                    key={r}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="rating"
                      value={r}
                      checked={Number(filters.rating) === r}
                      onChange={handleFilterChange}
                      className="w-4 h-4 text-emerald-500 bg-slate-900 border-slate-600 focus:ring-emerald-500 focus:ring-2"
                    />
                    <span
                      className={`text-sm transition-colors flex items-center gap-1 ${
                        Number(filters.rating) === r
                          ? "text-white font-medium"
                          : "text-slate-400 group-hover:text-slate-300"
                      }`}
                    >
                      {r}+ <span className="text-yellow-500">★</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0 lg:ml-64">
          {/* Mobile Filter Sheet Overlay */}
          <AnimatePresence>
            {showFilters && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowFilters(false)}
                  className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
                />
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  className="fixed inset-y-0 left-0 w-64 bg-slate-950 border-r border-white/10 z-50 lg:hidden overflow-y-auto"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-white uppercase">
                        Filters
                      </h3>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="text-slate-400"
                      >
                        ✕
                      </button>
                    </div>
                    {/* Reuse Filter Content Logic (duplicated for simplicity in this replacement block, normally would perform extraction) */}
                    {/* Genre Filter */}
                    <div className="mb-8">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                        Genre
                      </h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="genre"
                            value=""
                            checked={filters.genre === ""}
                            onChange={handleFilterChange}
                            className="w-4 h-4 text-emerald-500 bg-slate-900 border-slate-600 focus:ring-emerald-500 focus:ring-2"
                          />
                          <span className="text-sm text-slate-300">
                            All Genres
                          </span>
                        </label>
                        {GENRES.map((g) => (
                          <label
                            key={g}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <input
                              type="radio"
                              name="genre"
                              value={g}
                              checked={filters.genre === g}
                              onChange={handleFilterChange}
                              className="w-4 h-4 text-emerald-500 bg-slate-900 border-slate-600 focus:ring-emerald-500 focus:ring-2"
                            />
                            <span className="text-sm text-slate-300">{g}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="mb-8">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                        Price Range
                      </h4>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          name="priceMin"
                          value={filters.priceMin}
                          onChange={handleFilterChange}
                          placeholder="Min"
                          className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-white text-sm"
                        />
                        <input
                          type="number"
                          name="priceMax"
                          value={filters.priceMax}
                          onChange={handleFilterChange}
                          placeholder="Max"
                          className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-white text-sm"
                        />
                      </div>
                    </div>

                    {/* Rating Filter */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                        Min Rating
                      </h4>
                      <div className="space-y-2">
                        {[4, 3, 2, 1].map((r) => (
                          <label
                            key={r}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <input
                              type="radio"
                              name="rating"
                              value={r}
                              checked={Number(filters.rating) === r}
                              onChange={handleFilterChange}
                              className="w-4 h-4 text-emerald-500 bg-slate-900 border-slate-600 focus:ring-emerald-500 focus:ring-2"
                            />
                            <span className="text-sm text-slate-300 flex items-center gap-1">
                              {r}+ <span className="text-yellow-500">★</span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <div className="p-6 lg:p-10 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4"
            >
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-2">
                  Our Collection
                </h1>
                <p className="text-slate-400">Discover your next great read</p>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden w-full md:w-auto px-6 py-3 bg-slate-800 text-white rounded-xl font-bold border border-white/10 flex items-center justify-center gap-2"
              >
                <span>🔍</span> Filters{" "}
                {Object.values(filters).some(Boolean) && (
                  <span className="bg-emerald-500 w-2 h-2 rounded-full"></span>
                )}
              </button>
            </motion.div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-2/3 bg-slate-800/50 rounded-xl animate-pulse"
                  ></div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-20 bg-slate-950/50 rounded-xl border border-red-500/20">
                <p className="text-red-400 font-bold">{error}</p>
              </div>
            ) : books.length === 0 ? (
              <div className="text-center py-20 bg-slate-950/50 rounded-xl border border-white/5">
                <p className="text-xl font-medium text-slate-500">
                  No books found matching your filters.
                </p>
                <div className="mt-4">
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            ) : (
              <>
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.08 } },
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {books.map((book, index) => (
                    <BookCard
                      key={book._id}
                      book={book}
                      index={index}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        show: { opacity: 1, y: 0 },
                      }}
                      onClick={() => navigate(`/books/${book._id}`)}
                    />
                  ))}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-16 flex justify-center gap-2">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className="px-4 py-2 rounded-lg bg-slate-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition"
                    >
                      Prev
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 rounded-lg font-bold transition ${
                          page === i + 1
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                      className="px-4 py-2 rounded-lg bg-slate-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Books;
