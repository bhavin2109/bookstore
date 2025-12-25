import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { loginUser } from "../services/authServices";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser(form);

      // Store token and user data
      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("userName", response.user.name);

        // Notify other tabs
        window.dispatchEvent(new Event("storage"));

        toast.success("Login successful!");
        navigate("/home");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] bg-slate-900 px-4 flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-lg w-full rounded-2xl bg-slate-950 p-8 shadow-2xl border border-white/10"
      >
        <div className="space-y-2 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-400">
            Welcome back
          </p>
          <h2 className="text-3xl font-bold text-white">Login</h2>
          <p className="text-sm text-slate-400">
            Access your account and continue exploring.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
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
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
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
                autoComplete="current-password"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-slate-500 transition-all"
                placeholder="Your password"
                value={form.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:cursor-not-allowed disabled:opacity-60 shadow-lg shadow-emerald-500/20"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>

          <p className="text-center text-sm text-slate-400 mt-4">
            Don't have an account?{" "}
            <a
              href="/register"
              className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Sign up
            </a>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
