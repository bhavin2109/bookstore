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
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Role Requests</h2>

      {requests.length === 0 ? (
        <div className="bg-slate-900/50 border border-white/5 rounded-lg p-8 text-center text-slate-400">
          No pending role requests found.
        </div>
      ) : (
        <div className="bg-slate-900 border border-white/10 rounded-lg overflow-hidden">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-950 text-slate-200 uppercase font-medium">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Requested Role</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {requests.map((req) => (
                <tr
                  key={req._id}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-white">
                    {req.name}
                  </td>
                  <td className="px-6 py-4">{req.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                      {req.roleRequest}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
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
