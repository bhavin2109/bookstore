import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBookById, updateBook } from "../services/bookServices";
import { toast } from "react-toastify";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const SellerEditBook = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    genre: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const book = await getBookById(id);
        setFormData({
          title: book.title,
          author: book.author,
          description: book.description,
          price: book.price,
          genre: book.genre,
          image: book.image,
        });
      } catch {
        toast.error("Failed to fetch book details");
        navigate("/seller/products");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authorized. Please login.");

      await updateBook(id, formData);
      toast.success("Book updated successfully!");
      navigate("/seller/products");
    } catch (err) {
      toast.error(err.message || "Failed to update book");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-slate-900/50 p-8 rounded-xl border border-white/5 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">Edit Product</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-400 text-sm mb-1">
              Book Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-hidden transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-sm mb-1">
                Author
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-hidden transition-colors"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Genre</label>
              <input
                type="text"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                required
                className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-hidden transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-1">
              Price ($)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-hidden transition-colors"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-hidden transition-colors"
            ></textarea>
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-1">
              Image URL
            </label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-hidden transition-colors"
            />
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="submit"
              disabled={updating}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-bold transition-colors disabled:opacity-50 shadow-lg shadow-emerald-500/20"
            >
              {updating ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/seller/products")}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg font-bold transition-colors border border-white/10"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default SellerEditBook;
