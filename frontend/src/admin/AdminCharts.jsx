import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminCharts = ({ stats }) => {
  // --- 1. Monthly Revenue Data (Bar Chart) ---
  // Ensure we have an array for 12 months, initialized to 0
  const monthlyRevenueData = new Array(12).fill(0);

  if (stats.monthlyRevenue && Array.isArray(stats.monthlyRevenue)) {
    stats.monthlyRevenue.forEach((item) => {
      // MongoDB months are 1-12, array indices are 0-11
      if (item._id && item._id >= 1 && item._id <= 12) {
        monthlyRevenueData[item._id - 1] = item.total;
      }
    });
  }

  const barData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Revenue (₹)",
        data: monthlyRevenueData,
        backgroundColor: "rgba(16, 185, 129, 0.6)", // Emerald-500 with opacity
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#94a3b8", // slate-400
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        ticks: { color: "#94a3b8" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
      x: {
        ticks: { color: "#94a3b8" },
        grid: { display: false },
      },
    },
  };

  // --- 2. Order Status Data (Doughnut Chart) ---
  const doughnutData = {
    labels: ["Pending", "Delivered", "Cancelled"],
    datasets: [
      {
        data: [
          stats.pendingOrders || 0,
          stats.deliveredOrders || 0,
          stats.cancelledOrders || 0,
        ],
        backgroundColor: [
          "rgba(249, 115, 22, 0.7)", // Orange (Pending)
          "rgba(16, 185, 129, 0.7)", // Emerald (Delivered)
          "rgba(239, 68, 68, 0.7)", // Red (Cancelled)
        ],
        borderColor: [
          "rgba(249, 115, 22, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#e2e8f0", // slate-200
          font: { size: 12 },
        },
      },
    },
    cutout: "70%",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
      {/* Monthly Revenue Chart */}
      <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-6">Monthly Revenue</h3>
        <div className="h-64 sm:h-80">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      {/* Order Status Distribution */}
      <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-6">Order Statistics</h3>
        <div className="h-64 sm:h-80 flex items-center justify-center">
          <div className="w-full h-full relative">
            <Doughnut data={doughnutData} options={doughnutOptions} />
            {/* Center Text Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-white">
                {stats.pendingOrders +
                  stats.deliveredOrders +
                  stats.cancelledOrders || 0}
              </span>
              <span className="text-xs text-slate-400 uppercase tracking-wider">
                Total
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCharts;
