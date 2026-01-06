import React, { useEffect, useState } from "react";
import {
  getMyDeliveryProfile,
  updateDeliveryProfile,
  getMyAssignedOrders,
} from "../services/deliveryServices";
import { toast } from "react-toastify";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const DeliveryDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    active: 0,
    completed: 0,
    earnings: "$0.00", // Placeholder
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, ordersData] = await Promise.all([
          getMyDeliveryProfile(),
          getMyAssignedOrders(),
        ]);
        setProfile(profileData);

        const active = ordersData.filter(
          (o) => o.deliveryStatus !== "delivered"
        ).length;
        const completed = ordersData.filter(
          (o) => o.deliveryStatus === "delivered"
        ).length;

        setStats({ active, completed, earnings: "$0.00" });
      } catch {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggleAvailability = async () => {
    try {
      const updated = await updateDeliveryProfile({
        isAvailable: !profile.isAvailable,
      });
      setProfile(updated);
      toast.success(
        `You are now ${updated.isAvailable ? "Online 🟢" : "Offline 🔴"}`
      );
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-center mb-8 bg-slate-900/50 p-6 rounded-xl border border-white/5">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">
            Welcome back, {profile?.user?.name}
          </h1>
          <p className="text-slate-400">Here's your delivery summary</p>
        </div>
        <div className="flex items-center gap-4">
          <span
            className={`text-sm font-bold uppercase tracking-wider ${
              profile?.isAvailable ? "text-emerald-400" : "text-slate-500"
            }`}
          >
            {profile?.isAvailable ? "Online" : "Offline"}
          </span>
          <button
            onClick={handleToggleAvailability}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${
              profile?.isAvailable ? "bg-emerald-500" : "bg-slate-600"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                profile?.isAvailable ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 p-6 rounded-xl border border-white/5">
          <div className="text-emerald-400 text-3xl mb-2">🚀</div>
          <h3 className="text-2xl font-bold text-white">{stats.active}</h3>
          <p className="text-slate-400 text-sm">Active Jobs</p>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-xl border border-white/5">
          <div className="text-blue-400 text-3xl mb-2">✅</div>
          <h3 className="text-2xl font-bold text-white">{stats.completed}</h3>
          <p className="text-slate-400 text-sm">Completed Deliveries</p>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-xl border border-white/5">
          <div className="text-yellow-400 text-3xl mb-2">💰</div>
          <h3 className="text-2xl font-bold text-white">{stats.earnings}</h3>
          <p className="text-slate-400 text-sm">Total Earnings</p>
        </div>
      </div>
    </motion.div>
  );
};

export default DeliveryDashboard;
