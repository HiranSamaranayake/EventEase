import React, { useState, useEffect } from 'react';
import { 
  FaHeadset, 
  FaCoins, 
  FaShieldAlt, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaSearch, 
  FaPaperPlane, 
  FaUserCheck, 
  FaClock, 
  FaFilter,
  FaComments
} from 'react-icons/fa';

const AdminSupport = () => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));
  const [tickets, setTickets] = useState([]);
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTicket, setActiveTicket] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [notification, setNotification] = useState(null);
  const [submittingReply, setSubmittingReply] = useState(false);

  useEffect(() => {
    fetchTickets();
    fetchSubAdmins();
  }, [categoryFilter, statusFilter]);

  const showFeedback = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 6000);
  };

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost/EventEase/backend/api/support_tickets.php?category=${categoryFilter}&status=${statusFilter}`);
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

  const fetchSubAdmins = async () => {
    try {
      const res = await fetch('http://localhost/EventEase/backend/api/admin_subadmins.php');
      const data = await res.json();
      if (data.success) {
        setSubAdmins(data.data || []);
      }
    } catch (err) {
      console.error(err);
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

  const handleUpdateStatus = async (ticketId, newStatus, assignedTo = null) => {
    try {
      const body = { id: ticketId, status: newStatus };
      if (assignedTo !== null) {
        body.assigned_to = assignedTo;
      }
      const res = await fetch('http://localhost/EventEase/backend/api/support_tickets.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        showFeedback('Ticket updated successfully!');
        fetchTickets();
        if (activeTicket && activeTicket.id === ticketId) {
          setActiveTicket({ ...activeTicket, status: newStatus, assigned_to: assignedTo });
        }
      } else {
        showFeedback(data.message, 'error');
      }
    } catch (err) {
      showFeedback('Failed to update ticket status', 'error');
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
          sender_id: user.id || 7,
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

  const filteredTickets = tickets.filter(t => {
    const term = searchTerm.toLowerCase();
    return t.subject.toLowerCase().includes(term) ||
           t.ticket_number.toLowerCase().includes(term) ||
           (t.submitter_name && t.submitter_name.toLowerCase().includes(term)) ||
           (t.submitter_email && t.submitter_email.toLowerCase().includes(term));
  });

  const getCounts = () => {
    return {
      open: tickets.filter(t => t.status === 'Open').length,
      in_progress: tickets.filter(t => t.status === 'In Progress').length,
      payment_disputes: tickets.filter(t => t.category === 'Payment & Refund Dispute').length,
      resolved: tickets.filter(t => t.status === 'Resolved').length
    };
  };

  const counts = getCounts();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2.5 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/30">
              <FaHeadset className="text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-white">Customer Support & Dispute Resolution Center</h1>
          </div>
          <p className="text-slate-400 text-sm max-w-2xl">
            Resolve customer complaints, handle payment disputes (Financial Admin), moderate event listings (Support Admin), and assign sub-admin ticket handlers.
          </p>
        </div>
      </div>

      {/* Alert Notifications */}
      {notification && (
        <div className={`p-4 rounded-xl border flex items-center justify-between shadow-lg ${
          notification.type === 'error' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        }`}>
          <div className="flex items-center space-x-3">
            {notification.type === 'error' ? <FaExclamationTriangle /> : <FaCheckCircle />}
            <span className="font-medium text-sm">{notification.msg}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white font-bold ml-4">✕</button>
        </div>
      )}

      {/* Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-5 rounded-2xl border border-amber-500/30 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-amber-400">Open Complaints</span>
            <span className="text-2xl font-black text-white">{counts.open}</span>
          </div>
          <p className="text-xs text-slate-400">Awaiting initial admin review</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-blue-500/30 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-blue-400">In Progress</span>
            <span className="text-2xl font-black text-white">{counts.in_progress}</span>
          </div>
          <p className="text-xs text-slate-400">Currently being handled by sub-admin</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-emerald-500/30 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-emerald-400">Payment Disputes</span>
            <span className="text-2xl font-black text-white">{counts.payment_disputes}</span>
          </div>
          <p className="text-xs text-slate-400">Financial Admin dispute queue</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-purple-500/30 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-purple-400">Resolved Cases</span>
            <span className="text-2xl font-black text-white">{counts.resolved}</span>
          </div>
          <p className="text-xs text-slate-400">Successfully closed support cases</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <FaSearch className="absolute left-3 top-3.5 text-slate-500 text-sm" />
          <input
            type="text"
            placeholder="Search ticket #, subject, or submitter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400">
            <FaFilter />
            <span>Category:</span>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Categories</option>
            <option value="Payment & Refund Dispute">Payment Disputes (Financial Admin)</option>
            <option value="Event Issue">Event Content / Dates (Support Admin)</option>
            <option value="Ticket Download Problem">Ticket / QR Problems</option>
            <option value="Account / Verification">Account / Verification</option>
            <option value="General Inquiry">General Inquiries</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-3"></div>
            <p>Loading complaints queue...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FaUserCheck className="text-4xl text-slate-600 mx-auto mb-3" />
            <p className="text-lg font-medium text-slate-300">No support tickets found matching criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-semibold">Ticket #</th>
                  <th className="px-6 py-4 font-semibold">Submitter</th>
                  <th className="px-6 py-4 font-semibold">Category & Subject</th>
                  <th className="px-6 py-4 font-semibold">Priority</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Assigned Handler</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-purple-400">
                      {t.ticket_number}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{t.submitter_name || `User #${t.user_id}`}</div>
                      <div className="text-xs text-slate-400">{t.submitter_email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1.5 text-xs text-indigo-400 font-semibold mb-0.5">
                        {t.category === 'Payment & Refund Dispute' ? <FaCoins className="text-emerald-400" /> : <FaShieldAlt />}
                        <span>{t.category}</span>
                      </div>
                      <div className="font-medium text-white line-clamp-1">{t.subject}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        t.priority === 'Urgent' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        t.priority === 'High' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        t.status === 'Open' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                        t.status === 'In Progress' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                        t.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                        'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {t.assignee_name || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setActiveTicket(t);
                          fetchReplies(t.id);
                        }}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg shadow transition"
                      >
                        Manage & Reply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ticket Management & Conversation Modal Drawer */}
      {activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
                    {activeTicket.ticket_number}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    {activeTicket.category}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">{activeTicket.subject}</h2>
                <div className="text-xs text-slate-400 mt-0.5">
                  Submitted by {activeTicket.submitter_name} ({activeTicket.submitter_email})
                </div>
              </div>
              <button onClick={() => setActiveTicket(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            {/* Sub-Admin Controls: Status & Assignment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Change Ticket Status</label>
                <select
                  value={activeTicket.status}
                  onChange={(e) => handleUpdateStatus(activeTicket.id, e.target.value, activeTicket.assigned_to)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Assign Sub-Admin Handler</label>
                <select
                  value={activeTicket.assigned_to || ''}
                  onChange={(e) => handleUpdateStatus(activeTicket.id, activeTicket.status, e.target.value ? intval(e.target.value) : 0)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="">-- Unassigned --</option>
                  {subAdmins.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.full_name} ({sub.admin_role || 'admin'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Conversation Log */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-semibold text-slate-300">Original Complaint Details</span>
                  <span>{new Date(activeTicket.created_at).toLocaleString()}</span>
                </div>
                <p className="text-sm text-slate-200">{activeTicket.description}</p>
              </div>

              {replies.map((r) => {
                const isAdmin = r.sender_role === 'admin';
                return (
                  <div
                    key={r.id}
                    className={`p-3.5 rounded-2xl border ${
                      isAdmin ? 'bg-purple-950/40 border-purple-500/30 ml-4' : 'bg-slate-950 border-slate-800 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span className={`font-semibold ${isAdmin ? 'text-purple-400' : 'text-slate-300'}`}>
                        {r.sender_name} {isAdmin ? `(${r.sender_admin_role || 'Admin Response'})` : ''}
                      </span>
                      <span>{new Date(r.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-slate-200">{r.message}</p>
                  </div>
                );
              })}
            </div>

            {/* Reply Form */}
            <form onSubmit={handleSendReply} className="flex items-center space-x-3 pt-4 border-t border-slate-800">
              <input
                type="text"
                required
                placeholder="Type response to customer/organizer..."
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={submittingReply}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center space-x-2 disabled:opacity-50"
              >
                <FaPaperPlane />
                <span>Post Reply</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSupport;
