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
    <AdminHeader
      title="Books Management"
      noPadding={true}
      actions={
        <button
          onClick={() => navigate("/admin/books/add")}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md font-medium transition-colors text-sm"
        >
          + Add New Book
        </button>
      }
    >
      <BooksManagement />
    </AdminHeader>
  );
};

export default AdminDashboard;
