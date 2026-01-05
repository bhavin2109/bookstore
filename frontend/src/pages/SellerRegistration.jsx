import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestRole } from "../services/authServices";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const SellerRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    shopName: "",
    shopDescription: "",
    shopAddress: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestRole("seller", formData); // Pass formData to requestRole
      toast.success("Seller request submitted successfully!");
      navigate("/profile");
    } catch (error) {
      toast.error(error.message || "Failed to submit request");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-950 p-8 rounded-2xl border border-white/10 shadow-2xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <span className="text-4xl">🏪</span>
          <h2 className="text-2xl font-bold text-white mt-4">
            Become a Seller
          </h2>
          <p className="text-slate-400 mt-2">Start your journey with us</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Shop Name
            </label>
            <input
              type="text"
              name="shopName"
              required
              value={formData.shopName}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
              placeholder="e.g. Danny's Bookstore"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              name="shopDescription"
              rows="3"
              value={formData.shopDescription}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
              placeholder="Tell us about your shop..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Shop Address
            </label>
            <input
              type="text"
              name="shopAddress"
              required
              value={formData.shopAddress}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
              placeholder="Full address"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
          >
            Submit Application
          </button>

          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="w-full text-slate-400 hover:text-white text-sm transition-colors"
          >
            Cancel
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default SellerRegistration;
