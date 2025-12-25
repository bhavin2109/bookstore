import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProducts, deleteProduct } from "../services/productServices";
import { toast } from "react-toastify";

const BooksManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  // Removed error state in favor of toast

  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getAllProducts();
      if (res && Array.isArray(res.products)) {
        console.log("Fetched Products:", res.products); // Debugging
        setProducts(res.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      toast.error(err?.message || err || "Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("You need to be logged in to delete.");
          return;
        }
        await deleteProduct(id, token);
        toast.success("Book deleted successfully");
        // Refresh list
        fetchProducts();
      } catch (err) {
        toast.error(err.message || "Failed to delete product");
      }
    }
  };

  // ⏳ loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white">
        <p className="text-lg font-bold text-black">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 p-6 rounded-lg text-white shadow-lg border border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-emerald-400">
          Books Management
        </h2>
        <button
          onClick={() => navigate("/admin/books/add")}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          + Add New Book
        </button>
      </div>

      {/* Products List Placeholder */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400 uppercase text-xs">
              <th className="py-3 px-4">Image</th>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Author</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-4 text-center text-slate-500">
                  No books found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-24 w-16 object-cover rounded shadow-sm bg-slate-700"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </td>
                  <td className="py-3 px-4 font-medium text-white">
                    {product.title}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {product.author ? (
                      product.author
                    ) : (
                      <span className="text-red-500 font-bold">MISSING</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">
                    ${product.price}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() =>
                          navigate(`/admin/books/edit/${product._id}`)
                        }
                        className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BooksManagement;
