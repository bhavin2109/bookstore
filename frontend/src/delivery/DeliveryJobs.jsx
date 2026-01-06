import React, { useEffect, useState } from "react";
import {
  getMyAssignedOrders,
  updateDeliveryStatus,
  verifyDeliveryOtp,
} from "../services/deliveryServices";
import { toast } from "react-toastify";
import TrackingMap from "../components/TrackingMap";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const DeliveryJobs = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otpInput, setOtpInput] = useState("");
  const [verifyingId, setVerifyingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getMyAssignedOrders();
      // Filter for active orders (not delivered)
      const activeOrders = data.filter((o) => o.deliveryStatus !== "delivered");
      setOrders(activeOrders);
    } catch {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStartDelivery = async (orderId) => {
    try {
      if (!confirm("Start delivery for this order? This will generate an OTP."))
        return;
      await updateDeliveryStatus(orderId, "out_for_delivery");
      toast.success("Order marked Out For Delivery 🚚");
      fetchOrders();
    } catch (error) {
      toast.error(error.message || "Failed to update order");
    }
  };

  const handleVerifyOtp = async (orderId) => {
    try {
      if (!otpInput) return toast.warn("Please enter OTP");
      await verifyDeliveryOtp(orderId, otpInput);
      toast.success("Delivery Completed Successfully! 🎉");
      setVerifyingId(null);
      setOtpInput("");
      fetchOrders();
    } catch (error) {
      toast.error(error.message || "Invalid OTP");
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Active Jobs</h2>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-white/5">
          <p className="text-slate-400">No active jobs at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-slate-950 rounded-xl border border-white/10 p-6 shadow-md hover:border-emerald-500/30 transition-colors"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-emerald-400 font-mono text-sm">
                      #{order._id.slice(-6)}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        order.deliveryStatus === "out_for_delivery"
                          ? "bg-blue-500/10 text-blue-400 animate-pulse"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {order.deliveryStatus
                        ? order.deliveryStatus.replace(/_/g, " ")
                        : "Pending Pickup"}
                    </span>
                  </div>
                  <div>
                    <p className="text-slate-300 font-bold">
                      {order.user?.name || "Guest User"}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {order.shippingAddress?.address},{" "}
                      {order.shippingAddress?.city}
                    </p>
                    <p className="text-slate-500 text-xs mt-1">
                      Phone: {order.shippingAddress?.phone || "N/A"}
                    </p>
                  </div>
                  <div className="text-sm text-slate-400 border-t border-white/5 pt-2 mt-2">
                    <p>
                      {order.items?.length} Items • Total: ${order.totalPrice}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-center gap-2 min-w-[200px]">
                  {order.deliveryStatus === "out_for_delivery" && (
                    <div className="mb-4">
                      <p className="text-xs text-emerald-400 mb-2">
                        Live Tracking Active 📡
                      </p>
                      <TrackingMap
                        orderId={order._id}
                        isDeliveryPartner={true}
                      />
                    </div>
                  )}

                  {order.deliveryStatus === "out_for_delivery" ? (
                    <div className="bg-slate-900 p-4 rounded-lg border border-white/10">
                      {verifyingId === order._id ? (
                        <div className="space-y-2">
                          <p className="text-xs text-slate-400 text-center">
                            Ask customer for OTP
                          </p>
                          <input
                            type="text"
                            placeholder="Enter OTP"
                            className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-center text-white tracking-widest font-mono focus:border-emerald-500 outline-none"
                            maxLength={4}
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value)}
                          />
                          <button
                            onClick={() => handleVerifyOtp(order._id)}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded transition-colors"
                          >
                            Verify & Complete
                          </button>
                          <button
                            onClick={() => setVerifyingId(null)}
                            className="w-full text-slate-400 text-xs hover:text-white"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setVerifyingId(order._id);
                            setOtpInput("");
                          }}
                          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-500/20 transition-colors"
                        >
                          Complete Delivery
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartDelivery(order._id)}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-lg border border-white/10 transition-colors"
                    >
                      Start Delivery
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default DeliveryJobs;
