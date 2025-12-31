export const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : import.meta.env.VITE_API_URL || "https://bookstore-rnnf.onrender.com";
