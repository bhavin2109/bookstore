import React, { useState, useEffect } from "react";
import {
  getMySellerProfile,
  updateSellerProfile,
} from "../services/sellerServices";
import { toast } from "react-toastify";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const SellerShopSettings = () => {
  const [store, setStore] = useState({
    storeName: "",
    description: "",
    slug: "",
    themeColor: "#10b981",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const data = await getMySellerProfile();
        setStore(data);
      } catch {
        toast.error("Failed to fetch store details");
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, []);

  const handleUpdateStore = async (e) => {
    e.preventDefault();
    try {
      await updateSellerProfile(store);
      toast.success("Store updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update store");
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <form
        onSubmit={handleUpdateStore}
        className="space-y-6 bg-slate-900/50 p-6 rounded-xl border border-white/5"
      >
        <div className="space-y-2">
          <label className="block text-sm font-bold text-emerald-400 uppercase tracking-wider">
            Store Name
          </label>
          <input
            type="text"
            value={store.storeName}
            onChange={(e) => setStore({ ...store, storeName: e.target.value })}
            className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-emerald-400 uppercase tracking-wider">
            Description
          </label>
          <textarea
            value={store.description}
            onChange={(e) =>
              setStore({ ...store, description: e.target.value })
            }
            className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-hidden focus:border-emerald-500 transition-colors h-32"
            placeholder="Tell customers about your store..."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-emerald-400 uppercase tracking-wider">
            Store URL Slug
          </label>
          <div className="flex items-center">
            <span className="bg-slate-800 border border-r-0 border-white/10 rounded-l-lg px-3 py-3 text-slate-400 text-sm">
              /shop/
            </span>
            <input
              type="text"
              value={store.slug}
              onChange={(e) =>
                setStore({
                  ...store,
                  slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                })
              }
              className="flex-1 bg-slate-950 border border-white/10 rounded-r-lg px-4 py-3 text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
              required
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            Save Changes
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default SellerShopSettings;
