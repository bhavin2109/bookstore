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
      <div className="flex justify-center items-center h-64 bg-slate-900">
        <p className="text-lg font-bold text-emerald-400">
          Loading products...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto h-[calc(100vh-4rem)] relative shadow-md">
      <table className="w-full text-left border-collapse relative min-w-[800px]">
        <thead className="bg-slate-800 text-white uppercase text-xs font-bold whitespace-nowrap">
          <tr>
            <th className="py-4 px-4 sticky top-0 z-20 bg-slate-800 border-b border-slate-700 shadow-sm">
              Cover
            </th>
            <th className="py-4 px-4 sticky top-0 z-20 bg-slate-800 border-b border-slate-700 shadow-sm">
              Title
            </th>
            <th className="py-4 px-4 sticky top-0 z-20 bg-slate-800 border-b border-slate-700 shadow-sm">
              Author
            </th>
            <th className="py-4 px-4 sticky top-0 z-20 bg-slate-800 border-b border-slate-700 shadow-sm">
              Price
            </th>
            <th className="py-4 px-4 text-right sticky top-0 z-20 bg-slate-800 border-b border-slate-700 shadow-sm">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-slate-800/50">
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
  );
};

export default BooksManagement;
