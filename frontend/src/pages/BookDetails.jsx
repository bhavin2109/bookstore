import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Helmet } from "react-helmet-async";

import { toast } from "react-toastify";

import { getBookById, createReview } from "../services/bookServices.js";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/cartSlice";

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Review State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [refreshReviews, setRefreshReviews] = useState(false);

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await getBookById(id);
        setBook(res.book || res);
      } catch (err) {
        setError(err?.message || "Failed to fetch book details");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, refreshReviews]);

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add to cart");
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

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to write a review");
      navigate("/login");
      return;
    }
    setSubmittingReview(true);
    try {
      await createReview(id, { rating, comment });
      toast.success("Review submitted successfully");
      setComment("");
      setRating(5);
      setRefreshReviews((prev) => !prev);
    } catch (err) {
      toast.error(err?.message || "Error submitting review");
    } finally {
      setSubmittingReview(false);
    }
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
      <Helmet>
        <title>{book.title} | Nerdy Enough</title>
        <meta
          name="description"
          content={
            book.description
              ? book.description.substring(0, 160)
              : `Buy ${book.title} by ${book.author} at Nerdy Enough.`
          }
        />
        <meta property="og:title" content={`${book.title} | Nerdy Enough`} />
        <meta
          property="og:description"
          content={
            book.description
              ? book.description.substring(0, 160)
              : `Buy ${book.title} by ${book.author} at Nerdy Enough.`
          }
        />
        <meta property="og:image" content={book.image} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: book.title,
            image: book.image,
            description: book.description,
            brand: {
              "@type": "Person",
              name: book.author,
            },
            offers: {
              "@type": "Offer",
              url: window.location.href,
              priceCurrency: "INR",
              price: book.price,
              availability: "https://schema.org/InStock",
            },
          })}
        </script>
      </Helmet>
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

            {/* Title & Rating */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-2">
                {book.title}
              </h1>
              <div className="flex items-center gap-2">
                <div className="flex text-emerald-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={20}
                      fill={s <= (book.rating || 0) ? "currentColor" : "none"}
                      strokeWidth={2}
                      className={
                        s <= (book.rating || 0)
                          ? "text-emerald-400"
                          : "text-slate-600"
                      }
                    />
                  ))}
                </div>
                <span className="text-slate-400 text-sm">
                  ({book.numReviews || 0} reviews)
                </span>
              </div>
            </motion.div>

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

        {/* Reviews Section */}
        <div className="mt-16 border-t border-white/10 pt-16">
          <h2 className="text-2xl font-bold text-white mb-8">Reviews</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Review List */}
            <div className="space-y-6">
              {book.reviews && book.reviews.length > 0 ? (
                book.reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-slate-800/50 p-6 rounded-xl border border-white/5"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                          {review.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {review.name}
                          </p>
                          <div className="flex text-emerald-400 text-sm">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                fill={
                                  i < review.rating ? "currentColor" : "none"
                                }
                                className={
                                  i < review.rating
                                    ? "text-emerald-400"
                                    : "text-slate-600"
                                }
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-slate-500 text-xs">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-slate-400 bg-slate-800/30 p-8 rounded-xl border border-white/5 text-center">
                  No reviews yet. Be the first to review!
                </div>
              )}
            </div>

            {/* Write a Review */}
            <div className="bg-slate-800 p-8 rounded-2xl border border-white/10 h-fit">
              <h3 className="text-xl font-bold text-white mb-6">
                Write a Review
              </h3>
              {user ? (
                <form onSubmit={submitReviewHandler} className="space-y-6">
                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2">
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRating(s)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            size={32}
                            fill={s <= rating ? "#10b981" : "none"}
                            className={
                              s <= rating
                                ? "text-emerald-500"
                                : "text-slate-600"
                            }
                            strokeWidth={1.5}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2">
                      Comment
                    </label>
                    <textarea
                      rows="4"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-600"
                      placeholder="Share your thoughts about this book..."
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <p className="text-slate-400">
                    Please login to write a review.
                  </p>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-6 py-2 border border-emerald-500 text-emerald-400 rounded-lg hover:bg-emerald-500/10 transition-colors font-medium"
                  >
                    Login Here
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
