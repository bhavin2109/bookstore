import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "../services/productServices.js";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProducts();

        // 🛡️ safety check
        if (res && Array.isArray(res.products)) {
          setProducts(res.products);
        } else {
          setProducts([]);
        }
      } catch (err) {
        setError(
          err?.message ||
          err ||
          "Failed to fetch products. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ⏳ loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white">
        <p className="text-lg font-bold text-black">Loading products...</p>
      </div>
    );
  }

  // ❌ error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-64 bg-white">
        <p className="text-red-600 font-bold">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tight mb-3">
            Our Collection
          </h1>
          <p className="text-gray-600 text-lg">Discover your next great read</p>
        </motion.div>

        {products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-xl font-medium text-gray-500">No products available at the moment.</p>
          </motion.div>
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
            {products.map((product, index) => (
              <ProductCard
                key={product._id}
                book={product}
                index={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                onClick={() => navigate(`/products/${product._id}`)}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Products;
