import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllReviews, deleteReview } from "../services/bookServices";
import { Trash2, Star } from "lucide-react";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const data = await getAllReviews();
      setReviews(data);
    } catch (error) {
      toast.error(error.message || "Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (bookId, reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview(bookId, reviewId);
        toast.success("Review deleted successfully");
        setReviews(reviews.filter((r) => r._id !== reviewId));
      } catch (error) {
        toast.error(error.message || "Failed to delete review");
      }
    }
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] overflow-auto relative">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500/30 border-t-emerald-500"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="p-8 text-center text-slate-500">No reviews found.</div>
      ) : (
        <div className="min-w-[1000px]">
          <table className="w-full text-left border-collapse relative">
            <thead className="bg-slate-800 text-white uppercase text-xs font-bold whitespace-nowrap">
              <tr>
                <th className="py-4 px-4 sticky top-0 z-20 bg-slate-800 border-b border-slate-700 shadow-sm">
                  Date
                </th>
                <th className="py-4 px-4 sticky top-0 z-20 bg-slate-800 border-b border-slate-700 shadow-sm">
                  User
                </th>
                <th className="py-4 px-4 sticky top-0 z-20 bg-slate-800 border-b border-slate-700 shadow-sm">
                  Product
                </th>
                <th className="py-4 px-4 sticky top-0 z-20 bg-slate-800 border-b border-slate-700 shadow-sm">
                  Rating
                </th>
                <th className="py-4 px-4 sticky top-0 z-20 bg-slate-800 border-b border-slate-700 shadow-sm">
                  Comment
                </th>
                <th className="py-4 px-4 text-right sticky top-0 z-20 bg-slate-800 border-b border-slate-700 shadow-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-800/50">
              {reviews.map((review) => (
                <tr
                  key={review._id}
                  className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-slate-300">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-white font-medium">
                    {review.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-emerald-400 font-mono">
                    {review.bookTitle}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex text-emerald-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < review.rating ? "currentColor" : "none"}
                          className={
                            i < review.rating
                              ? "text-emerald-400"
                              : "text-slate-600"
                          }
                        />
                      ))}
                    </div>
                  </td>
                  <td
                    className="py-3 px-4 text-sm text-slate-300 max-w-xs truncate"
                    title={review.comment}
                  >
                    {review.comment}
                  </td>
                  <td className="py-3 px-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(review.bookId, review._id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-500/10 rounded-lg inline-flex items-center gap-1"
                      title="Delete Review"
                    >
                      <Trash2 size={16} />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
