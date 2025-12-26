import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        // eslint-disable-next-line
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "A";
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-950 border-r border-white/10 min-h-screen fixed left-0 top-0 bottom-0 z-40">
      {/* Logo Area */}
      <div className="flex items-center h-16 px-6 border-b border-white/10">
        <Link
          to="/admin"
          className="text-xl font-bold tracking-wider text-white"
        >
          BOOKSTORE <span className="text-emerald-400">ADMIN</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`
          }
        >
          <span className="text-lg">📊</span>
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/books-management"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`
          }
        >
          <span className="text-lg">📚</span>
          Books
        </NavLink>
      </nav>

      {/* User Info / Dropdown */}
      <div className="p-4 border-t border-white/10 relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-white/5 transition-colors text-left"
        >
          <div className="h-9 w-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-emerald-500/20">
            {getInitials(user?.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.name || "Admin"}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {user?.email || "admin@bookstore.com"}
            </p>
          </div>
          <div
            className={`text-slate-400 transition-transform duration-200 ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          >
            ▼
          </div>
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: -5, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className="absolute bottom-full left-4 right-4 mb-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50"
            >
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
              >
                <span>🚪</span> Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
};

export default AdminSidebar;
