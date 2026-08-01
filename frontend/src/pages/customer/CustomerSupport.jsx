import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { 
  FaHeadset, 
  FaPlus, 
  FaExclamationCircle, 
  FaCheckCircle, 
  FaClock, 
  FaPaperPlane, 
  FaComments,
  FaShieldAlt,
  FaCoins
} from 'react-icons/fa';

const CustomerSupport = () => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTicket, setActiveTicket] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [notification, setNotification] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    category: 'General Inquiry',
    subject: '',
    description: '',
    priority: 'Medium',
    booking_id: '',
    event_id: ''
  });

  useEffect(() => {
    if (user && user.id) {
      fetchTickets();
    }
  }, [user]);

  const showFeedback = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 6000);
  };

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost/EventEase/backend/api/support_tickets.php?user_id=${user.id}`);
      const data = await res.json();
      if (data.success) {
        setTickets(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async (ticketId) => {
    try {
      const res = await fetch(`http://localhost/EventEase/backend/api/support_replies.php?ticket_id=${ticketId}`);
      const data = await res.json();
      if (data.success) {
        setReplies(data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('http://localhost/EventEase/backend/api/support_tickets.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          ...formData
        })
      });
      const data = await res.json();
      setShowModal(false);
      if (data.success) {
        showFeedback(`Support ticket ${data.ticket_number} created successfully!`, 'success');
        setFormData({ category: 'General Inquiry', subject: '', description: '', priority: 'Medium', booking_id: '', event_id: '' });
        fetchTickets();
      } else {
        showFeedback(data.message || 'Failed to submit ticket.', 'error');
      }
    } catch (err) {
      showFeedback('Error submitting support ticket.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!newReply.trim() || !activeTicket) return;
    setSubmittingReply(true);
    try {
      const res = await fetch('http://localhost/EventEase/backend/api/support_replies.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket_id: activeTicket.id,
          sender_id: user.id,
          message: newReply
        })
      });
      const data = await res.json();
      if (data.success) {
        setNewReply('');
        fetchReplies(activeTicket.id);
        fetchTickets();
      } else {
        showFeedback(data.message, 'error');
      }
    } catch (err) {
      showFeedback('Failed to post reply', 'error');
    } finally {
      setSubmittingReply(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'In Progress':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Resolved':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col pt-24">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Hero Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-8 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 border border-purple-500/20 shadow-2xl">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-500/20 text-purple-300 rounded-2xl border border-purple-500/30">
                <FaHeadset className="text-3xl" />
              </div>
              <h1 className="text-3xl font-black text-white">Help & Customer Support Center</h1>
            </div>
            <p className="text-slate-300 text-sm max-w-xl">
              Submit event complaints, payment refund disputes, or technical support inquiries directly to our designated Support & Financial Administrators.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="mt-6 md:mt-0 flex items-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold rounded-2xl shadow-xl transition transform hover:scale-105"
          >
            <FaPlus />
            <span>Submit Support Complaint</span>
          </button>
        </div>

        {/* Feedback Alert Banner */}
        {notification && (
          <div className={`p-4 rounded-2xl border flex items-center justify-between shadow-lg ${
            notification.type === 'error' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          }`}>
            <div className="flex items-center space-x-3">
              {notification.type === 'error' ? <FaExclamationCircle className="text-xl" /> : <FaCheckCircle className="text-xl" />}
              <span className="font-semibold text-sm">{notification.msg}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* My Support Tickets Grid / Table */}
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <FaComments className="text-purple-400" />
            <span>My Support Complaints & Tickets ({tickets.length})</span>
          </h2>

          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mb-3"></div>
              <p>Loading support ticket records...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="p-12 text-center text-slate-400 border border-dashed border-slate-800 rounded-2xl">
              <FaHeadset className="text-4xl text-slate-600 mx-auto mb-3" />
              <p className="text-lg font-semibold text-slate-300">No support complaints found</p>
              <p className="text-xs text-slate-500 mt-1">If you experience issues with an event booking or payment, submit a support ticket above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => {
                    setActiveTicket(t);
                    fetchReplies(t.id);
                  }}
                  className={`cursor-pointer p-5 rounded-2xl border transition-all duration-200 ${
                    activeTicket?.id === t.id
                      ? 'bg-purple-950/40 border-purple-500 shadow-lg'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
                      {t.ticket_number}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(t.status)}`}>
                      {t.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-base mb-1 line-clamp-1">{t.subject}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4">{t.description}</p>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-800/80">
                    <span className="flex items-center space-x-1">
                      {t.category === 'Payment & Refund Dispute' ? <FaCoins className="text-emerald-400" /> : <FaShieldAlt className="text-indigo-400" />}
                      <span>{t.category}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <FaClock />
                      <span>{new Date(t.updated_at).toLocaleDateString()}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Ticket Conversation Thread Drawer */}
        {activeTicket && (
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
                    {activeTicket.ticket_number}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(activeTicket.status)}`}>
                    {activeTicket.status}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300">
                    Priority: {activeTicket.priority}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">{activeTicket.subject}</h2>
              </div>
              <button
                onClick={() => setActiveTicket(null)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                Close Thread ✕
              </button>
            </div>

            {/* Conversation Messages */}
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {/* Original Complaint */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-purple-300">Submitter Complaint Request</span>
                  <span>{new Date(activeTicket.created_at).toLocaleString()}</span>
                </div>
                <p className="text-sm text-slate-200">{activeTicket.description}</p>
              </div>

              {/* Replies */}
              {replies.map((reply) => {
                const isAdmin = reply.sender_role === 'admin';
                return (
                  <div
                    key={reply.id}
                    className={`p-4 rounded-2xl border space-y-2 ${
                      isAdmin
                        ? 'bg-purple-950/30 border-purple-500/30 ml-4'
                        : 'bg-slate-950 border-slate-800 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className={`font-semibold ${isAdmin ? 'text-purple-400 flex items-center space-x-1' : 'text-slate-300'}`}>
                        {isAdmin && <FaShieldAlt />}
                        <span>{reply.sender_name} {isAdmin ? `(${reply.sender_admin_role || 'Admin Response'})` : ''}</span>
                      </span>
                      <span>{new Date(reply.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-slate-200">{reply.message}</p>
                  </div>
                );
              })}
            </div>

            {/* Reply Input Form */}
            {activeTicket.status !== 'Closed' && (
              <form onSubmit={handleSendReply} className="flex items-center space-x-3 pt-4 border-t border-slate-800">
                <input
                  type="text"
                  required
                  placeholder="Type message to support administrators..."
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  disabled={submittingReply}
                  className="px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm rounded-xl shadow-lg transition flex items-center space-x-2 disabled:opacity-50"
                >
                  <FaPaperPlane />
                  <span>Send</span>
                </button>
              </form>
            )}
          </div>
        )}
      </main>

      {/* New Support Complaint Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <FaHeadset className="text-purple-400" />
                <span>Submit Support Complaint / Dispute</span>
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Complaint Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Event Issue">Event Content / Date Issue</option>
                  <option value="Payment & Refund Dispute">Payment & Refund Dispute (Financial Admin)</option>
                  <option value="Ticket Download Problem">Ticket Download / QR Code Problem</option>
                  <option value="Account / Verification">Account / Verification Problem</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Refund request for cancelled concert ticket"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Detailed Description of Complaint</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide full details of your complaint or payment dispute..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Urgency / Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                    <option value="Urgent">Urgent Priority</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Booking Ref ID (Optional)</label>
                  <input
                    type="number"
                    placeholder="e.g. 118"
                    value={formData.booking_id}
                    onChange={(e) => setFormData({ ...formData, booking_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm rounded-xl shadow-lg transition flex items-center space-x-2 disabled:opacity-50"
                >
                  {submitting && <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />}
                  <span>Submit Ticket</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CustomerSupport;
