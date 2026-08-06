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
  FiBell,
  FiSearch,
  FiZap,
  FiCheck,
  FiMail,
  FiLayers,
  FiCalendar
} from 'react-icons/fi';

export default function OrganizerAnnouncements() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('16');
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

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

  // Broadcast Audit Report State
  const [auditReport, setAuditReport] = useState(null);

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
      let res = await fetch(`http://localhost/EventEase/backend/api/my_events.php?user_id=${user.id || 2}`);
      let data = await res.json();
      let eventsList = [];

      if (data.success && Array.isArray(data.events) && data.events.length > 0) {
        eventsList = data.events;
      } else {
        // Fallback to fetch all events if specific organizer events empty
        const allRes = await fetch('http://localhost/EventEase/backend/api/events.php');
        const allData = await allRes.json();
        eventsList = allData.events || (Array.isArray(allData) ? allData : []);
      }

      setEvents(eventsList);
      if (eventsList.length > 0) {
        // Check if currently selected event exists in list, else pick first
        const exists = eventsList.some(e => String(e.id) === String(selectedEventId));
        if (!exists) {
          setSelectedEventId(String(eventsList[0].id));
        }
      }
    } catch (err) {
      console.error("Failed to load organizer events:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnouncements = async (eventId) => {
    try {
      const res = await fetch(`http://localhost/EventEase/backend/api/get_event_announcements.php?event_id=${eventId}`);
      const data = await res.json();
      if (data.status === 'success') {
        setAnnouncements(data.data || []);
      }
    } catch (err) {
      console.error("Failed to load announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyTemplate = (title, message, priority = 'normal', type = 'all_attendees') => {
    setFormData({
      title,
      message,
      priority,
      broadcast_type: type
    });
    triggerToast("Preset Template Loaded! Edit as needed and click Dispatch.");
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
        triggerToast(`Broadcast sent to ${data.delivered_count || data.sent_count} recipients!`);
        setIsModalOpen(false);
        setAuditReport(data);
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

  const selectedEvent = events.find(e => String(e.id) === String(selectedEventId));
  const totalAudienceReach = announcements.reduce((acc, a) => acc + (parseInt(a.sent_count) || 0), 0);

  const filteredAnnouncements = announcements.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const getPriorityBadge = (prio) => {
    switch (prio) {
      case 'emergency':
        return <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500 text-white shadow-sm flex items-center gap-1"><FiAlertTriangle /> EMERGENCY ALERT</span>;
      case 'urgent':
        return <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-slate-950 shadow-sm flex items-center gap-1"><FiZap /> URGENT NOTICE</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-200 flex items-center gap-1"><FiInfo /> NORMAL ANNOUNCEMENT</span>;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-5 right-5 z-50 px-6 py-3.5 rounded-2xl shadow-2xl text-white font-bold text-xs sm:text-sm flex items-center gap-2 animate-bounce ${
          toast.type === 'error' ? 'bg-rose-600' : 'bg-emerald-600'
        }`}>
          {toast.type === 'error' ? <FiXCircle className="text-lg" /> : <FiCheckCircle className="text-lg" />}
          {toast.message}
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-purple-700/50">
        <div>
          <div className="flex items-center gap-2 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <FiVolume2 className="text-amber-400 text-base" /> Real-Time Live Messaging Engine
          </div>
          <h1 className="text-xl sm:text-3xl font-black mt-1 text-white flex items-center gap-2">
            Event Announcement & Attendee Broadcast Hub
          </h1>
          <p className="text-purple-200 text-xs sm:text-sm mt-2 max-w-2xl font-medium">
            Compose and instantly dispatch push notifications, gate opening notices, parking advisories, and urgent alerts to registered event ticket holders.
          </p>
        </div>

        <button
          id="broadcast-new-announcement-btn"
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-amber-400/20 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <FiSend className="text-base" /> Broadcast New Announcement
        </button>
      </div>

      {/* Event Selector & Live Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xl md:col-span-2 flex flex-col justify-between">
          <label className="block text-xs font-black text-purple-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <FiCalendar className="text-purple-600" /> SELECT TARGET EVENT FOR BROADCAST
          </label>
          <select
            id="select-event-broadcast-dropdown"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full bg-purple-50/90 border-2 border-purple-300 rounded-2xl px-4 py-3 text-xs sm:text-sm font-extrabold text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-600 cursor-pointer shadow-sm"
          >
            {events.length === 0 ? (
              <option value="">Loading Events...</option>
            ) : (
              events.map((ev) => (
                <option key={ev.id} value={String(ev.id)}>
                  📢 #{ev.id} - {ev.title} ({ev.category || 'General'})
                </option>
              ))
            )}
          </select>
          {selectedEvent && (
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-3 font-semibold pt-3 border-t border-purple-50">
              <span>📍 Location: <strong>{selectedEvent.location || 'Main Arena'}</strong></span>
              <span>🎟️ Target Audience Reach: <strong className="text-purple-700">{selectedEvent.total_booked || 50} Attendees</strong></span>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-indigo-900 to-purple-950 text-white p-6 rounded-3xl shadow-xl border border-purple-800/40 flex flex-col justify-between">
          <div>
            <div className="text-xs text-purple-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FiUsers className="text-amber-400" /> TOTAL AUDIENCE REACH
            </div>
            <div className="text-2xl sm:text-3xl font-black mt-2 text-white">{totalAudienceReach} Recipients</div>
          </div>
          <div className="text-xs text-purple-200 font-medium mt-3 bg-white/10 p-2.5 rounded-xl border border-white/10">
            Dispatched across <strong>{announcements.length}</strong> broadcast notification campaigns
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-purple-100 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search broadcast title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-extrabold text-gray-500 uppercase">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="normal">Normal</option>
            <option value="urgent">Urgent</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>
      </div>

      {/* Announcements Timeline Feed */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
          <FiBell className="text-purple-600 text-xl" /> Dispatched Announcements Timeline ({filteredAnnouncements.length})
        </h2>

        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm font-semibold bg-white rounded-3xl border">Loading broadcast feed...</div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-300 text-center text-gray-400 text-sm space-y-2">
            <FiVolume2 className="mx-auto text-3xl text-purple-300" />
            <p className="font-bold text-gray-700">No broadcast announcements found for target event #{selectedEventId}.</p>
            <p className="text-xs text-gray-500">Click "Broadcast New Announcement" to notify event attendees!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAnnouncements.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl border border-purple-100 p-5 sm:p-6 shadow-xl space-y-4 hover:border-purple-300 transition">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    {getPriorityBadge(item.priority)}
                    <h3 className="font-black text-base text-gray-900">{item.title}</h3>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className="text-xs text-gray-400 font-mono">
                      ⏰ {new Date(item.created_at).toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleDeleteAnnouncement(item.id)}
                      className="text-gray-400 hover:text-rose-600 p-2 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                      title="Delete Announcement Log"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>

                <div className="bg-purple-50/60 p-4 sm:p-5 rounded-2xl border border-purple-100 text-xs sm:text-sm text-gray-800 leading-relaxed font-medium">
                  {item.message}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 font-semibold pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-purple-900">
                    <FiCheckCircle className="text-emerald-500" /> 
                    <span>Dispatched To: <strong className="text-purple-950 font-black">{item.sent_count || 50} Registered Recipients</strong></span>
                  </div>
                  <div className="text-[11px] text-gray-500 uppercase font-mono bg-gray-100 px-3 py-1 rounded-full">
                    Target: {item.broadcast_type ? item.broadcast_type.replace('_', ' ') : 'All Attendees'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Broadcast Announcement Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-fade-in border border-purple-100">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-purple-900 to-indigo-900 text-white">
              <div>
                <h3 className="text-lg font-extrabold flex items-center gap-2 text-white">
                  <FiVolume2 className="text-amber-400" /> Compose & Dispatch Broadcast Alert
                </h3>
                <p className="text-xs text-purple-200 mt-0.5 font-medium">Send real-time in-app & push notification messages to event ticket holders.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-purple-200 hover:text-white text-2xl transition cursor-pointer"
              >
                <FiXCircle />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="p-6 space-y-4">
              {/* Target Event Selector Inside Modal */}
              <div>
                <label className="block text-xs font-black text-purple-900 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <FiCalendar className="text-purple-600" /> Select Target Event for Message
                </label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full bg-purple-50 border border-purple-200 rounded-xl px-4 py-2.5 text-xs font-extrabold text-purple-950 focus:outline-none focus:border-purple-600 cursor-pointer"
                >
                  {events.map((ev) => (
                    <option key={ev.id} value={String(ev.id)}>
                      📢 #{ev.id} - {ev.title} ({ev.category || 'General'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Preset Quick Templates */}
              <div>
                <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <FiZap className="text-amber-500" /> Quick Preset Templates
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleApplyTemplate(
                      'URGENT: Gate Opening & Entry Advisory',
                      'Gates will open strictly at 5:00 PM. Please have your digital QR pass ready on your smartphone for fast check-in.',
                      'urgent'
                    )}
                    className="p-2.5 text-left bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl text-[11px] font-bold text-purple-900 transition cursor-pointer"
                  >
                    🚪 Gate Entry Advisory
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyTemplate(
                      'PARKING ADVISORY: VIP Lot Full',
                      'VIP Parking Lot A is currently at maximum capacity. Please proceed to Gate 2 Overflow Parking.',
                      'normal'
                    )}
                    className="p-2.5 text-left bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-[11px] font-bold text-amber-950 transition cursor-pointer"
                  >
                    🅿️ Parking Guidance
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyTemplate(
                      'SCHEDULE ADJUSTMENT: Main Stage Delay',
                      'The main performance will start 15 minutes later than scheduled. Thank you for your patience!',
                      'urgent'
                    )}
                    className="p-2.5 text-left bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl text-[11px] font-bold text-indigo-950 transition cursor-pointer"
                  >
                    ⏰ Stage Time Update
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyTemplate(
                      'EMERGENCY WEATHER ADVISORY',
                      'Light rainfall expected. Covered seating and umbrellas are provided at the central concourse.',
                      'emergency'
                    )}
                    className="p-2.5 text-left bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-[11px] font-bold text-rose-950 transition cursor-pointer"
                  >
                    🌧️ Weather Advisory
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-700 mb-1">Announcement Subject / Title</label>
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
                  <label className="block text-xs font-black uppercase text-gray-700 mb-1">Alert Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-black text-gray-900 focus:outline-none focus:border-purple-600"
                  >
                    <option value="normal">Normal Announcement</option>
                    <option value="urgent">Urgent Notice</option>
                    <option value="emergency">Emergency Alert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-700 mb-1">Target Audience</label>
                  <select
                    value={formData.broadcast_type}
                    onChange={(e) => setFormData({ ...formData, broadcast_type: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-black text-gray-900 focus:outline-none focus:border-purple-600"
                  >
                    <option value="all_attendees">All Ticket Holders</option>
                    <option value="vip_only">VIP Ticket Holders Only</option>
                    <option value="all_users">All System Customers</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-700 mb-1">Message Content</label>
                <textarea
                  rows={4}
                  placeholder="Enter detailed broadcast notice for attendees..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-purple-600"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-purple-700/20 transition cursor-pointer"
                >
                  <FiSend /> {submitting ? 'Sending Broadcast...' : 'Dispatch Broadcast Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Broadcast Audit Report Modal */}
      {auditReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-emerald-200 animate-scale-up">
            <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex justify-between items-center">
              <div>
                <span className="bg-emerald-800 text-emerald-100 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">100% DISPATCH SUCCESS</span>
                <h3 className="text-lg font-black text-white mt-1 flex items-center gap-2">
                  <FiCheckCircle className="text-amber-300" /> Broadcast Delivery Audit Report
                </h3>
              </div>
              <button onClick={() => setAuditReport(null)} className="text-emerald-100 hover:text-white text-xl cursor-pointer">
                <FiXCircle />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-medium text-gray-700">
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl space-y-1">
                <div className="font-extrabold text-emerald-950 text-sm">{auditReport.message}</div>
                <div className="text-emerald-700 font-mono text-[11px]">Timestamp: {auditReport.timestamp}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-xl border text-center">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Target Event</div>
                  <div className="font-black text-purple-950 truncate text-xs mt-0.5">{auditReport.event_title}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border text-center">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">In-App Notifications Sent</div>
                  <div className="font-black text-emerald-600 text-sm mt-0.5">{auditReport.delivered_count} Users</div>
                </div>
              </div>

              {auditReport.recipients && auditReport.recipients.length > 0 && (
                <div>
                  <div className="font-black text-gray-800 uppercase text-[11px] mb-2 flex items-center gap-1">
                    <FiMail className="text-purple-600" /> Sample Recipients Delivered To:
                  </div>
                  <div className="bg-gray-50 p-3 rounded-2xl border space-y-1.5 max-h-36 overflow-y-auto font-mono text-[11px]">
                    {auditReport.recipients.map((rec) => (
                      <div key={rec.id} className="flex justify-between items-center border-b border-gray-200/50 pb-1 last:border-none">
                        <span className="font-bold text-gray-900">{rec.name}</span>
                        <span className="text-gray-500">{rec.email}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setAuditReport(null)}
                className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                Close Audit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
