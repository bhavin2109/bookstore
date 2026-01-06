import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  getUserAddresses,
  addAddress,
  removeAddress,
} from "../services/authServices";
import { toast } from "react-toastify";

export default function AddressBook() {
  const [addresses, setAddresses] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const data = await getUserAddresses();
      setAddresses(data);
    } catch (error) {
      console.error("Failed to fetch addresses", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const res = await addAddress(data);
      setAddresses(res.addresses);
      setIsAdding(false);
      reset();
      toast.success("Address added successfully");
    } catch (error) {
      toast.error(error.message || "Failed to add address");
    }
  };

  const handleDelete = async (addressId) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await removeAddress(addressId);
      setAddresses(res.addresses);
      toast.success("Address removed");
    } catch {
      toast.error("Failed to remove address");
    }
  };

  return (
    <div className="bg-slate-950 rounded-2xl border border-white/10 p-8 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-emerald-400">📍</span> Address Book
        </h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-bold transition-colors border border-emerald-500/20"
        >
          {isAdding ? "Cancel" : "+ Add New"}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="mb-8 space-y-4 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <input
                  {...register("street", { required: "Street is required" })}
                  placeholder="Street Address"
                  className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                />
                {errors.street && (
                  <p className="text-red-400 text-xs">
                    {errors.street.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <input
                  {...register("city", { required: "City is required" })}
                  placeholder="City"
                  className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                />
                {errors.city && (
                  <p className="text-red-400 text-xs">{errors.city.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <input
                  {...register("state", { required: "State is required" })}
                  placeholder="State"
                  className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                />
                {errors.state && (
                  <p className="text-red-400 text-xs">{errors.state.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <input
                  {...register("zip", { required: "ZIP Code is required" })}
                  placeholder="ZIP Code"
                  className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                />
                {errors.zip && (
                  <p className="text-red-400 text-xs">{errors.zip.message}</p>
                )}
              </div>
              <div className="space-y-1 md:col-span-2">
                <input
                  {...register("country", { required: "Country is required" })}
                  placeholder="Country"
                  defaultValue="India"
                  className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                />
                {errors.country && (
                  <p className="text-red-400 text-xs">
                    {errors.country.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("isDefault")}
                className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label className="text-sm text-slate-400">
                Set as default address
              </label>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors"
            >
              Save Address
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {loading ? (
          <p className="text-slate-500 text-center py-4">
            Loading addresses...
          </p>
        ) : addresses.length === 0 ? (
          <p className="text-slate-500 text-center py-4 italic">
            No addresses saved yet.
          </p>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr._id}
              className="bg-slate-900 p-4 rounded-xl border border-white/5 flex items-start justify-between group"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-white">
                    {addr.street}, {addr.city}
                  </p>
                  {addr.isDefault && (
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-400">
                  {addr.state}, {addr.zip}, {addr.country}
                </p>
              </div>
              <button
                onClick={() => handleDelete(addr._id)}
                className="p-2 text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                title="Remove Address"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
