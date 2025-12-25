import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById, updateProduct } from "../services/productServices";
import { toast } from "react-toastify";
import AdminHeader from "./AdminHeader";

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    genre: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const checkAdmin = () => {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      let isAdmin = false;

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          if (
            user.role === "admin" ||
            user.isAdmin === true ||
            user.isAdmin === "true"
          ) {
            isAdmin = true;
          }
        } catch (e) {
          console.error(e);
        }
      }

      if (!isAdmin) {
        toast.error("Access denied. Admin only.");
        navigate("/login");
      }
    };

    const fetchProduct = async () => {
      checkAdmin();

      try {
        const product = await getProductById(id);
        setFormData({
          title: product.title,
          author: product.author,
          description: product.description,
          price: product.price,
          genre: product.genre,
          image: product.image,
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authorized. Please login.");

      await updateProduct(id, formData, token);
      toast.success("Book updated successfully!");
      navigate("/admin/books-management");
    } catch (error) {
      toast.error(error.message || "Failed to update book");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <div className="text-center text-white py-10">Loading...</div>;

  return (
    <AdminHeader>
      <div className="max-w-2xl mx-auto bg-slate-800 p-8 rounded-lg border border-slate-700 shadow-xl">
        <h2 className="text-2xl font-bold text-blue-400 mb-6">Edit Book</h2>

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
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-blue-500 focus:outline-none"
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
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-blue-500 focus:outline-none"
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
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
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
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-blue-500 focus:outline-none"
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
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-bold transition-colors disabled:opacity-50"
            >
              {submitting ? "Updating..." : "Update Book"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/books-management")}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded font-bold transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminHeader>
  );
};

export default EditBook;
