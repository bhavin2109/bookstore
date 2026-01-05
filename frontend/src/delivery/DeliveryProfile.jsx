import React, { useEffect, useState } from "react";
import { getMyDeliveryProfile } from "../services/deliveryServices";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const DeliveryProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyDeliveryProfile();
        setProfile(data);
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="text-white">Loading...</div>;
  if (!profile) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-slate-900/50 p-8 rounded-xl border border-white/5 text-center">
        <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">👤</span>
        </div>
        <h2 className="text-2xl font-bold text-white">{profile.user?.name}</h2>
        <p className="text-slate-400">{profile.user?.email}</p>

        <div className="mt-8 grid grid-cols-2 gap-4 text-left">
          <div className="bg-slate-950 p-4 rounded-lg border border-white/5">
            <label className="text-xs text-emerald-400 uppercase font-bold">
              Vehicle Type
            </label>
            <p className="text-white font-medium mt-1">
              {profile.vehicleType || "Not Set"}
            </p>
          </div>
          <div className="bg-slate-950 p-4 rounded-lg border border-white/5">
            <label className="text-xs text-emerald-400 uppercase font-bold">
              Vehicle Number
            </label>
            <p className="text-white font-medium mt-1">
              {profile.vehicleNumber || "Not Set"}
            </p>
          </div>
          <div className="bg-slate-950 p-4 rounded-lg border border-white/5 col-span-2">
            <label className="text-xs text-emerald-400 uppercase font-bold">
              Status
            </label>
            <p
              className={`font-medium mt-1 ${
                profile.isAvailable ? "text-emerald-400" : "text-slate-400"
              }`}
            >
              {profile.isAvailable ? "Available for Orders 🟢" : "Offline 🔴"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DeliveryProfile;
