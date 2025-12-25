import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const AdminHeader = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    // Also remove user object if present
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-emerald-500/30">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo / Title */}
          <div className="flex items-center gap-2">
            <Link
              to="/admin"
              className="text-xl font-bold tracking-wider text-white"
            >
              BOOKSTORE <span className="text-emerald-400">ADMIN</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `text-sm font-semibold tracking-wide transition-all hover:text-emerald-400 ${
                  isActive ? "text-emerald-400" : "text-slate-400"
                }`
              }
            >
              DASHBOARD
            </NavLink>
            <Link
              to="/home"
              className="text-sm font-semibold tracking-wide text-slate-400 transition-all hover:text-white"
            >
              VIEW SITE
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs">
              AD
            </div>
            <button
              onClick={handleLogout}
              className="rounded-md border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
            >
              LOGOUT
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl p-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default AdminHeader;
