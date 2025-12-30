import React from "react";
import { Link } from "react-router-dom";
import AdminCharts from "./AdminCharts";

const DashboardStatistics = ({ stats, loading }) => {
  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Revenue Card */}
        <div className="group relative overflow-hidden rounded-3xl bg-slate-900 border border-white/5 p-6 transition-all hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
          <p className="text-xs font-medium uppercase tracking-wider text-emerald-400">
            Total Revenue
          </p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">
              {loading ? "..." : `₹${stats.totalRevenue.toLocaleString()}`}
            </span>
          </div>
        </div>

        {/* Products Card */}
        <div className="group relative overflow-hidden rounded-3xl bg-slate-900 border border-white/5 p-6 transition-all hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-purple-500/10 blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
          <p className="text-xs font-medium uppercase tracking-wider text-purple-400">
            Active Books
          </p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">
              {loading ? "..." : stats.productCount}
            </span>
          </div>
        </div>

        {/* Users Card */}
        <div className="group relative overflow-hidden rounded-3xl bg-slate-900 border border-white/5 p-6 transition-all hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
          <p className="text-xs font-medium uppercase tracking-wider text-blue-400">
            Total Users
          </p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">
              {loading ? "..." : stats.userCount}
            </span>
          </div>
        </div>

        {/* Pending Orders Link Card */}
        <Link to="/admin/orders/pending" className="block">
          <div className="group relative overflow-hidden rounded-3xl bg-slate-900 border border-white/5 p-6 transition-all hover:border-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/10 cursor-pointer">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-orange-500/10 blur-2xl group-hover:bg-orange-500/20 transition-all"></div>
            <p className="text-xs font-medium uppercase tracking-wider text-orange-400 group-hover:text-orange-300 transition-colors">
              Pending Orders ↗
            </p>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white group-hover:text-orange-100 transition-colors">
                {loading ? "..." : stats.pendingOrders}
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Charts Section */}
      {!loading && stats && <AdminCharts stats={stats} />}

      {/* Order Status Breakdown with Links */}
      <h3 className="text-xl font-bold text-white mb-6">Order Status</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/orders/pending" className="block group">
          <div className="rounded-2xl bg-slate-900/50 border border-white/5 p-6 flex items-center justify-between transition-all hover:border-yellow-500/30 hover:bg-slate-900">
            <div>
              <p className="text-slate-400 text-sm group-hover:text-yellow-200 transition-colors">
                Pending
              </p>
              <p className="text-2xl font-bold text-yellow-400">
                {loading ? "-" : stats.pendingOrders}
              </p>
            </div>
            <div className="text-4xl group-hover:scale-110 transition-transform">
              ⏳
            </div>
          </div>
        </Link>

        <Link to="/admin/orders/delivered" className="block group">
          <div className="rounded-2xl bg-slate-900/50 border border-white/5 p-6 flex items-center justify-between transition-all hover:border-emerald-500/30 hover:bg-slate-900">
            <div>
              <p className="text-slate-400 text-sm group-hover:text-emerald-200 transition-colors">
                Delivered
              </p>
              <p className="text-2xl font-bold text-emerald-400">
                {loading ? "-" : stats.deliveredOrders}
              </p>
            </div>
            <div className="text-4xl group-hover:scale-110 transition-transform">
              ✅
            </div>
          </div>
        </Link>

        <Link to="/admin/orders/cancelled" className="block group">
          <div className="rounded-2xl bg-slate-900/50 border border-white/5 p-6 flex items-center justify-between transition-all hover:border-red-500/30 hover:bg-slate-900">
            <div>
              <p className="text-slate-400 text-sm group-hover:text-red-200 transition-colors">
                Cancelled
              </p>
              <p className="text-2xl font-bold text-red-400">
                {loading ? "-" : stats.cancelledOrders}
              </p>
            </div>
            <div className="text-4xl group-hover:scale-110 transition-transform">
              ❌
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DashboardStatistics;
