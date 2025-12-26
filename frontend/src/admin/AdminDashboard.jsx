import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "./AdminSidebar";
import BooksManagement from "./BooksManagement";
import DashboardStatistics from "./DashboardStatistics";
import { getProductCount, getUserCount } from "../services/productServices";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({ products: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  // Determine active view based on URL
  // Default is 'overview' (stats)
  // '/admin/books-management' -> 'books'
  const isBooksView = location.pathname.includes("books-management");

  useEffect(() => {
    // Auth Check
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

  useEffect(() => {
    // Only fetch stats if we are on the dashboard view
    if (!isBooksView) {
      const fetchStats = async () => {
        try {
          const [productData, userData] = await Promise.all([
            getProductCount(),
            getUserCount(),
          ]);
          setStats({
            products: productData.count,
            users: userData.count,
          });
        } catch (error) {
          console.error("Error fetching admin stats:", error);
          toast.error("Failed to load dashboard statistics.");
        } finally {
          setLoading(false);
        }
      };

      fetchStats();
    }
  }, [isBooksView]);

  return (
    <div className="flex h-screen bg-slate-950 text-white selection:bg-emerald-500/30 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Scroll Container */}
      <div className="flex-1 md:ml-64 transition-all duration-300 h-full overflow-y-auto relative">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/5 bg-slate-950/80 px-6 backdrop-blur-md shrink-0">
          <h1 className="text-xl font-bold text-white">
            {isBooksView ? "Books Management" : "Admin Dashboard"}
          </h1>
          <div className="flex items-center gap-4">
            {isBooksView && (
              <button
                onClick={() => navigate("/admin/books/add")}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md font-medium transition-colors text-sm shadow-lg shadow-emerald-500/20"
              >
                + Add Book
              </button>
            )}
            <button
              onClick={() => navigate("/home")}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              View Site ↗
            </button>
          </div>
        </header>

        <main
          className={`min-h-[calc(100vh-4rem)] ${isBooksView ? "p-0" : "p-6"}`}
        >
          <AnimatePresence mode="wait">
            {isBooksView ? (
              <Motion.div
                key="books"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <BooksManagement />
              </Motion.div>
            ) : (
              <Motion.div
                key="stats"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <DashboardStatistics stats={stats} loading={loading} />
              </Motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
