import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { getAllBooks } from "../services/bookServices";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getAllBooks();
        // Check if data is array or object with books key
        if (data && data.books && Array.isArray(data.books)) {
          setAllBooks(data.books);
        } else if (Array.isArray(data)) {
          setAllBooks(data);
        }
      } catch (error) {
        console.error("Error fetching books for search:", error);
      }
    };

    fetchBooks();

    // Close suggestions on click outside
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 0) {
      const filtered = allBooks.filter(
        (book) =>
          book.title.toLowerCase().includes(value.toLowerCase()) ||
          book.genre.toLowerCase().includes(value.toLowerCase()) ||
          (book.author &&
            book.author.toLowerCase().includes(value.toLowerCase()))
      );
      setSuggestions(filtered.slice(0, 5)); // Limit to 5 suggestions
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div
      className="relative w-full max-w-md mx-auto hidden md:block"
      ref={searchRef}
    >
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-emerald-500 group-focus-within:text-emerald-400 transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-emerald-500/30 rounded-full leading-5 bg-slate-900/50 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-slate-900 focus:text-white focus:border-emerald-500 focus:ring-0 focus:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-300 sm:text-sm"
          placeholder="Search items, by name, author, genre..."
          value={query}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.length > 0) setShowSuggestions(true);
          }}
        />
        {/* Neon Glow overlay on focus - driven by css focus-within on parent if needed, or simple input shadow above */}
      </div>

      <AnimatePresence>
        {showSuggestions && (
          <Motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-slate-900 border border-emerald-500/30 rounded-xl shadow-2xl shadow-emerald-500/10 overflow-hidden"
          >
            {suggestions.length > 0 ? (
              <ul className="max-h-96 overflow-y-auto py-2">
                {suggestions.map((book) => (
                  <li key={book._id}>
                    <Link
                      to={`/books/${book._id}`}
                      onClick={clearSearch}
                      className="flex items-center px-4 py-3 hover:bg-white/5 transition-colors group"
                    >
                      <div className="shrink-0 h-10 w-10 rounded-md overflow-hidden border border-white/10 group-hover:border-emerald-500/50 transition-colors">
                        <img
                          src={book.image}
                          alt={book.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">
                          {book.title}
                        </p>
                        <p className="text-xs text-slate-400">
                          {book.genre} • ₹{book.price}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-6 text-center text-sm text-slate-400">
                No results found for "{query}"
              </div>
            )}
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
