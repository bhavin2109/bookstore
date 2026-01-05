import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import BookCard from "../components/BookCard";
import { getAllBooks } from "../services/bookServices";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndFilterBooks = async () => {
      setLoading(true);
      try {
        const data = await getAllBooks();
        let allBooks = [];
        if (data && data.books) {
          allBooks = data.books;
        } else if (Array.isArray(data)) {
          allBooks = data;
        }

        const filtered = allBooks.filter((book) => {
          const lowerQuery = query.toLowerCase();
          return (
            book.title.toLowerCase().includes(lowerQuery) ||
            book.genre.toLowerCase().includes(lowerQuery) ||
            (book.author && book.author.toLowerCase().includes(lowerQuery))
          );
        });

        setBooks(filtered);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchAndFilterBooks();
    } else {
      setBooks([]);
      setLoading(false);
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Search Results</h1>
          <p className="text-slate-400">
            {loading
              ? "Searching..."
              : `Found ${books.length} result${
                  books.length === 1 ? "" : "s"
                } for "${query}"`}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-white/5">
            <p className="text-xl text-slate-500 mb-4">No matches found</p>
            <button
              onClick={() => navigate("/books")}
              className="text-emerald-400 hover:text-emerald-300 font-medium"
            >
              Browse all books
            </button>
          </div>
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
        )}
      </div>
    </div>
  );
};

export default SearchResults;
