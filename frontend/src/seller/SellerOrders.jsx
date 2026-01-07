import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../api/axios";
import { motion } from "framer-motion";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axiosInstance.get("/api/sellers/orders", config);
      setOrders(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load seller orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const markPacked = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // Using updateOrderStatus endpoint
      await axiosInstance.put(
        `/api/orders/${id}/status`,
        { status: "packed_by_seller" },
        config
      );
      toast.success("Order marked as Packed!");
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Manage Orders</h2>
        {loading ? (
          <div className="text-white">Loading...</div>
        ) : orders.length === 0 ? (
          <p className="text-gray-400">No orders found.</p>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex justify-between items-center"
              >
                <div>
                  <p className="text-emerald-400 font-mono text-sm">
                    #{order._id}
                  </p>
                  <p className="text-white font-medium mt-1">
                    {order.user?.name}
                  </p>
                  <p className="text-slate-400 text-sm">
                    Status:{" "}
                    <span className="uppercase">
                      {order.deliveryStatus.replace(/_/g, " ")}
                    </span>
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    Items: {order.orderItems.length}
                  </p>
                </div>
                <div>
                  {order.deliveryStatus === "placed" && (
                    <button
                      onClick={() => markPacked(order._id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
                    >
                      Mark as Packed
                    </button>
                  )}
                  {order.deliveryStatus === "packed_by_seller" && (
                    <span className="text-yellow-500 text-sm italic">
                      Waiting for delivery assignment
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SellerOrders;
