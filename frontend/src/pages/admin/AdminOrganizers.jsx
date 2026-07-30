import { useEffect, useState } from "react";
import { FaSearch, FaCheck, FaTimes, FaShieldAlt, FaFilePdf, FaIdCard, FaBuilding, FaGlobe, FaPhone, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";

const AdminOrganizers = () => {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rejectingOrg, setRejectingOrg] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchOrganizers();
  }, []);

  const fetchOrganizers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost/EventEase/backend/api/admin_organizers.php");
      const data = await res.json();
      if (data.success) {
        setOrganizers(data.organizers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId, action, reason = "") => {
    try {
      const res = await fetch("http://localhost/EventEase/backend/api/admin_verify_organizer.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          action: action,
          rejection_reason: reason
        })
      });
      const data = await res.json();
      if (data.success) {
        setOrganizers((prev) =>
          prev.map((org) =>
            org.user_id === userId || org.id === userId
              ? {
                  ...org,
                  verification_status: data.verification_status,
                  rejection_reason: action === "reject" ? reason : null
                }
              : org
          )
        );
        alert(data.message);
        setRejectingOrg(null);
        setRejectionReason("");
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteOrganizer = async (userId, name) => {
    if (!window.confirm(`Are you sure you want to delete organizer "${name || 'this organizer'}"?`)) return;

    try {
      const res = await fetch("http://localhost/EventEase/backend/api/admin_delete_organizer.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId })
      });
      const data = await res.json();
      if (data.success) {
        setOrganizers((prev) => prev.filter((o) => o.user_id !== userId && o.id !== userId));
        alert("Organizer deleted successfully");
      } else {
        alert(data.message || "Failed to delete organizer");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOrganizers = organizers.filter(
    (org) =>
      (org.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (org.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (org.organization_name || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <FaShieldAlt className="text-purple-600" /> Organizer Verification Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">Review business credentials, inspection documents, and approve, reject, or delete organizers.</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search organizers or BRN..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-purple-600"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-purple-700 text-white text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 pl-6">Organizer & Business</th>
                <th className="p-4">BRN / NIC</th>
                <th className="p-4">Contact Details</th>
                <th className="p-4">Submitted Document</th>
                <th className="p-4">Verification Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredOrganizers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-12 text-gray-400 font-medium">
                    No organizers found.
                  </td>
                </tr>
              ) : (
                filteredOrganizers.map((org) => {
                  const status = org.verification_status || "pending";
                  const isVerified = status === "verified";
                  const isRejected = status === "rejected";
                  const targetId = org.user_id || org.id;

                  return (
                    <tr key={targetId} className="hover:bg-gray-50/80 transition">
                      <td className="p-4 pl-6">
                        <p className="font-bold text-gray-900 text-sm">{org.full_name}</p>
                        <p className="text-purple-600 font-semibold">{org.organization_name || "Personal Organizer"}</p>
                        <p className="text-gray-400 text-[11px]">{org.email}</p>
                      </td>

                      <td className="p-4">
                        <p className="font-mono text-gray-800 font-bold">BRN: {org.business_registration_number || "N/A"}</p>
                        <p className="text-gray-500 text-[11px]">NIC/Pass: {org.nic_passport || "N/A"}</p>
                      </td>

                      <td className="p-4 text-gray-600 space-y-0.5">
                        {org.phone && <p className="flex items-center gap-1"><FaPhone className="text-purple-500" /> {org.phone}</p>}
                        {org.website && <p className="flex items-center gap-1 text-purple-600 underline"><FaGlobe /> {org.website}</p>}
                      </td>

                      <td className="p-4">
                        {org.document_path ? (
                          <a
                            href={`http://localhost/EventEase/backend/uploads/${org.document_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-xl border border-purple-200 transition"
                          >
                            <FaFilePdf /> View Document
                          </a>
                        ) : (
                          <span className="text-gray-400 italic">No document</span>
                        )}
                      </td>

                      <td className="p-4">
                        {isVerified ? (
                          <span className="bg-emerald-100 text-emerald-800 font-black px-3 py-1 rounded-full uppercase tracking-wider text-[10px] inline-flex items-center gap-1">
                            <FaCheck className="text-emerald-600" /> Verified
                          </span>
                        ) : isRejected ? (
                          <span className="bg-rose-100 text-rose-800 font-black px-3 py-1 rounded-full uppercase tracking-wider text-[10px] inline-flex items-center gap-1">
                            <FaTimes className="text-rose-600" /> Rejected
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-900 font-black px-3 py-1 rounded-full uppercase tracking-wider text-[10px] animate-pulse">
                            Pending Review
                          </span>
                        )}
                      </td>

                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleVerify(targetId, "approve")}
                            disabled={isVerified}
                            className={`px-3.5 py-1.5 font-bold text-xs rounded-xl shadow transition flex items-center gap-1 ${
                              isVerified
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300 opacity-80 cursor-default"
                                : "bg-emerald-600 hover:bg-emerald-700 text-white"
                            }`}
                            title={isVerified ? "Already Verified" : "Approve & Grant Verified Badge"}
                          >
                            <FaCheck /> {isVerified ? "Verified" : "Approve"}
                          </button>

                          <button
                            onClick={() => setRejectingOrg(org)}
                            disabled={isRejected}
                            className={`px-3.5 py-1.5 font-bold text-xs rounded-xl border transition flex items-center gap-1 ${
                              isRejected
                                ? "bg-rose-100 text-rose-800 border-rose-300 opacity-80 cursor-default"
                                : "bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border-rose-200"
                            }`}
                            title={isRejected ? "Already Rejected" : "Reject Verification"}
                          >
                            <FaTimes /> {isRejected ? "Rejected" : "Reject"}
                          </button>

                          <button
                            onClick={() => handleDeleteOrganizer(targetId, org.full_name)}
                            className="p-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow transition"
                            title="Delete Organizer Account"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rejection Modal */}
      {rejectingOrg && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
            <div>
              <h3 className="text-xl font-black text-gray-900">Reject Verification</h3>
              <p className="text-xs text-gray-500 mt-1">Organizer: {rejectingOrg.full_name} ({rejectingOrg.organization_name || "N/A"})</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Reason for Rejection *</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Business registration document expired or illegible."
                className="w-full p-3.5 border rounded-2xl text-xs outline-none focus:ring-2 focus:ring-rose-500"
                rows="4"
              ></textarea>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setRejectingOrg(null)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleVerify(rejectingOrg.user_id || rejectingOrg.id, "reject", rejectionReason)}
                disabled={!rejectionReason.trim()}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow transition"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrganizers;
