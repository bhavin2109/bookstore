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
    <div className="w-full h-[calc(100vh-4rem)] overflow-auto bg-slate-950 px-4 sm:px-6 lg:px-8 py-8 relative animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Review Management
        </h1>
        <p className="text-slate-400 mt-1">
          Manage user reviews for all products.
        </p>
      </div>

      {loading ? (
        <div className="mt-8 flex justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500/30 border-t-emerald-500"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="mt-8 rounded-xl border border-white/10 bg-slate-900/50 p-12 text-center backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-white">No reviews found</h2>
        </div>
      ) : (
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-sm shadow-xl">
                <table className="min-w-full divide-y divide-white/10">
                  <thead className="bg-white/5">
                    <tr>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-white sticky top-0 z-20 bg-slate-900 border-b border-white/10 shadow-sm"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-white sticky top-0 z-20 bg-slate-900 border-b border-white/10 shadow-sm"
                      >
                        User
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-white sticky top-0 z-20 bg-slate-900 border-b border-white/10 shadow-sm"
                      >
                        Product
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-white sticky top-0 z-20 bg-slate-900 border-b border-white/10 shadow-sm"
                      >
                        Rating
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-white sticky top-0 z-20 bg-slate-900 border-b border-white/10 shadow-sm"
                      >
                        Comment
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-3 pr-4 sm:pr-6 sticky top-0 z-20 bg-slate-900 border-b border-white/10 shadow-sm text-right"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {reviews.map((review) => (
                      <tr
                        key={review._id}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-white font-medium">
                          {review.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-emerald-400">
                          {review.bookTitle}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <div className="flex text-emerald-400">
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
                        </td>
                        <td
                          className="px-3 py-4 text-sm text-slate-300 max-w-xs truncate"
                          title={review.comment}
                        >
                          {review.comment}
                        </td>
                        <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() =>
                              handleDelete(review.bookId, review._id)
                            }
                            className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                            title="Delete Review"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
