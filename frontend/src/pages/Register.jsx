import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
// import { registerUser } from '../services/authServices';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error on input change
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      // const response = await registerUser(form);
      // Store email in localStorage for OTP verification
      localStorage.setItem("registerEmail", form.email);
      alert("OTP sent to your email for verification.");
      navigate("/verify-otp");
    } catch (error) {
      console.log("Registration Error: ", error);
      setError(
        error.message || error.error || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div>
          <h2 className="form-title">
            Create your account
          </h2>
        </div>
        <form className="form" onSubmit={handleRegister}>
          {error && (
            <div className="error-message" role="alert">
              <span>{error}</span>
            </div>
          )}

          <div className="form-input-group">
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="form-input"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="form-input"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="form-input"
                placeholder="Password (min 6 characters)"
                value={form.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="form-button"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>

          <div className="form-link">
            <p>
              Already have an account?{" "}
              <a href="/login">
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
