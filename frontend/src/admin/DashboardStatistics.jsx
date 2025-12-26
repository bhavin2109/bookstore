import React from "react";

const DashboardStatistics = ({ stats, loading }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Products Card */}
      <div className="group relative overflow-hidden rounded-3xl bg-slate-900 border border-white/5 p-8 transition-all hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl transition-all group-hover:bg-emerald-500/20"></div>

        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-emerald-400">
              Total Revenue Source
            </p>
            <h3 className="text-3xl font-bold text-white mt-1">Products</h3>
          </div>
          <div className="rounded-2xl bg-slate-800/80 p-3 text-emerald-400 border border-white/5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            </svg>
          </div>
        </div>

        <div className="mt-8 flex items-end justify-between">
          <div>
            <div className="text-5xl font-bold text-white tracking-tight">
              {loading ? (
                <span className="animate-pulse">--</span>
              ) : (
                stats.products
              )}
            </div>
            <p className="mt-2 text-sm text-slate-400">
              Books currently available
            </p>
          </div>
          <div className="mb-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Users Card */}
      <div className="group relative overflow-hidden rounded-3xl bg-slate-900 border border-white/5 p-8 transition-all hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl transition-all group-hover:bg-blue-500/20"></div>

        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-blue-400">
              Community Growth
            </p>
            <h3 className="text-3xl font-bold text-white mt-1">Users</h3>
          </div>
          <div className="rounded-2xl bg-slate-800/80 p-3 text-blue-400 border border-white/5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
              />
            </svg>
          </div>
        </div>

        <div className="mt-8 flex items-end justify-between">
          <div>
            <div className="text-5xl font-bold text-white tracking-tight">
              {loading ? (
                <span className="animate-pulse">--</span>
              ) : (
                stats.users
              )}
            </div>
            <p className="mt-2 text-sm text-slate-400">Registered accounts</p>
          </div>
          <div className="mb-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400">
              Total
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStatistics;
