import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../api/axios";
import { Link, useParams } from "react-router-dom";
import { getAllDeliveryPartners } from "../services/deliveryServices";
import { assignOrder } from "../services/orderServices";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { status } = useParams();
  const [partners, setPartners] = useState([]);
  const [assigningOrder, setAssigningOrder] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState("");

  const fetchPartners = async () => {
    try {
      const data = await getAllDeliveryPartners();
      setPartners(data);
    } catch (error) {
      console.error("Failed to fetch partners", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await axiosInstance.get("/api/orders");
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
    fetchPartners();
  }, []);

  const handleAssign = async (orderId) => {
    if (!selectedPartner) return toast.warn("Select a partner first");
    try {
      await assignOrder(orderId, selectedPartner);
      toast.success("Order assigned successfully");
      setAssigningOrder(null);
      setSelectedPartner("");
      fetchOrders();
    } catch (error) {
      toast.error(error.message || "Assignment failed");
    }
  };

  const deliverHandler = async (id) => {
    try {
      await axiosInstance.put(`/api/orders/${id}/deliver`, {});
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

  return (
    <div className="w-full overflow-auto h-[calc(100vh-4rem)] relative">
      {status && (
        <div className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-white/5 p-4 flex items-center">
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors group"
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
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500/30 border-t-emerald-500"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-8 text-center text-slate-500">No orders found.</div>
      ) : (
        <div className="min-w-[1000px]">
          <table className="w-full text-left border-collapse relative">
            <thead className="bg-slate-800 text-white uppercase text-xs font-bold whitespace-nowrap">
              <tr>
                <th className="py-4 px-4 sticky top-0 z-20 bg-slate-800 border-b border-slate-700 shadow-sm">
                  ID
                </th>
                <th className="py-4 px-4 sticky top-0 z-20 bg-slate-800 border-b border-slate-700 shadow-sm">
                  User
                </th>
                <th className="py-4 px-4 sticky top-0 z-20 bg-slate-800 border-b border-slate-700 shadow-sm">
                  Date
                </th>
                <th className="py-4 px-4 sticky top-0 z-20 bg-slate-800 border-b border-slate-700 shadow-sm">
                  Total
                </th>
                <th className="py-4 px-4 sticky top-0 z-20 bg-slate-800 border-b border-slate-700 shadow-sm">
                  Paid
                </th>
                <th className="py-4 px-4 sticky top-0 z-20 bg-slate-800 border-b border-slate-700 shadow-sm">
                  Delivered
                </th>
                <th className="py-4 px-4 text-right sticky top-0 z-20 bg-slate-800 border-b border-slate-700 shadow-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-800/50">
              {filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                >
                  <td className="py-3 px-4 text-sm font-mono text-emerald-400">
                    {order._id}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-300">
                    {order.user && order.user.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-300">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-white">
                    ₹{order.totalPrice.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {order.isPaid ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                        Paid: {new Date(order.paidAt).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-500/10 px-2 py-1 text-xs font-medium text-red-400 border border-red-500/20">
                        Not Paid
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm">
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
                  <td className="relative py-3 px-4 text-right text-sm font-medium">
                    {!order.isDelivered && !order.isCancelled && (
                      <div className="flex flex-col gap-2 justify-end items-end">
                        {order.deliveryPartner ? (
                          <span className="text-xs text-blue-400 border border-blue-500/30 px-2 py-1 rounded">
                            Assigned:{" "}
                            {partners.find(
                              (p) => p._id === order.deliveryPartner
                            )?.user?.name || "Partner"}
                          </span>
                        ) : assigningOrder === order._id ? (
                          <div className="flex items-center gap-2 bg-slate-900 p-2 rounded border border-slate-700 absolute right-4 z-50 shadow-xl">
                            <select
                              className="bg-slate-800 text-white text-xs p-1 rounded border border-slate-600 outline-none"
                              value={selectedPartner}
                              onChange={(e) =>
                                setSelectedPartner(e.target.value)
                              }
                            >
                              <option value="">Select Partner</option>
                              {partners.map((p) => (
                                <option key={p._id} value={p._id}>
                                  {p.user?.name}{" "}
                                  {p.isAvailable ? "(Online)" : "(Offline)"}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleAssign(order._id)}
                              className="text-xs bg-emerald-500 text-white px-2 py-1 rounded hover:bg-emerald-600"
                            >
                              ✔
                            </button>
                            <button
                              onClick={() => setAssigningOrder(null)}
                              className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setAssigningOrder(order._id)}
                            disabled={!order.isPaid}
                            className={`text-xs px-2 py-1 rounded border ${
                              order.isPaid
                                ? "border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                                : "border-slate-700 text-slate-600 cursor-not-allowed"
                            }`}
                          >
                            Assign Partner
                          </button>
                        )}

                        <button
                          onClick={() => deliverHandler(order._id)}
                          disabled={!order.isPaid}
                          className={`transition-colors text-xs font-bold ${
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
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
