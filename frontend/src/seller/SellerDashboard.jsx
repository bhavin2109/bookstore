import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const SellerDashboard = () => {
  const stats = [
    {
      label: "Total Sales",
      value: "$0.00",
      icon: "💰",
      color: "text-emerald-400",
    },
    { label: "Total Orders", value: "0", icon: "📦", color: "text-blue-400" },
    { label: "Products", value: "0", icon: "📚", color: "text-purple-400" },
    { label: "Store Views", value: "0", icon: "👀", color: "text-orange-400" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-slate-900/50 p-6 rounded-xl border border-white/5 hover:border-emerald-500/20 transition-colors group"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors ${stat.color}`}
              >
                {stat.icon}
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-slate-400 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 p-6 rounded-xl border border-white/5">
          <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
          <p className="text-slate-400 text-sm">No recent activity to show.</p>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-xl border border-white/5">
          <h3 className="text-xl font-bold text-white mb-4">Quick Limits</h3>
          {/* Add quick links or charts here */}
          <p className="text-slate-400 text-sm">
            Analytics charts coming soon.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SellerDashboard;
