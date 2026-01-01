import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { registerUser, googleLogin } from "../services/authServices";
import { GoogleLogin } from "@react-oauth/google";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

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
      const data = await registerUser(form);

      // Auto-login logic
      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        // Also store for OTP logic if they choose to verify
        localStorage.setItem("registerEmail", form.email);
      }

      // Show choice toast or modal? For simplicity, we'll use a custom toast or just navigate to a choice handling state?
      // Requirement: "give option to user to go to home or verify email"

      // Let's use a browser confirm for MVP or a custom UI state.
      // A custom UI state in the component is better.
      setRegistrationSuccess(true);

      toast.success("Account created successfully!");
    } catch (error) {
      console.log("Registration Error: ", error);
      toast.error(
        error.message || error.error || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await googleLogin(credentialResponse.credential);
      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        // Dispatch storage event to notify other components
        window.dispatchEvent(new Event("storage"));
        toast.success("Account created via Google! 🎉");
        navigate("/home");
      }
    } catch (err) {
      console.error("Google Login error:", err);
      toast.error(err.message || "Google Sign-Up failed.");
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
          {registrationSuccess ? (
            <div className="space-y-6">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🎉</span>
              </div>
              <h2 className="text-2xl font-bold text-white">
                Welcome, {form.name}!
              </h2>
              <p className="text-slate-400">
                Your account has been created. <br />
                Verify your email now to place orders, or skip for later.
              </p>

              <div className="grid gap-4 mt-8">
                <button
                  onClick={() => navigate("/verify-otp")}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
                >
                  Verify Email Now
                </button>
                <button
                  onClick={() => navigate("/home")}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg transition-colors border border-white/10"
                >
                  Skip to Home
                </button>
              </div>
            </div>
          ) : (
            <>
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
              <motion.p
                variants={itemVariants}
                className="text-sm text-slate-400"
              >
                Get access to exclusive offers and faster checkout.
              </motion.p>
            </>
          )}
        </motion.div>

        {!registrationSuccess && (
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
            
            <motion.div variants={itemVariants} className="my-6 flex items-center">
                <div className="h-px flex-1 bg-slate-800" />
                <span className="px-4 text-xs text-slate-500 uppercase">Or sign up with</span>
                <div className="h-px flex-1 bg-slate-800" />
            </motion.div>

            <motion.div variants={itemVariants} className="flex justify-center">
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error("Google Sign-Up Failed")}
                    theme="filled_black"
                    shape="pill"
                    text="signup_with"
                />
            </motion.div>

          </motion.form>
        )}
      </motion.div>
    </motion.div>
  );
}

export default Register;
