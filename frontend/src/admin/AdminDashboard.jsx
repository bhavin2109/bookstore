import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "./AdminSidebar";
import BooksManagement from "./BooksManagement";
import AdminOrders from "./AdminOrders";
import DashboardStatistics from "./DashboardStatistics";
import axios from "axios";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    bookCount: 0,
    userCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Determine active view based on URL
  const isBooksView = location.pathname.includes("books-management");
  const isOrdersView = location.pathname.includes("orders");

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
    if (!isBooksView && !isOrdersView) {
      const fetchStats = async () => {
        try {
          const token = localStorage.getItem("token");
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          const { data } = await axios.get(
            `http://localhost:5000/api/orders/stats`,
            config
          );
          setStats(data);
        } catch (error) {
          console.error("Error fetching admin stats:", error);
          toast.error("Failed to load dashboard statistics.");
        } finally {
          setLoading(false);
        }
      };

      fetchStats();
    }
  }, [isBooksView, isOrdersView]);

  return (
    <div className="flex h-screen bg-slate-950 text-white selection:bg-emerald-500/30 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Scroll Container */}
      <div className="flex-1 md:ml-64 transition-all duration-300 h-full overflow-y-auto relative">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/5 bg-slate-950/80 px-4 md:px-6 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              className="md:hidden text-white hover:text-emerald-400 transition-colors"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
            <h1 className="text-lg md:text-xl font-bold text-white truncate">
              {isBooksView ? (
                "Books Management"
              ) : isOrdersView ? (
                <span className="capitalize">
                  Orders
                  {location.pathname.split("/").pop() !== "orders" && (
                    <span className="text-slate-400">
                      {" / "}
                      {location.pathname.split("/").pop()}
                    </span>
                  )}
                </span>
              ) : (
                "Admin Dashboard"
              )}
            </h1>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            {isBooksView && (
              <button
                onClick={() => navigate("/admin/books/add")}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-md font-medium transition-colors text-xs md:text-sm shadow-lg shadow-emerald-500/20 whitespace-nowrap flex items-center gap-2"
              >
                <span className="text-lg leading-none">+</span> Add Book
              </button>
            )}
            <button
              onClick={() => navigate("/home")}
              className="hidden md:block text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              View Site ↗
            </button>
          </div>
        </header>

        <main
          className={`min-h-[calc(100vh-4rem)] ${
            isBooksView || isOrdersView ? "p-0" : "p-6"
          }`}
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
            ) : isOrdersView ? (
              <Motion.div
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <AdminOrders />
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
