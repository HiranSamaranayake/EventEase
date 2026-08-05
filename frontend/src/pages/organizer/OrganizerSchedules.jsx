import React, { useState, useEffect } from 'react';
import { 
  FiClock, 
  FiPlusCircle, 
  FiCalendar, 
  FiMapPin, 
  FiUser, 
  FiEdit, 
  FiTrash2, 
  FiCheckCircle, 
  FiPlay, 
  FiXCircle,
  FiList
} from 'react-icons/fi';

export default function OrganizerSchedules() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingSchedules, setLoadingSchedules] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const [formData, setFormData] = useState({
    session_title: '',
    start_time: '',
    end_time: '',
    hall_stage: '',
    speaker_performer: '',
    description: '',
    status: 'scheduled'
  });

  useEffect(() => {
    fetchMyEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      fetchEventSchedules(selectedEventId);
    } else {
      setSchedules([]);
    }
  }, [selectedEventId]);

  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const fetchMyEvents = async () => {
    setLoadingEvents(true);
    try {
      const res = await fetch(`http://localhost/EventEase/backend/api/my_events.php?user_id=${user.id || 2}`);
      const data = await res.json();
      let eventList = [];
      if (Array.isArray(data)) {
        eventList = data;
      } else if (data && data.events && Array.isArray(data.events)) {
        eventList = data.events;
      }
      
      // Fallback to general events if organizer has 0 events assigned
      if (eventList.length === 0) {
        const allRes = await fetch(`http://localhost/EventEase/backend/api/events.php`);
        const allData = await allRes.json();
        if (allData && allData.events) {
          eventList = allData.events;
        } else if (Array.isArray(allData)) {
          eventList = allData;
        }
      }

      setEvents(eventList);
      if (eventList.length > 0) {
        setSelectedEventId(eventList[0].id);
      }
    } catch (err) {
      console.error("Failed to load organizer events:", err);
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchEventSchedules = async (eventId) => {
    setLoadingSchedules(true);
    try {
      const res = await fetch(`http://localhost/EventEase/backend/api/get_event_schedules.php?event_id=${eventId}`);
      const data = await res.json();
      if (data.status === 'success') {
        setSchedules(data.data || []);
      }
    } catch (err) {
      console.error("Failed to load event schedules:", err);
    } finally {
      setLoadingSchedules(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingSchedule(null);
    setFormData({
      session_title: '',
      start_time: '',
      end_time: '',
      hall_stage: '',
      speaker_performer: '',
      description: '',
      status: 'scheduled'
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingSchedule(item);
    setFormData({
      session_title: item.session_title || '',
      start_time: item.start_time ? item.start_time.replace(' ', 'T').slice(0, 16) : '',
      end_time: item.end_time ? item.end_time.replace(' ', 'T').slice(0, 16) : '',
      hall_stage: item.hall_stage || '',
      speaker_performer: item.speaker_performer || '',
      description: item.description || '',
      status: item.status || 'scheduled'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.session_title || !formData.start_time || !formData.end_time) {
      triggerToast('Session Title, Start Time, and End Time are required.', 'error');
      return;
    }

    setSubmitting(true);
    const endpoint = editingSchedule 
      ? 'http://localhost/EventEase/backend/api/update_event_schedule.php'
      : 'http://localhost/EventEase/backend/api/create_event_schedule.php';

    const payload = editingSchedule
      ? { ...formData, schedule_id: editingSchedule.id }
      : { ...formData, event_id: selectedEventId };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.status === 'success') {
        triggerToast(editingSchedule ? 'Schedule session updated!' : 'New schedule session added!');
        setShowModal(false);
        fetchEventSchedules(selectedEventId);
      } else {
        triggerToast(data.message || 'Operation failed', 'error');
      }
    } catch (err) {
      triggerToast('Error saving schedule session.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (scheduleId) => {
    if (!window.confirm("Are you sure you want to delete this schedule session?")) return;

    try {
      const res = await fetch('http://localhost/EventEase/backend/api/delete_event_schedule.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schedule_id: scheduleId })
      });
      const data = await res.json();
      if (data.status === 'success') {
        triggerToast('Schedule session deleted.');
        fetchEventSchedules(selectedEventId);
      } else {
        triggerToast(data.message || 'Delete failed', 'error');
      }
    } catch (err) {
      triggerToast('Error deleting session.', 'error');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'live':
        return <span className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold rounded-full flex items-center gap-1"><FiPlay className="animate-pulse" /> LIVE NOW</span>;
      case 'completed':
        return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold rounded-full flex items-center gap-1"><FiCheckCircle /> Completed</span>;
      case 'cancelled':
        return <span className="px-3 py-1 bg-gray-500/10 text-gray-400 border border-gray-500/20 text-xs font-semibold rounded-full flex items-center gap-1">Cancelled</span>;
      default:
        return <span className="px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold rounded-full flex items-center gap-1"><FiClock /> Scheduled</span>;
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 bg-slate-950 min-h-screen text-white">
      {/* Toast */}
      {toast.show && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-xl text-white font-medium flex items-center gap-2 ${
          toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
            <FiClock className="text-purple-400" /> Multi-Session Event Schedule Manager
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Organize multi-slot session timetables, manage stages, speakers/performers, and live event statuses.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          disabled={!selectedEventId}
          className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition shadow-lg shadow-purple-500/20 flex items-center gap-2"
        >
          <FiPlusCircle /> Add Schedule Session
        </button>
      </div>

      {/* Select Event */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
        <label className="block text-xs font-bold uppercase text-purple-400 tracking-wider">Select Event to Manage Schedules</label>
        {loadingEvents ? (
          <div className="text-sm text-slate-400">Loading your events...</div>
        ) : events.length === 0 ? (
          <div className="text-sm text-slate-400">No events found. Please create an event first.</div>
        ) : (
          <select
            id="select-event-schedule-dropdown"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full md:w-1/2 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-semibold text-sm focus:outline-none focus:border-purple-500"
          >
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.title} ({ev.event_date})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Schedule Sessions Timeline */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FiList className="text-indigo-400" /> Event Session Timetable ({schedules.length})
        </h2>

        {loadingSchedules ? (
          <div className="p-12 text-center text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800">
            Loading session schedules...
          </div>
        ) : schedules.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800/80">
            <FiClock className="mx-auto text-4xl text-slate-600 mb-3" />
            <h3 className="text-lg font-semibold text-slate-300">No Sessions Added to Schedule Yet</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mt-1">
              Click 'Add Schedule Session' to build the timetable timeline for this event.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {schedules.map((item) => (
              <div key={item.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    {getStatusBadge(item.status)}
                    {item.hall_stage && (
                      <span className="text-xs text-purple-400 font-semibold flex items-center gap-1 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                        <FiMapPin /> {item.hall_stage}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white">{item.session_title}</h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-slate-300 font-mono">
                      <FiClock className="text-indigo-400" /> {new Date(item.start_time).toLocaleString()} &rarr; {new Date(item.end_time).toLocaleTimeString()}
                    </span>
                    {item.speaker_performer && (
                      <span className="flex items-center gap-1 text-purple-300">
                        <FiUser /> {item.speaker_performer}
                      </span>
                    )}
                  </div>

                  {item.description && (
                    <p className="text-sm text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60 mt-2">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-xl flex items-center gap-1.5 transition border border-slate-700"
                  >
                    <FiEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3.5 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-medium text-xs rounded-xl flex items-center gap-1.5 transition border border-red-500/30"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Session Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FiClock className="text-purple-400" /> {editingSchedule ? 'Edit Schedule Session' : 'Add New Schedule Session'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-xl"
              >
                <FiXCircle />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Session Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Opening Concert Keynote & Welcome Performance"
                  value={formData.session_title}
                  onChange={(e) => setFormData({ ...formData, session_title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Start Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">End Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Stage / Hall Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Main Auditorium Stage A"
                    value={formData.hall_stage}
                    onChange={(e) => setFormData({ ...formData, hall_stage: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Speaker / Performer Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Mariens Band / Dr. Perera"
                    value={formData.speaker_performer}
                    onChange={(e) => setFormData({ ...formData, speaker_performer: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Session Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 text-sm"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="live">Live Now</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Session Notes / Description</label>
                <textarea
                  rows={3}
                  placeholder="Additional details for attendees regarding this session..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 text-sm"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-purple-500/20"
                >
                  {submitting ? 'Saving Session...' : (editingSchedule ? 'Save Changes' : 'Create Session')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
