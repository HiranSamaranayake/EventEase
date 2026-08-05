import React, { useState, useEffect } from 'react';
import { 
  FiHelpCircle, 
  FiPlusCircle, 
  FiCheckCircle, 
  FiClock, 
  FiAlertTriangle, 
  FiMessageSquare, 
  FiSend,
  FiRefreshCw
} from 'react-icons/fi';

export default function SupportComplaints() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const [formData, setFormData] = useState({
    subject: '',
    category: 'booking_issue',
    priority: 'medium',
    event_id: '',
    description: ''
  });

  useEffect(() => {
    fetchMyComplaints();
    fetchEvents();
  }, []);

  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const fetchMyComplaints = async () => {
    if (!user.id) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost/EventEase/backend/api/get_my_complaints.php?user_id=${user.id}`);
      const data = await res.json();
      if (data.status === 'success') {
        setComplaints(data.data || []);
      }
    } catch (err) {
      console.error("Failed to load complaints:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch('http://localhost/EventEase/backend/api/events.php');
      const data = await res.json();
      if (Array.isArray(data)) {
        setEvents(data);
      }
    } catch (err) {
      console.error("Failed to load events list", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.description.trim()) {
      triggerToast('Please provide a subject and detailed description.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('http://localhost/EventEase/backend/api/submit_complaint.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          subject: formData.subject,
          category: formData.category,
          priority: formData.priority,
          event_id: formData.event_id || null,
          description: formData.description
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        triggerToast('Support ticket submitted successfully! Our team will review it shortly.');
        setFormData({ subject: '', category: 'booking_issue', priority: 'medium', event_id: '', description: '' });
        setShowForm(false);
        fetchMyComplaints();
      } else {
        triggerToast(data.message || 'Failed to submit complaint', 'error');
      }
    } catch (err) {
      triggerToast('Error submitting support ticket.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'resolved':
        return <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-semibold rounded-full flex items-center gap-1"><FiCheckCircle /> Resolved</span>;
      case 'in_progress':
        return <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold rounded-full flex items-center gap-1"><FiClock /> In Progress</span>;
      case 'dismissed':
        return <span className="px-3 py-1 bg-gray-500/10 text-gray-400 border border-gray-500/20 text-xs font-semibold rounded-full flex items-center gap-1">Dismissed</span>;
      default:
        return <span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-xs font-semibold rounded-full flex items-center gap-1"><FiAlertTriangle /> Open Ticket</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'urgent':
        return <span className="text-red-400 font-bold text-xs uppercase px-2 py-0.5 bg-red-500/10 rounded">Urgent</span>;
      case 'high':
        return <span className="text-orange-400 font-semibold text-xs uppercase px-2 py-0.5 bg-orange-500/10 rounded">High</span>;
      case 'medium':
        return <span className="text-yellow-400 font-medium text-xs uppercase px-2 py-0.5 bg-yellow-500/10 rounded">Medium</span>;
      default:
        return <span className="text-gray-400 text-xs uppercase px-2 py-0.5 bg-gray-500/10 rounded">Low</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      {/* Toast */}
      {toast.show && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-xl text-white font-medium flex items-center gap-2 ${
          toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
        }`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-6xl mx-mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-md">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              <FiHelpCircle className="text-blue-400" /> Support & Complaints Desk
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Submit issues regarding ticket bookings, payment disputes, or event logistics. Our Support Team is here to help.
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-500/20 flex items-center gap-2"
          >
            <FiPlusCircle /> {showForm ? 'Close Form' : 'Lodge New Ticket'}
          </button>
        </div>

        {/* Submit Complaint Form */}
        {showForm && (
          <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl shadow-2xl animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FiMessageSquare className="text-blue-400" /> Lodge a Support Ticket
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Subject Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Seat reservation issue for Concert"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="booking_issue">🎟️ Booking & Ticket Issue</option>
                    <option value="payment_dispute">💳 Payment & Refund Dispute</option>
                    <option value="event_cancellation">❌ Event Cancellation</option>
                    <option value="organizer_conduct">🏢 Organizer Conduct</option>
                    <option value="technical_issue">⚙️ Technical Bug</option>
                    <option value="other">💬 Other Inquiry</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Related Event (Optional)</label>
                  <select
                    value={formData.event_id}
                    onChange={(e) => setFormData({ ...formData, event_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">-- Select Event (if applicable) --</option>
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id}>{ev.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Urgency Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="low">Low (General Query)</option>
                    <option value="medium">Medium (Standard Issue)</option>
                    <option value="high">High (Time Sensitive)</option>
                    <option value="urgent">Urgent (Event Today / Money Blocked)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Detailed Problem Description *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Explain what happened in detail so support can assist you..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  <FiSend /> {submitting ? 'Submitting Ticket...' : 'Submit Support Ticket'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Complaints History List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FiClock className="text-indigo-400" /> Your Support Tickets ({complaints.length})
            </h2>
            <button
              onClick={fetchMyComplaints}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800"
            >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800">
              Loading support tickets...
            </div>
          ) : complaints.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800/80">
              <FiHelpCircle className="mx-auto text-4xl text-slate-600 mb-3" />
              <h3 className="text-lg font-semibold text-slate-300">No Support Tickets Filed Yet</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto mt-1">
                If you encounter any difficulty with event tickets, payments, or account access, click 'Lodge New Ticket' above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {complaints.map((item) => (
                <div key={item.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition space-y-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 font-mono">TICKET #{item.id}</span>
                        {getStatusBadge(item.status)}
                        {getPriorityBadge(item.priority)}
                      </div>
                      <h3 className="text-lg font-bold text-white mt-1">{item.subject}</h3>
                    </div>
                    <div className="text-xs text-slate-400">
                      Filed on {new Date(item.created_at).toLocaleString()}
                    </div>
                  </div>

                  <div className="text-sm text-slate-300 bg-slate-950/60 p-4 rounded-xl border border-slate-800/60">
                    <p className="whitespace-pre-line">{item.description}</p>
                    {item.event_title && (
                      <div className="mt-2 text-xs text-blue-400 font-medium">
                        📌 Event: {item.event_title}
                      </div>
                    )}
                  </div>

                  {/* Admin Resolution Section */}
                  {item.admin_response ? (
                    <div className="bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border border-blue-800/40 p-4 rounded-xl space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                        <FiCheckCircle className="text-emerald-400 text-base" /> Support Team Official Resolution
                      </div>
                      <p className="text-sm text-slate-200">{item.admin_response}</p>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 italic flex items-center gap-1">
                      <FiClock /> Ticket received. Junior Support Admin will review and provide resolution soon.
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
