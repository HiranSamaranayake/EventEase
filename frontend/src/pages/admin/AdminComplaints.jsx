import React, { useState, useEffect } from 'react';
import { 
  FiHelpCircle, 
  FiCheckCircle, 
  FiClock, 
  FiAlertTriangle, 
  FiFilter, 
  FiSearch,
  FiMessageSquare,
  FiSend,
  FiXCircle
} from 'react-icons/fi';

export default function AdminComplaints() {
  const admin = JSON.parse(localStorage.getItem('user') || '{}');
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({ total: 0, open: 0, in_progress: 0, resolved: 0, dismissed: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [responseForm, setResponseForm] = useState({
    status: 'resolved',
    priority: 'medium',
    admin_response: ''
  });
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost/EventEase/backend/api/admin_complaints.php');
      const data = await res.json();
      if (data.status === 'success') {
        setComplaints(data.data || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error("Error fetching complaints:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (ticket) => {
    setSelectedTicket(ticket);
    setResponseForm({
      status: ticket.status || 'resolved',
      priority: ticket.priority || 'medium',
      admin_response: ticket.admin_response || ''
    });
  };

  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTicket) return;

    setUpdating(true);
    try {
      const res = await fetch('http://localhost/EventEase/backend/api/admin_resolve_complaint.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          complaint_id: selectedTicket.id,
          status: responseForm.status,
          priority: responseForm.priority,
          admin_response: responseForm.admin_response,
          admin_id: admin.id
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        triggerToast(`Support Ticket #${selectedTicket.id} updated successfully.`);
        setSelectedTicket(null);
        fetchComplaints();
      } else {
        triggerToast(data.message || 'Failed to update ticket', 'error');
      }
    } catch (err) {
      triggerToast('Error resolving complaint ticket.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch = 
      c.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.user_name && c.user_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.user_email && c.user_email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Toast */}
      {toast.show && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-xl text-white font-medium flex items-center gap-2 ${
          toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FiHelpCircle className="text-purple-600" /> Junior Support Admin - Complaints Desk
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Review user support tickets, handle customer/organizer complaints, and issue official resolution responses.
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-md">
          <div className="text-xs text-gray-500 font-bold uppercase">Total Complaints</div>
          <div className="text-2xl font-extrabold text-gray-900 mt-1">{stats.total}</div>
        </div>
        <div className="bg-white border border-amber-200 p-5 rounded-2xl shadow-md bg-amber-50/50">
          <div className="text-xs text-amber-700 font-bold uppercase">Open Tickets</div>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">{stats.open}</div>
        </div>
        <div className="bg-white border border-blue-200 p-5 rounded-2xl shadow-md bg-blue-50/50">
          <div className="text-xs text-blue-700 font-bold uppercase">In Progress</div>
          <div className="text-2xl font-extrabold text-blue-600 mt-1">{stats.in_progress}</div>
        </div>
        <div className="bg-white border border-emerald-200 p-5 rounded-2xl shadow-md bg-emerald-50/50">
          <div className="text-xs text-emerald-700 font-bold uppercase">Resolved</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">{stats.resolved}</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-md">
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ticket ID, user, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-800 focus:outline-none focus:border-purple-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <FiFilter className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-800 focus:outline-none focus:border-purple-600"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm font-medium">Loading complaint tickets...</div>
        ) : filteredComplaints.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm font-medium">No support complaints found matching filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-extrabold border-b border-gray-200">
                <tr>
                  <th className="p-4">Ticket ID</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Subject & Category</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredComplaints.map((item) => (
                  <tr key={item.id} className="hover:bg-purple-50/30 transition">
                    <td className="p-4 font-mono font-bold text-purple-700">#{item.id}</td>
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{item.user_name || 'User #' + item.user_id}</div>
                      <div className="text-xs text-gray-400">{item.user_email}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-900 max-w-xs truncate">{item.subject}</div>
                      <div className="text-xs text-purple-600 font-semibold uppercase">{item.category.replace('_', ' ')}</div>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2.5 py-1 rounded-md font-extrabold uppercase ${
                        item.is_priority == 1 || item.priority === 'urgent' ? 'bg-amber-500 text-white font-black shadow-md border border-amber-400' :
                        item.priority === 'high' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                        item.priority === 'medium' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {item.is_priority == 1 ? '⭐ PREMIUM PRIORITY' : item.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                        item.status === 'resolved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        item.status === 'in_progress' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                        item.status === 'dismissed' ? 'bg-gray-100 text-gray-600' :
                        'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-gray-400">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-purple-600/20"
                      >
                        Respond & Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Response Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                  <FiMessageSquare className="text-purple-600" /> Support Ticket #{selectedTicket.id}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Filed by {selectedTicket.user_name} ({selectedTicket.user_email})</p>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                <FiXCircle />
              </button>
            </div>

            <form onSubmit={handleResolveSubmit} className="p-6 space-y-5">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2">
                <div className="text-xs text-gray-500 uppercase font-bold">Subject: {selectedTicket.subject}</div>
                <p className="text-sm text-gray-800">{selectedTicket.description}</p>
                {selectedTicket.event_title && (
                  <div className="text-xs text-purple-700 font-bold">Event: {selectedTicket.event_title}</div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase mb-2">Update Ticket Status</label>
                  <select
                    id="complaint-status-select"
                    value={responseForm.status}
                    onChange={(e) => setResponseForm({ ...responseForm, status: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:border-purple-600"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="dismissed">Dismissed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase mb-2">Adjust Priority</label>
                  <select
                    id="complaint-priority-select"
                    value={responseForm.priority}
                    onChange={(e) => setResponseForm({ ...responseForm, priority: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:border-purple-600"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase mb-2">Official Admin Resolution Response</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide resolution details or action taken for the user..."
                  value={responseForm.admin_response}
                  onChange={(e) => setResponseForm({ ...responseForm, admin_response: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 text-xs font-medium text-gray-800 focus:outline-none focus:border-purple-600"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-purple-600/20"
                >
                  <FiSend /> {updating ? 'Saving Changes...' : 'Save & Send Resolution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
