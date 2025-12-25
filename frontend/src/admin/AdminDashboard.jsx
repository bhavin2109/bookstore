import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import BooksManagement from "./BooksManagement";

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    let isAdmin = false;

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (
          user.role === "admin" ||
          user.isAdmin === true ||
          user.isAdmin === "true"
        ) {
          isAdmin = true;
        }
      } catch (e) {
        console.error("Auth check failed", e);
      }
    }

    if (!isAdmin) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <AdminHeader>
      <div className="bg-slate-800 p-6 rounded-lg text-white shadow-lg border border-slate-700 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-emerald-400">
          Admin Dashboard
        </h2>
        <p className="text-slate-300">
          Welcome to the admin panel. Manage your bookstore here.
        </p>
      </div>
      <BooksManagement />
    </AdminHeader>
  );
};

export default AdminDashboard;
