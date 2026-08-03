import { useEffect, useState } from "react";
import { FaSearch, FaCheck, FaTimes, FaShieldAlt, FaFilePdf, FaEye, FaGlobe, FaPhone, FaTrash, FaBuilding, FaIdCard, FaReceipt } from "react-icons/fa";

const AdminOrganizers = () => {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedOrgModal, setSelectedOrgModal] = useState(null);
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
      (org.organization_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (org.business_registration_number || "").toLowerCase().includes(search.toLowerCase()) ||
      (org.tin_number || "").toLowerCase().includes(search.toLowerCase())
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
          <p className="text-gray-500 text-sm mt-1">Verify business registration numbers (BRN), tax TIN numbers, company details, approve or reject organizers.</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Name, BRN, TIN, or Email..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-purple-600"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-purple-700 text-white text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 pl-6">Organizer & Company</th>
                <th className="p-4">BR Number</th>
                <th className="p-4">TIN Number</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredOrganizers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-12 text-gray-400 font-medium">
                    No organizers found matching search.
                  </td>
                </tr>
              ) : (
                filteredOrganizers.map((org) => {
                  const status = (org.verification_status || "pending").toLowerCase();
                  const isApproved = status === "approved" || status === "verified";
                  const isRejected = status === "rejected";
                  const targetId = org.user_id || org.id;

                  return (
                    <tr key={targetId} className="hover:bg-gray-50/80 transition">
                      <td className="p-4 pl-6">
                        <p className="font-bold text-gray-900 text-sm">{org.full_name}</p>
                        <p className="text-purple-700 font-bold flex items-center gap-1">
                          <FaBuilding className="text-xs text-purple-500" /> {org.organization_name || "Company Details Pending"}
                        </p>
                        <p className="text-gray-400 text-[11px]">{org.email}</p>
                      </td>

                      <td className="p-4">
                        <span className="font-mono text-gray-800 font-extrabold bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">
                          {org.business_registration_number || "BR-NOT-SET"}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="font-mono text-purple-900 font-extrabold bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200 flex items-center gap-1 w-max">
                          <FaReceipt className="text-purple-600 text-[10px]" /> {org.tin_number || "TIN-NOT-SET"}
                        </span>
                      </td>

                      <td className="p-4 text-gray-600 space-y-0.5">
                        {org.phone && <p className="flex items-center gap-1 font-semibold"><FaPhone className="text-purple-500" /> {org.phone}</p>}
                        {org.address && <p className="text-gray-500 text-[11px] truncate max-w-[150px]">{org.address}</p>}
                      </td>

                      {/* VERIFICATION STATUS BADGES */}
                      <td className="p-4">
                        {isApproved ? (
                          <span className="bg-green-100 text-green-800 border border-green-300 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider text-[10px] inline-flex items-center gap-1 shadow-sm">
                            <FaCheck className="text-green-600" /> Approved
                          </span>
                        ) : isRejected ? (
                          <span className="bg-red-100 text-red-800 border border-red-300 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider text-[10px] inline-flex items-center gap-1 shadow-sm">
                            <FaTimes className="text-red-600" /> Rejected
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-800 border border-amber-300 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider text-[10px]">
                            Pending Review
                          </span>
                        )}
                      </td>

                      {/* ACTION BUTTONS */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedOrgModal(org)}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl border border-gray-300 transition flex items-center gap-1"
                            title="View Full Organizer Validity Details"
                          >
                            <FaEye className="text-purple-600" /> View
                          </button>

                          <button
                            onClick={() => handleVerify(targetId, "approve")}
                            disabled={isApproved}
                            className={`px-3 py-1.5 font-bold text-xs rounded-xl shadow transition flex items-center gap-1 ${
                              isApproved
                                ? "bg-green-100 text-green-800 border border-green-300 opacity-80 cursor-default"
                                : "bg-green-600 hover:bg-green-700 text-white"
                            }`}
                            title={isApproved ? "Already Approved" : "Approve Organizer"}
                          >
                            <FaCheck /> {isApproved ? "Approved" : "Approve"}
                          </button>

                          <button
                            onClick={() => setRejectingOrg(org)}
                            disabled={isRejected}
                            className={`px-3 py-1.5 font-bold text-xs rounded-xl border transition flex items-center gap-1 ${
                              isRejected
                                ? "bg-red-100 text-red-800 border-red-300 opacity-80 cursor-default"
                                : "bg-rose-50 hover:bg-red-600 text-red-700 hover:text-white border-red-200"
                            }`}
                            title={isRejected ? "Already Rejected" : "Reject Organizer"}
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

      {/* VIEW FULL DETAILS MODAL */}
      {selectedOrgModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-xl font-black text-gray-900">Organizer Verification Details</h3>
                <p className="text-xs text-gray-500">{selectedOrgModal.full_name}</p>
              </div>
              <button
                onClick={() => setSelectedOrgModal(null)}
                className="text-gray-400 hover:text-gray-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500 font-semibold">Company / Organization:</span>
                <span className="font-bold text-purple-900">{selectedOrgModal.organization_name || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500 font-semibold">BR Number:</span>
                <span className="font-mono font-black text-gray-800">{selectedOrgModal.business_registration_number || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500 font-semibold">TIN Number (Tax):</span>
                <span className="font-mono font-black text-purple-700">{selectedOrgModal.tin_number || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500 font-semibold">Email:</span>
                <span className="font-bold text-gray-800">{selectedOrgModal.email}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500 font-semibold">Phone:</span>
                <span className="font-bold text-gray-800">{selectedOrgModal.phone || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500 font-semibold">Address / Company Details:</span>
                <span className="font-semibold text-gray-700 text-right">{selectedOrgModal.address || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Status:</span>
                <span className={`font-black uppercase px-2.5 py-0.5 rounded-full text-[10px] ${
                  (selectedOrgModal.verification_status || '').toLowerCase() === 'approved' || (selectedOrgModal.verification_status || '').toLowerCase() === 'verified'
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : (selectedOrgModal.verification_status || '').toLowerCase() === 'rejected'
                    ? 'bg-red-100 text-red-800 border border-red-300'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {selectedOrgModal.verification_status || 'Pending'}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOrgModal(null)}
                className="px-6 py-2.5 bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs rounded-xl shadow transition"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION REASON MODAL */}
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
                placeholder="e.g. Invalid BR Number or TIN tax record format."
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
