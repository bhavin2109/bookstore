import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStoreBySlug } from "../services/sellerServices";
import { toast } from "react-toastify";

const Shop = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ seller: null, books: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getStoreBySlug(slug);
        setData(res);
      } catch {
        toast.error("Store not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        Loading Store...
      </div>
    );
  }

  const { seller, books } = data;

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-24 pb-12">
      {/* Banner */}
      <div className="h-64 w-full bg-slate-800 relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-slate-900/90"></div>
        {/* Placeholder banner pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-emerald-500 via-slate-900 to-slate-900"></div>

        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto flex items-end gap-6">
          <div className="w-24 h-24 rounded-xl bg-slate-700 border-4 border-slate-900 shadow-xl flex items-center justify-center text-4xl">
            🏬
          </div>
          <div className="mb-2">
            <h1 className="text-4xl font-bold text-white mb-2">
              {seller.storeName}
            </h1>
            <p className="text-slate-300 max-w-2xl">
              {seller.description || "Welcome to my book store!"}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="text-emerald-400">📚</span> Available Books (
          {books.length})
        </h2>

        {books.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-xl border border-white/5">
            <p className="text-slate-500">
              This seller has no products listed yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {books.map((book) => (
              <div
                key={book._id}
                onClick={() => navigate(`/book/${book._id}`)}
                className="bg-slate-950 rounded-xl border border-white/5 overflow-hidden shadow-lg hover:shadow-xl hover:border-emerald-500/30 transition-all cursor-pointer group"
              >
                <div className="aspect-2/3 relative overflow-hidden bg-slate-900">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Badge */}
                  {book.countInStock === 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      SOLD OUT
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-white font-bold leading-tight mb-1 line-clamp-2 min-h-[1.25em] group-hover:text-emerald-400 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-slate-500 text-xs mb-3 truncate">
                    {book.author}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-bold">
                      ${book.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
