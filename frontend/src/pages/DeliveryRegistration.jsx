import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestRole } from "../services/authServices";
import { toast } from "react-toastify";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const DeliveryRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vehicleType: "Bike",
    vehicleNumber: "",
    licenseNumber: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestRole("delivery", undefined, formData); // Pass formData as deliveryDetails
      toast.success("Delivery Partner request submitted successfully!");
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
          <span className="text-4xl">🚚</span>
          <h2 className="text-2xl font-bold text-white mt-4">
            Delivery Partner Registration
          </h2>
          <p className="text-slate-400 mt-2">Join our delivery fleet</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Vehicle Type
            </label>
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
            >
              <option value="Bike">Bike</option>
              <option value="Scooter">Scooter</option>
              <option value="Car">Car</option>
              <option value="Van">Van</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Vehicle Number
            </label>
            <input
              type="text"
              name="vehicleNumber"
              required
              value={formData.vehicleNumber}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
              placeholder="e.g. KA-01-AB-1234"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Driving License Number
            </label>
            <input
              type="text"
              name="licenseNumber"
              required
              value={formData.licenseNumber}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
              placeholder="License Number"
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

export default DeliveryRegistration;
