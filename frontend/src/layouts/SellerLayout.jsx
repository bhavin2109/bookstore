import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const SellerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const links = [
    { to: "/seller", label: "Dashboard", icon: "📊" },
    { to: "/seller/products", label: "My Products", icon: "📚" },
    { to: "/seller/orders", label: "Orders", icon: "📦" },
    { to: "/seller/shop", label: "Shop Profile", icon: "🏪" },
  ];

  const Sidebar = ({ mobile = false }) => (
    <div
      className={`h-full bg-slate-950 border-r border-white/10 flex flex-col ${
        mobile ? "w-64" : "w-64 h-full hidden md:flex"
      }`}
    >
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏪</span>
          <h2 className="text-xl font-bold text-white">Seller Hub</h2>
        </div>
        {mobile && (
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="text-slate-400 hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            onClick={() => mobile && setMobileSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              location.pathname === link.to
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span className="text-xl">{link.icon}</span>
            <span className="font-medium">{link.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={() => navigate("/home")}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <span>🏠</span> Back to Home
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-900 text-white selection:bg-emerald-500/30 overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 md:hidden h-full"
            >
              <Sidebar mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 h-full overflow-y-auto relative flex flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-slate-950/80 px-4 md:px-6 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-slate-300 hover:text-white"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
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
            <h1 className="text-lg font-bold">
              {links.find((l) => l.to === location.pathname)?.label ||
                "Seller Dashboard"}
            </h1>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
