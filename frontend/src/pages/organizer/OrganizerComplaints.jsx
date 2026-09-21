import React, { useState, useEffect } from "react";
import {
  FaHeadset,
  FaSearch,
  FaFilter,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaReply,
  FaSpinner,
  FaExclamationCircle,
  FaTimes
} from "react-icons/fa";

const OrganizerComplaints = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({ total: 0, open: 0, in_progress: 0, resolved: 0, dismissed: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [responseMsg, setResponseMsg] = useState("");
  const [newStatus, setNewStatus] = useState("resolved");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, text: "", type: "success" });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const triggerToast = (text, type = "success") => {
    setToast({ show: true, text, type });
    setTimeout(() => setToast({ show: false, text: "", type: "success" }), 4000);
  };

  const fetchComplaints = async () => {
    if (!user.id) return;
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost/EventEase/backend/api/get_organizer_complaints.php?organizer_id=${user.id}`
      );
      const data = await res.json();
      if (data.status === "success") {
        setComplaints(data.data || []);
        setStats(data.stats || { total: 0, open: 0, in_progress: 0, resolved: 0, dismissed: 0 });
      }
    } catch (err) {
      console.error("Error loading complaints:", err);
      triggerToast("Failed to fetch complaints list", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setSubmitting(true);
    try {
      const res = await fetch(
        "http://localhost/EventEase/backend/api/organizer_resolve_complaint.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            complaint_id: selectedComplaint.id,
            organizer_id: user.id,
            status: newStatus,
            response_message: responseMsg
          })
        }
      );
      const data = await res.json();
      if (data.status === "success") {
        triggerToast("Complaint status updated and customer notified!");
        setSelectedComplaint(null);
        setResponseMsg("");
        fetchComplaints();
      } else {
        triggerToast(data.message || "Failed to update complaint", "error");
      }
    } catch (err) {
      triggerToast("Error updating complaint response", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredComplaints = complaints.filter((item) => {
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const term = search.toLowerCase();
    const matchesSearch =
      (item.subject && item.subject.toLowerCase().includes(term)) ||
      (item.user_name && item.user_name.toLowerCase().includes(term)) ||
      (item.event_title && item.event_title.toLowerCase().includes(term)) ||
      (item.description && item.description.toLowerCase().includes(term));
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "resolved":
        return (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-full flex items-center gap-1">
            <FaCheckCircle className="text-emerald-600" /> Resolved
          </span>
        );
      case "in_progress":
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold rounded-full flex items-center gap-1">
            <FaClock className="text-blue-600" /> In Progress
          </span>
        );
      case "dismissed":
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 border border-gray-300 text-xs font-bold rounded-full">
            Dismissed
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold rounded-full flex items-center gap-1">
            <FaExclamationTriangle className="text-amber-600" /> Open Ticket
          </span>
        );
    }
  };

  const getPriorityBadge = (priority, isPriority) => {
    if (isPriority || priority === "urgent") {
      return (
        <span className="bg-rose-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-sm animate-pulse">
          VIP Urgent
        </span>
      );
    }
    if (priority === "high") {
      return (
        <span className="bg-orange-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full">
          High
        </span>
      );
    }
    if (priority === "medium") {
      return (
        <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded">
          Medium
        </span>
      );
    }
    return (
      <span className="bg-slate-100 text-slate-600 text-[10px] font-bold uppercase px-2 py-0.5 rounded">
        Low
      </span>
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Toast Alert */}
      {toast.show && (
        <div
          className={`fixed top-5 right-5 z-50 px-6 py-3.5 rounded-2xl shadow-2xl text-white font-bold flex items-center gap-3 ${
            toast.type === "error" ? "bg-rose-600" : "bg-emerald-600"
          }`}
        >
          {toast.text}
        </div>
      )}

      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3">
            <FaHeadset className="text-purple-400" /> Customer Support & Complaints
          </h1>
          <p className="text-purple-200 text-sm mt-1">
            Review attendee inquiries, ticket issues, logistics feedback, and resolve complaints directly.
          </p>
        </div>

        <button
          onClick={fetchComplaints}
          className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-xs font-bold transition flex items-center gap-2"
        >
          Refresh Feed
        </button>
      </div>

      {/* SUMMARY STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div
          onClick={() => setStatusFilter("all")}
          className={`p-6 rounded-3xl border transition cursor-pointer shadow-md ${
            statusFilter === "all" ? "bg-purple-900 text-white border-purple-700" : "bg-white border-gray-200 hover:shadow-lg"
          }`}
        >
          <p className="text-xs font-bold uppercase tracking-wider opacity-80">Total Complaints</p>
          <h3 className="text-3xl font-black mt-2">{stats.total}</h3>
        </div>

        <div
          onClick={() => setStatusFilter("open")}
          className={`p-6 rounded-3xl border transition cursor-pointer shadow-md ${
            statusFilter === "open" ? "bg-amber-600 text-white border-amber-500" : "bg-white border-gray-200 hover:shadow-lg"
          }`}
        >
          <p className="text-xs font-bold uppercase tracking-wider opacity-80 text-amber-700">Open Complaints</p>
          <h3 className="text-3xl font-black mt-2 text-amber-900">{stats.open}</h3>
        </div>

        <div
          onClick={() => setStatusFilter("in_progress")}
          className={`p-6 rounded-3xl border transition cursor-pointer shadow-md ${
            statusFilter === "in_progress" ? "bg-blue-600 text-white border-blue-500" : "bg-white border-gray-200 hover:shadow-lg"
          }`}
        >
          <p className="text-xs font-bold uppercase tracking-wider opacity-80 text-blue-700">In Progress</p>
          <h3 className="text-3xl font-black mt-2 text-blue-900">{stats.in_progress}</h3>
        </div>

        <div
          onClick={() => setStatusFilter("resolved")}
          className={`p-6 rounded-3xl border transition cursor-pointer shadow-md ${
            statusFilter === "resolved" ? "bg-emerald-600 text-white border-emerald-500" : "bg-white border-gray-200 hover:shadow-lg"
          }`}
        >
          <p className="text-xs font-bold uppercase tracking-wider opacity-80 text-emerald-700">Resolved</p>
          <h3 className="text-3xl font-black mt-2 text-emerald-900">{stats.resolved}</h3>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-md flex flex-col md:flex-row justify-between gap-4 items-center">
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer, subject, or event..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <span className="text-xs font-bold text-gray-500 flex items-center gap-1 shrink-0">
            <FaFilter /> Filter:
          </span>
          {["all", "open", "in_progress", "resolved", "dismissed"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition shrink-0 ${
                statusFilter === st
                  ? "bg-purple-700 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* COMPLAINTS LIST TABLE / CARDS */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-gray-500 font-bold flex flex-col items-center justify-center gap-3">
            <FaSpinner className="animate-spin text-3xl text-purple-600" />
            <span>Loading attendee support complaints...</span>
          </div>
        ) : filteredComplaints.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredComplaints.map((item) => (
              <div
                key={item.id}
                className="p-6 hover:bg-purple-50/50 transition flex flex-col md:flex-row justify-between gap-6 items-start md:items-center"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-xs text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                      #{item.id}
                    </span>
                    {getPriorityBadge(item.priority, item.is_priority)}
                    {getStatusBadge(item.status)}
                    <span className="text-xs text-gray-400 flex items-center gap-1 ml-auto md:ml-0">
                      <FaCalendarAlt /> {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-gray-900">{item.subject}</h3>

                  <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1">
                    <span className="flex items-center gap-1 font-semibold text-gray-800">
                      <FaUser className="text-purple-600" /> {item.user_name || "Customer #" + item.user_id}
                    </span>
                    {item.user_email && (
                      <span className="flex items-center gap-1">
                        <FaEnvelope className="text-blue-500" /> {item.user_email}
                      </span>
                    )}
                    {item.event_title && (
                      <span className="bg-slate-100 text-slate-800 font-bold px-2.5 py-0.5 rounded-md">
                        Event: {item.event_title}
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-3 w-full md:w-auto justify-end">
                  <button
                    onClick={() => {
                      setSelectedComplaint(item);
                      setResponseMsg(item.admin_response || "");
                      setNewStatus(item.status === "open" ? "resolved" : item.status);
                    }}
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-2xl transition shadow-md flex items-center gap-2"
                  >
                    <FaReply /> Respond / Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center text-gray-500 font-semibold space-y-2">
            <FaCheckCircle className="text-5xl text-emerald-400 mx-auto" />
            <h4 className="text-lg font-bold text-gray-800">No complaints found</h4>
            <p className="text-sm">There are no customer complaints matching your selected criteria.</p>
          </div>
        )}
      </div>

      {/* MANAGEMENT / RESPONSE MODAL */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6 animate-scale-up my-8">
            <div className="flex justify-between items-start border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                    Ticket #{selectedComplaint.id}
                  </span>
                  {getPriorityBadge(selectedComplaint.priority, selectedComplaint.is_priority)}
                  {getStatusBadge(selectedComplaint.status)}
                </div>
                <h2 className="text-xl font-black text-gray-900">{selectedComplaint.subject}</h2>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-gray-400 hover:text-gray-600 text-xl p-1"
              >
                <FaTimes />
              </button>
            </div>

            {/* Customer Details & Complaint Text */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between text-xs text-gray-600 border-b border-gray-200 pb-3 gap-2">
                <div>
                  <span className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                    <FaUser className="text-purple-600" /> {selectedComplaint.user_name || "Customer #" + selectedComplaint.user_id}
                  </span>
                  {selectedComplaint.user_email && (
                    <p className="text-gray-500 mt-0.5">{selectedComplaint.user_email}</p>
                  )}
                </div>
                {selectedComplaint.event_title && (
                  <span className="bg-purple-100 text-purple-800 font-bold px-3 py-1 rounded-full text-xs">
                    📅 {selectedComplaint.event_title}
                  </span>
                )}
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Complaint Details</p>
                <p className="text-sm text-gray-800 leading-relaxed font-medium whitespace-pre-wrap">
                  {selectedComplaint.description}
                </p>
              </div>
            </div>

            {/* Response Form */}
            <form onSubmit={handleResolveSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Update Ticket Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="in_progress">🔵 Mark as In Progress</option>
                  <option value="resolved">🟢 Mark as Resolved</option>
                  <option value="dismissed">⚪ Mark as Dismissed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Organizer Response Note to Customer *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide an official response or update to the attendee regarding their complaint..."
                  value={responseMsg}
                  onChange={(e) => setResponseMsg(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-medium text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-2xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-2xl transition shadow-lg flex items-center gap-2"
                >
                  {submitting ? <FaSpinner className="animate-spin" /> : <FaReply />}
                  {submitting ? "Sending Response..." : "Submit Response & Notify Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerComplaints;
