import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import AddressBook from "../components/AddressBook";

import {
  resendOtp as resendOtpApi,
  getProfile,
} from "../services/authServices";
import { toast } from "react-toastify";
export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Failed to parse user data", error);
      return null;
    }
  });

  const handleVerifyEmail = async () => {
    try {
      if (!user?.email) return;
      await resendOtpApi(user.email);
      // Store email for OTP page
      localStorage.setItem("registerEmail", user.email);
      toast.info("OTP sent to your email.");
      navigate("/verify-otp");
    } catch (error) {
      toast.error(error.message || "Failed to send OTP");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const userData = await getProfile();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };
    fetchProfile();
  }, [navigate]);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-emerald-400 font-bold text-xl animate-pulse">
          Loading Profile...
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-end justify-between border-b border-white/10 pb-6"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Account Settings
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Manage your profile information and account preferences.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-red-500/10 text-slate-300 hover:text-red-400 transition-colors border border-white/10"
          >
            <span>🚪</span> Sign Out
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: ID Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-slate-950 rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative">
              <div className="absolute top-0 inset-x-0 h-32 bg-linear-to-b from-emerald-600/20 to-transparent opacity-50"></div>
              <div className="p-8 flex flex-col items-center relative z-10">
                <div className="w-32 h-32 rounded-full bg-slate-900 border-4 border-slate-800 shadow-xl flex items-center justify-center mb-6">
                  <span className="text-6xl font-bold text-emerald-500 uppercase select-none">
                    {user.name ? user.name.charAt(0) : "U"}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-center mb-1">
                  {user.name}
                </h2>
                <p className="text-emerald-400 text-sm font-medium uppercase tracking-wider mb-6">
                  {user.role || "Member"}
                </p>

                {/* Verification Status Badge */}
                <div
                  className={`mb-6 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    user.isVerified
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                  }`}
                >
                  {user.isVerified ? "Verified Account" : "Unverified"}
                </div>

                <div className="w-full space-y-3">
                  {user.role === "admin" && (
                    <button
                      onClick={() => navigate("/admin")}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-emerald-500/20"
                    >
                      <span>⚡</span> Admin Dashboard
                    </button>
                  )}

                  {!user.isVerified && (
                    <button
                      onClick={handleVerifyEmail}
                      className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-orange-500/20"
                    >
                      <span>✉️</span> Verify Email
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="sm:hidden w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-red-500/10 text-slate-300 hover:text-red-400 py-2.5 rounded-lg font-medium transition-colors border border-white/10"
                  >
                    <span>🚪</span> Sign Out
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Personal Info Section */}
            <div className="bg-slate-950 rounded-2xl border border-white/10 p-8 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-emerald-400">👤</span> Personal
                Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="bg-slate-900/50 border border-white/5 rounded-lg p-3 text-slate-200">
                    {user.name}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="bg-slate-900/50 border border-white/5 rounded-lg p-3 text-slate-200">
                    {user.email}
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Account ID
                  </label>
                  <div className="bg-slate-900/50 border border-white/5 rounded-lg p-3 text-slate-400 font-mono text-xs select-all">
                    {user.id || user._id}
                  </div>
                </div>
              </div>
            </div>

            {/* Role Management Section */}
            <div className="bg-slate-950 rounded-2xl border border-white/10 p-8 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-emerald-400">💼</span> Join Our Team
              </h3>

              {user.roleRequestStatus === "pending" ? (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center">
                  <p className="text-yellow-400 font-medium">
                    Your request to become a{" "}
                    <span className="font-bold uppercase">
                      {user.roleRequest}
                    </span>{" "}
                    is currently pending approval.
                  </p>
                </div>
              ) : user.role === "user" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => navigate("/seller-registration")}
                    className="flex flex-col items-center justify-center p-6 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-xl transition-all group"
                  >
                    <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                      🏪
                    </span>
                    <span className="font-bold text-white">
                      Become a Seller
                    </span>
                    <span className="text-xs text-slate-400 mt-1">
                      Start selling your books
                    </span>
                  </button>
                  <button
                    onClick={() => navigate("/delivery-registration")}
                    className="flex flex-col items-center justify-center p-6 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-xl transition-all group"
                  >
                    <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                      🚚
                    </span>
                    <span className="font-bold text-white">
                      Become a Delivery Partner
                    </span>
                    <span className="text-xs text-slate-400 mt-1">
                      Earn by delivering orders
                    </span>
                  </button>
                </div>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 text-center">
                  <p className="text-emerald-400 font-medium">
                    You are a registered{" "}
                    <span className="font-bold uppercase">{user.role}</span>.
                  </p>
                </div>
              )}
            </div>

            {/* Address Book */}
            <AddressBook />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
