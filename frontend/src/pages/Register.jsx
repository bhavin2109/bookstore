import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { registerUser } from "../services/authServices";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!form.name || !form.email || !form.password) {
      toast.error("All fields are required");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      await registerUser(form);
      // Store email in localStorage for OTP verification
      localStorage.setItem("registerEmail", form.email);
      toast.info("OTP sent to your email for verification.");
      navigate("/verify-otp");
    } catch (error) {
      console.log("Registration Error: ", error);
      toast.error(
        error.message || error.error || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
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
            Create your account
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold text-white"
          >
            Join the bookstore
          </motion.h2>
          <motion.p variants={itemVariants} className="text-sm text-slate-400">
            Get access to exclusive offers and faster checkout.
          </motion.p>
        </motion.div>

        <motion.form
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-8 space-y-6"
          onSubmit={handleRegister}
        >
          <div className="space-y-4">
            <motion.div
              variants={itemVariants}
              whileFocus={{ scale: 1.02 }}
              className="space-y-2"
            >
              <label
                htmlFor="name"
                className="text-sm font-medium text-slate-300"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-slate-500 transition-all"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileFocus={{ scale: 1.02 }}
              className="space-y-2"
            >
              <label
                htmlFor="email"
                className="text-sm font-medium text-slate-300"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-slate-500 transition-all"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileFocus={{ scale: 1.02 }}
              className="space-y-2"
            >
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-300"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-slate-500 transition-all"
                placeholder="Password (min 6 characters)"
                value={form.password}
                onChange={handleChange}
              />
            </motion.div>
          </div>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
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
            {loading ? "Registering..." : "Register"}
          </motion.button>

          <motion.div
            variants={itemVariants}
            className="text-center text-sm text-slate-400"
          >
            <p>
              Already have an account?{" "}
              <a
                className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                href="/login"
              >
                Sign in
              </a>
            </p>
          </motion.div>
        </motion.form>
      </motion.div>
    </motion.div>
  );
}

export default Register;
