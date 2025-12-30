import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(
        "http://localhost:5000/api/orders/myorders",
        config
      );
      setOrders(data);
    } catch (error) {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const hideOrderHandler = async (id) => {
    if (window.confirm("Remove this order from your history?")) {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.put(
          `http://localhost:5000/api/orders/${id}/hide`,
          {},
          config
        );
        toast.success("Order removed from history");
        setOrders((prev) => prev.filter((order) => order._id !== id));
      } catch (error) {
        toast.error(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        );
      }
    }
  };

  const cancelOrderHandler = async (id) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.put(
          `http://localhost:5000/api/orders/${id}/cancel`,
          {},
          config
        );
        toast.success("Order cancelled successfully");
        fetchOrders(); // Refresh to update status
      } catch (error) {
        toast.error(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        );
      }
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 pt-24 pb-12">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-white border-l-4 border-emerald-500 pl-4">
          My Orders
        </h1>

        {loading ? (
          <div className="flex justify-center h-64 items-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500/30 border-t-emerald-500"></div>
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-slate-900/50 p-12 text-center backdrop-blur-sm"
          >
            <div className="bg-slate-800/50 p-4 rounded-full mb-4">
              <span className="text-4xl">🛍️</span>
            </div>
            <h2 className="text-xl font-semibold text-white">
              No orders found
            </h2>
            <p className="mt-2 text-slate-400 max-w-sm">
              You haven't placed any orders yet. Start adding books to your
              collection!
            </p>
            <Link
              to="/products"
              className="mt-6 inline-block rounded-lg bg-emerald-500 px-6 py-2 font-semibold text-white transition hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
            >
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence>
              {orders.map((order) => {
                const isCancellable =
                  !order.isCancelled &&
                  !order.isDelivered &&
                  (new Date() - new Date(order.createdAt)) / 36e5 < 24;

                return (
                  <motion.div
                    key={order._id}
                    variants={itemVariants}
                    exit={{ opacity: 0, scale: 0.9 }}
                    layout
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-slate-900/60 p-6 backdrop-blur-md transition-shadow hover:shadow-2xl hover:shadow-emerald-500/10"
                  >
                    {/* Header */}
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <p className="font-mono text-xs text-emerald-400">
                          #{order._id.substring(order._id.length - 8)}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(order.createdAt).toLocaleDateString(
                            undefined,
                            {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>

                      {/* Hide Button */}
                      <button
                        onClick={() => hideOrderHandler(order._id)}
                        className="text-slate-500 hover:text-white transition-colors p-1"
                        title="Hide from history"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18 18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {/* Paid Status */}
                      {order.isPaid ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-400 border border-red-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                          Pending Payment
                        </span>
                      )}

                      {/* Delivery Status */}
                      {order.isCancelled ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-400 border border-red-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                          Cancelled
                        </span>
                      ) : order.isDelivered ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400 border border-blue-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                          Delivered
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/10 px-2.5 py-0.5 text-xs font-medium text-yellow-400 border border-yellow-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span>
                          Processing
                        </span>
                      )}
                    </div>

                    {/* Order Items Preview */}
                    <div className="flex-1">
                      <div className="flex -space-x-3 overflow-hidden py-2">
                        {order.orderItems.slice(0, 4).map((item, index) => (
                          <div
                            key={index}
                            className="relative inline-block h-10 w-10 rounded-full ring-2 ring-slate-900 bg-slate-800"
                          >
                            {/* Assuming item.image exists based on schema */}
                            <img
                              className="h-full w-full rounded-full object-cover"
                              src={item.image}
                              alt={item.title}
                              onError={(e) => {
                                e.target.style.display = "none"; // Hide if broken
                              }}
                            />
                          </div>
                        ))}
                        {order.orderItems.length > 4 && (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 ring-2 ring-slate-900 text-xs text-white font-medium">
                            +{order.orderItems.length - 4}
                          </div>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-slate-400">
                        {order.orderItems.reduce(
                          (acc, item) => acc + item.quantity,
                          0
                        )}{" "}
                        items
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                      <div className="text-lg font-bold text-white">
                        ₹{order.totalPrice.toFixed(2)}
                      </div>
                      {isCancellable && (
                        <button
                          onClick={() => cancelOrderHandler(order._id)}
                          className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
