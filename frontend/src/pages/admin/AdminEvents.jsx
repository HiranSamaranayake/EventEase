import { useEffect, useState } from "react";
import { FaSearch, FaTrash, FaCheck, FaTimes, FaEye, FaSync, FaCalendarAlt, FaMapMarkerAlt, FaLayerGroup, FaUsers, FaTag } from "react-icons/fa";

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadEvents = () => {
    setLoading(true);
    fetch("http://localhost/EventEase/backend/api/admin_events.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEvents(data.events);
        }
        setLoading(false);
      })
      .catch(() => {
        alert("Cannot load events");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const deleteEvent = (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    setActionLoading(true);
    fetch("http://localhost/EventEase/backend/api/admin_delete_event.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Event deleted successfully");
          loadEvents();
        } else {
          alert(data.message);
        }
        setActionLoading(false);
      });
  };

  const updateStatus = (id, status) => {
    setActionLoading(true);
    fetch("http://localhost/EventEase/backend/api/admin_event_status.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
        status: status,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert(`Event ${status} successfully!`);
          loadEvents();
        } else {
          alert(data.message);
        }
        setActionLoading(false);
      });
  };

  const viewEvent = (event) => {
    setSelectedEvent(event);
  };

  const filteredEvents = events.filter((event) => {
    const matchSearch =
      (event.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (event.location || "").toLowerCase().includes(search.toLowerCase()) ||
      (event.category || "").toLowerCase().includes(search.toLowerCase());

    const status = (event.status || "pending").toLowerCase();
    const matchStatus = filter === "all" ? true : status === filter;

    return matchSearch && matchStatus;
  });

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
            <FaLayerGroup className="text-purple-600" /> Event Approval & Decision Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">Review organizer event submissions, view details, approve, reject, or delete events.</p>
        </div>

        <button
          onClick={loadEvents}
          className="px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2"
        >
          <FaSync /> Refresh List
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          <input
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-purple-600"
            placeholder="Search event title, venue location, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold bg-white outline-none focus:border-purple-600"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending Review</option>
          <option value="approved">Approved Events</option>
          <option value="rejected">Rejected Events</option>
        </select>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-purple-700 text-white text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 pl-6">ID</th>
                <th className="p-4">Event Details</th>
                <th className="p-4">Organizer</th>
                <th className="p-4">Date & Venue</th>
                <th className="p-4">Decision Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-12 text-gray-400 font-medium">
                    No events found.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => {
                  const status = (event.status || "pending").toLowerCase();
                  const isApproved = status === "approved";
                  const isRejected = status === "rejected";

                  return (
                    <tr key={event.id} className="hover:bg-gray-50/80 transition">
                      <td className="p-4 pl-6 font-mono font-bold text-gray-400">#{event.id}</td>

                      <td className="p-4">
                        <p className="font-bold text-gray-900 text-sm">{event.title}</p>
                        <span className="bg-purple-100 text-purple-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                          {event.category || "General"}
                        </span>
                      </td>

                      <td className="p-4 text-gray-700 font-semibold">{event.organizer || "Organizer"}</td>

                      <td className="p-4 text-gray-600 space-y-0.5">
                        <p className="flex items-center gap-1 font-semibold"><FaCalendarAlt className="text-purple-500" /> {event.event_date}</p>
                        <p className="flex items-center gap-1 text-gray-500 text-[11px]"><FaMapMarkerAlt className="text-gray-400" /> {event.location}</p>
                      </td>

                      {/* GREEN FOR APPROVED, RED FOR REJECTED BADGES */}
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

                      {/* ACTION BUTTONS: VIEW, APPROVE, REJECT, DELETE */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => viewEvent(event)}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1"
                            title="View Full Event Details"
                          >
                            <FaEye /> View
                          </button>

                          <button
                            disabled={actionLoading || isApproved}
                            onClick={() => updateStatus(event.id, "approved")}
                            className={`px-3 py-1.5 font-bold text-xs rounded-xl shadow transition flex items-center gap-1 ${
                              isApproved
                                ? "bg-green-100 text-green-800 border border-green-300 opacity-80 cursor-default"
                                : "bg-green-600 hover:bg-green-700 text-white"
                            }`}
                            title={isApproved ? "Already Approved" : "Approve Event"}
                          >
                            <FaCheck /> {isApproved ? "Approved" : "Approve"}
                          </button>

                          <button
                            disabled={actionLoading || isRejected}
                            onClick={() => updateStatus(event.id, "rejected")}
                            className={`px-3 py-1.5 font-bold text-xs rounded-xl border transition flex items-center gap-1 ${
                              isRejected
                                ? "bg-red-100 text-red-800 border-red-300 opacity-80 cursor-default"
                                : "bg-rose-50 hover:bg-red-600 text-red-700 hover:text-white border-red-200"
                            }`}
                            title={isRejected ? "Already Rejected" : "Reject Event"}
                          >
                            <FaTimes /> {isRejected ? "Rejected" : "Reject"}
                          </button>

                          <button
                            disabled={actionLoading}
                            onClick={() => deleteEvent(event.id)}
                            className="p-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow transition"
                            title="Delete Event"
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

      {/* EVENT DETAILS MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-xl font-black text-gray-900">{selectedEvent.title}</h3>
                <p className="text-xs text-gray-500">Category: {selectedEvent.category || "General"}</p>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-gray-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500 font-semibold">Organizer:</span>
                <span className="font-bold text-purple-900">{selectedEvent.organizer || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500 font-semibold">Event Date:</span>
                <span className="font-bold text-gray-800">{selectedEvent.event_date}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500 font-semibold">Venue Location:</span>
                <span className="font-bold text-gray-800">{selectedEvent.location}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500 font-semibold">Maximum Capacity:</span>
                <span className="font-bold text-gray-800">{selectedEvent.capacity || "N/A"} Seats</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500 font-semibold">Base Price:</span>
                <span className="font-black text-emerald-600">LKR {parseFloat(selectedEvent.price || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500 font-semibold">Decision Status:</span>
                <span className={`font-black uppercase px-2.5 py-0.5 rounded-full text-[10px] ${
                  (selectedEvent.status || '').toLowerCase() === 'approved'
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : (selectedEvent.status || '').toLowerCase() === 'rejected'
                    ? 'bg-red-100 text-red-800 border border-red-300'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {selectedEvent.status || 'Pending'}
                </span>
              </div>

              {selectedEvent.description && (
                <div className="pt-2">
                  <span className="text-gray-500 font-bold block mb-1">Description:</span>
                  <p className="bg-gray-50 p-3 rounded-xl border text-gray-700 text-[11px] leading-relaxed">
                    {selectedEvent.description}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-6 py-2.5 bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs rounded-xl shadow transition"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
