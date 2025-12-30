import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { status } = useParams();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(
        "http://localhost:5000/api/orders",
        config
      );
      setOrders(data);
    } catch (error) {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const deliverHandler = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put(
        `http://localhost:5000/api/orders/${id}/deliver`,
        {},
        config
      );
      toast.success("Order marked as delivered");
      fetchOrders();
    } catch (error) {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  };

  // Filter Logic
  const filteredOrders = orders.filter((order) => {
    if (status === "pending") return !order.isDelivered && !order.isCancelled;
    if (status === "delivered") return order.isDelivered;
    if (status === "cancelled") return order.isCancelled;
    return true; // Show all if no status or unknown
  });

  const getTitle = () => {
    if (status === "pending") return "Pending Orders";
    if (status === "delivered") return "Delivered Orders";
    if (status === "cancelled") return "Cancelled Orders";
    return "All Orders Management";
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="sticky top-0 z-10 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-4 bg-slate-950/80 backdrop-blur-md border-b border-white/5 mb-6">
        <div className="min-w-0 flex-1">
          {status && (
            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors mb-2 group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
              Back to All Orders
            </Link>
          )}
          <h1 className="text-3xl font-bold text-white capitalize tracking-tight">
            {getTitle()}
          </h1>
          <p className="mt-1 text-sm text-slate-400 truncate">
            A list of {status || "all"} user orders including their details and
            status.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 flex justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500/30 border-t-emerald-500"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="mt-8 rounded-xl border border-white/10 bg-slate-900/50 p-12 text-center backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-white">No orders found</h2>
        </div>
      ) : (
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-sm shadow-xl">
                <table className="min-w-full divide-y divide-white/10">
                  <thead className="bg-white/5">
                    <tr>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                      >
                        User
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                      >
                        Total
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                      >
                        Paid
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                      >
                        Delivered
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredOrders.map((order) => (
                      <tr
                        key={order._id}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="whitespace-nowrap px-3 py-4 text-sm font-mono text-emerald-400">
                          {order._id}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300">
                          {order.user && order.user.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-white">
                          ₹{order.totalPrice.toFixed(2)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          {order.isPaid ? (
                            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                              Paid:{" "}
                              {new Date(order.paidAt).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-red-500/10 px-2 py-1 text-xs font-medium text-red-400 border border-red-500/20">
                              Not Paid
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          {order.isCancelled ? (
                            <span className="inline-flex items-center rounded-full bg-red-500/10 px-2 py-1 text-xs font-medium text-red-500 border border-red-500/20">
                              Cancelled
                            </span>
                          ) : order.isDelivered ? (
                            <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-400 border border-blue-500/20">
                              Delivered:{" "}
                              {new Date(order.deliveredAt).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-2 py-1 text-xs font-medium text-yellow-400 border border-yellow-500/20">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          {!order.isDelivered && !order.isCancelled && (
                            <button
                              onClick={() => deliverHandler(order._id)}
                              disabled={!order.isPaid}
                              className={`transition-colors ${
                                order.isPaid
                                  ? "text-emerald-400 hover:text-emerald-300"
                                  : "text-slate-600 cursor-not-allowed"
                              }`}
                              title={
                                !order.isPaid
                                  ? "Order must be paid before delivery"
                                  : "Mark as Delivered"
                              }
                            >
                              Mark Delivered
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
