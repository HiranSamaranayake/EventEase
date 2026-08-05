import React, { useState, useEffect } from 'react';
import { 
  FiVolume2, 
  FiPlus, 
  FiTrash2, 
  FiUsers, 
  FiAlertTriangle, 
  FiSend, 
  FiCheckCircle, 
  FiXCircle,
  FiInfo,
  FiBell
} from 'react-icons/fi';

export default function OrganizerAnnouncements() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('16');
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    priority: 'normal',
    broadcast_type: 'all_attendees'
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchOrganizerEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      fetchAnnouncements(selectedEventId);
    }
  }, [selectedEventId]);

  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const fetchOrganizerEvents = async () => {
    try {
      const res = await fetch(`http://localhost/EventEase/backend/api/my_events.php?user_id=${user.id || 2}`);
      const data = await res.json();
      if (data.success && data.events) {
        const eventsData = data.events;
        setEvents(eventsData);
        if (eventsData.length > 0) {
          setSelectedEventId(prev => prev ? prev : eventsData[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load organizer events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedEventId) {
      fetchAnnouncements(selectedEventId);
    }
  }, [selectedEventId]);

  const fetchAnnouncements = async (eventId) => {
    try {
      const res = await fetch(`http://localhost/EventEase/backend/api/get_event_announcements.php?event_id=${eventId}`);
      const data = await res.json();
      if (data.status === 'success') {
        setAnnouncements(data.data || []);
      }
    } catch (err) {
      console.error("Failed to load announcements:", err);
    }
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      triggerToast("Announcement Title and Message body are required.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('http://localhost/EventEase/backend/api/create_announcement_broadcast.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: selectedEventId,
          organizer_id: user.id || 2,
          ...formData
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        triggerToast(`Broadcast sent to ${data.sent_count} attendees!`);
        setIsModalOpen(false);
        setFormData({
          title: '',
          message: '',
          priority: 'normal',
          broadcast_type: 'all_attendees'
        });
        fetchAnnouncements(selectedEventId);
      } else {
        triggerToast(data.message || 'Broadcast failed.', 'error');
      }
    } catch (err) {
      triggerToast('Error sending broadcast.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm("Are you sure you want to delete this broadcast log?")) return;

    try {
      const res = await fetch('http://localhost/EventEase/backend/api/delete_announcement.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.status === 'success') {
        triggerToast("Announcement log deleted.");
        fetchAnnouncements(selectedEventId);
      }
    } catch (err) {
      triggerToast("Failed to delete announcement.", "error");
    }
  };

  const selectedEvent = events.find(e => parseInt(e.id) === parseInt(selectedEventId));
  const totalAudienceReach = announcements.reduce((acc, a) => acc + intval(a.sent_count || 0), 0);

  function intval(val) { return parseInt(val) || 0; }

  const getPriorityBadge = (prio) => {
    switch (prio) {
      case 'emergency':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300">EMERGENCY ALERT</span>;
      case 'urgent':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">URGENT NOTICE</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">NORMAL ANNOUNCEMENT</span>;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Toast */}
      {toast.show && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-xl text-white font-medium flex items-center gap-2 ${
          toast.type === 'error' ? 'bg-rose-600' : 'bg-emerald-600'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-purple-100 shadow-xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <FiVolume2 className="text-purple-600" /> Event Announcement & Attendee Broadcast Hub
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Compose and dispatch urgent broadcast alerts, parking advisories, and time changes to registered attendees.
          </p>
        </div>

        <button
          id="broadcast-new-announcement-btn"
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-700/20 transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <FiSend /> Broadcast New Announcement
        </button>
      </div>

      {/* Event Selector & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-md md:col-span-2 flex flex-col justify-between">
          <label className="block text-xs font-extrabold text-gray-500 uppercase mb-2">Select Event to Broadcast To</label>
          <select
            id="select-event-broadcast-dropdown"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full bg-purple-50 border border-purple-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-purple-950 focus:outline-none focus:border-purple-600"
          >
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                📢 #{ev.id} - {ev.title} ({ev.category || 'General'})
              </option>
            ))}
          </select>
          {selectedEvent && (
            <p className="text-xs text-gray-400 mt-2 font-medium">Location: {selectedEvent.location || 'Colombo Main Arena'} | Total Booked: {selectedEvent.total_booked || 2} Attendees</p>
          )}
        </div>

        <div className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white p-5 rounded-2xl shadow-md flex flex-col justify-between">
          <div>
            <div className="text-xs text-purple-200 font-bold uppercase">Total Attendees Reached</div>
            <div className="text-2xl sm:text-3xl font-black mt-1">{totalAudienceReach} Recipients</div>
          </div>
          <div className="text-[11px] text-purple-300 font-medium mt-2">
            Across {announcements.length} Dispatched Broadcast Alerts
          </div>
        </div>
      </div>

      {/* Announcements Timeline Feed */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <FiBell className="text-purple-600" /> Dispatched Announcements Timeline ({announcements.length})
        </h2>

        {loading ? (
          <div className="p-10 text-center text-gray-400 text-sm">Loading broadcast feed...</div>
        ) : announcements.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border border-dashed border-gray-300 text-center text-gray-400 text-sm">
            No broadcast announcements sent for this event yet. Click "Broadcast New Announcement" to notify attendees!
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl border border-purple-100 p-5 sm:p-6 shadow-xl space-y-3 hover:border-purple-300 transition">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-3">
                    {getPriorityBadge(item.priority)}
                    <h3 className="font-extrabold text-base text-gray-900">{item.title}</h3>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className="text-xs text-gray-400 font-mono">
                      ⏰ {new Date(item.created_at).toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleDeleteAnnouncement(item.id)}
                      className="text-gray-400 hover:text-rose-600 p-1.5 rounded-lg transition"
                      title="Delete Announcement Log"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-purple-50/50 p-4 rounded-2xl border border-purple-100 font-medium">
                  {item.message}
                </p>

                <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 font-semibold pt-1 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-purple-900">
                    <FiUsers className="text-purple-600" /> Target Reach: <strong>{item.sent_count || 50} Attendees</strong>
                  </div>
                  <div className="text-[11px] text-gray-400 uppercase font-mono">
                    Target: {item.broadcast_type ? item.broadcast_type.replace('_', ' ') : 'All Attendees'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Broadcast Announcement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                  <FiVolume2 className="text-purple-600" /> Compose Broadcast Announcement
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Send instant push & in-app alerts to event ticket holders.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                <FiXCircle />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase text-gray-700 mb-1">Announcement Subject / Title</label>
                <input
                  type="text"
                  placeholder="e.g. URGENT: Gate Opening & Gate 2 Entry Advisory"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-purple-600"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-gray-700 mb-1">Alert Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-extrabold text-gray-900 focus:outline-none focus:border-purple-600"
                  >
                    <option value="normal">Normal Announcement</option>
                    <option value="urgent">Urgent Notice</option>
                    <option value="emergency">Emergency Alert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase text-gray-700 mb-1">Target Audience</label>
                  <select
                    value={formData.broadcast_type}
                    onChange={(e) => setFormData({ ...formData, broadcast_type: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-extrabold text-gray-900 focus:outline-none focus:border-purple-600"
                  >
                    <option value="all_attendees">All Ticket Holders</option>
                    <option value="vip_only">VIP Ticket Holders Only</option>
                    <option value="waiting_list">Waiting List Queue</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-gray-700 mb-1">Message Content</label>
                <textarea
                  rows={4}
                  placeholder="Enter detailed notice for attendees (e.g. Weather updates, parking gates, schedule adjustments)..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 text-xs font-medium text-gray-800 focus:outline-none focus:border-purple-600"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-purple-700/20 cursor-pointer"
                >
                  <FiSend /> {submitting ? 'Sending...' : 'Dispatch Broadcast'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
