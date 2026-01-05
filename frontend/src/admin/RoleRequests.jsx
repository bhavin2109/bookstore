import React, { useEffect, useState } from "react";
import { getRoleRequests, updateRoleRequest } from "../services/authServices";
import { toast } from "react-toastify";

const RoleRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const data = await getRoleRequests();
      setRequests(data);
    } catch (error) {
      toast.error(error.message || "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, status) => {
    try {
      if (!confirm(`Are you sure you want to ${status} this request?`)) return;
      await updateRoleRequest(id, status);
      toast.success(`Request ${status} successfully`);
      fetchRequests(); // Refresh list
    } catch (error) {
      toast.error(error.message || "Failed to update request");
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400">Loading requests...</div>
    );
  }

  return (
    <div className="w-full overflow-auto h-[calc(100vh-4rem)] relative">
      {loading ? (
        <div className="flex justify-center items-center h-64 bg-slate-900">
          <p className="text-lg font-bold text-emerald-400">
            Loading requests...
          </p>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center text-slate-500 py-10">
          No pending role requests found.
        </div>
      ) : (
        <div className="min-w-[800px]">
          <table className="w-full text-left border-collapse relative">
            <thead className="bg-slate-800 text-white uppercase text-xs font-bold whitespace-nowrap">
              <tr>
                <th className="py-4 px-4 sticky top-0 z-20 bg-slate-800 border-b border-slate-700 shadow-sm">
                  User
                </th>
                <th className="py-4 px-4 sticky top-0 z-20 bg-slate-800 border-b border-slate-700 shadow-sm">
                  Email
                </th>
                <th className="py-4 px-4 sticky top-0 z-20 bg-slate-800 border-b border-slate-700 shadow-sm">
                  Requested Role
                </th>
                <th className="py-4 px-4 text-right sticky top-0 z-20 bg-slate-800 border-b border-slate-700 shadow-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-800/50">
              {requests.map((req) => (
                <tr
                  key={req._id}
                  className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                >
                  <td className="py-3 px-4 font-medium text-white">
                    {req.name}
                  </td>
                  <td className="py-3 px-4 text-slate-300">{req.email}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                      {req.roleRequest}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleAction(req._id, "approved")}
                      className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium text-xs border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 rounded-md hover:bg-emerald-500/20"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(req._id, "rejected")}
                      className="text-red-400 hover:text-red-300 transition-colors font-medium text-xs border border-red-500/20 bg-red-500/10 px-3 py-1.5 rounded-md hover:bg-red-500/20"
                    >
                      Reject
                    </button>
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

export default RoleRequests;
