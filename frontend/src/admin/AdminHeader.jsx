import React from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminHeader = ({ children, title, actions, noPadding = false }) => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-slate-900 text-white font-sans selection:bg-emerald-500/30 overflow-hidden">
      {/* Sidebar - Desktop */}
      <AdminSidebar />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300 h-full">
        {/* Top Header */}
        <header className="shrink-0 border-b border-white/10 bg-slate-950/80 backdrop-blur-md px-6 py-3.5 flex items-center justify-between z-30">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white tracking-wide">
              {title || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {actions}
            <a
              href="/home"
              className="text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2"
            >
              Back to Website 🏡
            </a>
          </div>
        </header>

        {/* Page Content */}
        <main
          className={`flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${
            noPadding ? "" : "p-6"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminHeader;
