import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { verifyOtp as verifyOtpAPI } from "../services/authServices";

function VerifyOtp() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Get email from localStorage
    const registerEmail = localStorage.getItem("registerEmail");
    if (!registerEmail) {
      // If no email found, redirect to register
      navigate("/register");
    } else {
      setEmail(registerEmail);
    }
  }, [navigate]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      setLoading(false);
      return;
    }

    try {
      const response = await verifyOtpAPI({ email, otp });

      // Store token in localStorage
      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("userName", response.user.name);
      }

      // Clear register email
      localStorage.removeItem("registerEmail");

      toast.success("OTP verified successfully! You are now registered.");
      navigate("/home");
    } catch (error) {
      console.log("Verification Error: ", error);
      toast.error(
        error.message || error.error || "Invalid OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      if (!email) {
        toast.error("No email found to resend OTP.");
        return;
      }
      await resendOtpAPI(email);
      toast.success("OTP resent successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to resend OTP");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="h-[calc(100vh-4rem)] bg-slate-900 px-4 flex items-center justify-center overflow-hidden w-full"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mx-auto max-w-lg w-full rounded-2xl bg-slate-950 p-8 shadow-2xl border border-white/10"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-2 text-center"
        >
          <motion.p
            variants={itemVariants}
            className="text-sm font-semibold uppercase tracking-wide text-emerald-400"
          >
            Verify OTP
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold text-white"
          >
            Complete your signup
          </motion.h2>
          <motion.p variants={itemVariants} className="text-sm text-slate-400">
            We&apos;ve sent a 6-digit OTP to{" "}
            <strong className="font-semibold text-white">{email}</strong>
          </motion.p>
        </motion.div>
        <motion.form
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-8 space-y-6"
          onSubmit={handleVerifyOtp}
        >
          <motion.div
            variants={itemVariants}
            whileFocus={{ scale: 1.02 }}
            className="space-y-2"
          >
            <label htmlFor="otp" className="text-sm font-medium text-slate-300">
              OTP
            </label>
            <motion.input
              id="otp"
              name="otp"
              type="text"
              maxLength="6"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-center text-xl tracking-[0.35em] text-white shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all placeholder-slate-600"
              placeholder="000000"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setOtp(value);
              }}
              whileFocus={{ scale: 1.05 }}
            />
            <motion.div
              className="flex justify-center gap-2 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`h-2 w-2 rounded-full ${
                    i < otp.length ? "bg-emerald-500" : "bg-slate-700"
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: i < otp.length ? 1 : 0.5 }}
                  transition={{ type: "spring", stiffness: 500 }}
                />
              ))}
            </motion.div>
          </motion.div>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || otp.length !== 6}
            className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:cursor-not-allowed disabled:opacity-60 shadow-lg shadow-emerald-500/20"
          >
            {loading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mr-2"
              >
                ⏳
              </motion.span>
            ) : null}
            {loading ? "Verifying..." : "Verify OTP"}
          </motion.button>

          <motion.div
            variants={itemVariants}
            className="text-center text-sm text-slate-400"
          >
            <p>
              Didn&apos;t receive OTP?{" "}
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                onClick={handleResendOtp}
              >
                Resend OTP
              </motion.button>
            </p>
          </motion.div>
        </motion.form>
      </motion.div>
    </motion.div>
  );
}

export default VerifyOtp;
