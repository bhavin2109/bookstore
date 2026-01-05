import React, { useEffect, useState } from "react";
import { getMyAssignedOrders } from "../services/deliveryServices";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const DeliveryHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getMyAssignedOrders();
        // Filter for delivered orders
        const history = data.filter((o) => o.deliveryStatus === "delivered");
        setOrders(history);
      } catch {
        toast.error("Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Delivery History</h2>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-white/5">
          <p className="text-slate-400">No completed deliveries yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-slate-900/50 rounded-xl border border-white/5 p-6 opacity-75 hover:opacity-100 transition-opacity"
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-emerald-400 font-mono text-sm">
                    #{order._id.slice(-6)}
                  </span>
                  <p className="text-slate-300 font-bold mt-1">
                    {order.user?.name || "Guest User"}
                  </p>
                  <p className="text-slate-400 text-sm">
                    {new Date(order.deliveredAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-500/10 text-emerald-400">
                    Delivered
                  </span>
                  <p className="text-slate-300 font-bold mt-2">
                    ${order.totalPrice}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default DeliveryHistory;
