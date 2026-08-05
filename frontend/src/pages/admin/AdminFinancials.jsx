import React, { useState, useEffect } from 'react';
import { 
  FiDollarSign, 
  FiPieChart, 
  FiCheckCircle, 
  FiClock, 
  FiAlertCircle, 
  FiDownload, 
  FiFilter, 
  FiSearch,
  FiXCircle,
  FiCreditCard,
  FiSend
} from 'react-icons/fi';

export default function AdminFinancials() {
  const admin = JSON.parse(localStorage.getItem('user') || '{}');
  const [stats, setStats] = useState({ gross_revenue: 0, platform_commission: 0, pending_payouts: 0, settled_payouts: 0, pending_count: 0, settled_count: 0 });
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedPayout, setSelectedPayout] = useState(null);
  const [actionForm, setActionForm] = useState({ status: 'approved', admin_notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchFinancialStats();
    fetchPayouts();
  }, [statusFilter]);

  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const fetchFinancialStats = async () => {
    try {
      const res = await fetch('http://localhost/EventEase/backend/api/admin_financial_stats.php');
      const data = await res.json();
      if (data.status === 'success' && data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to load financial stats:", err);
    }
  };

  const fetchPayouts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost/EventEase/backend/api/admin_get_payouts.php?status=${statusFilter}`);
      const data = await res.json();
      if (data.status === 'success') {
        setPayouts(data.data || []);
      }
    } catch (err) {
      console.error("Failed to load payouts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (payout) => {
    setSelectedPayout(payout);
    setActionForm({
      status: payout.status === 'pending' ? 'approved' : payout.status,
      admin_notes: payout.admin_notes || ''
    });
  };

  const handleProcessPayout = async (e) => {
    e.preventDefault();
    if (!selectedPayout) return;

    setSubmitting(true);
    try {
      const res = await fetch('http://localhost/EventEase/backend/api/admin_process_payout.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payout_id: selectedPayout.id,
          status: actionForm.status,
          admin_notes: actionForm.admin_notes,
          admin_id: admin.id || 7
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        triggerToast(`Payout request #${selectedPayout.id} updated to ${actionForm.status.toUpperCase()}`);
        setSelectedPayout(null);
        fetchFinancialStats();
        fetchPayouts();
      } else {
        triggerToast(data.message || 'Operation failed', 'error');
      }
    } catch (err) {
      triggerToast('Error processing payout.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPayouts = payouts.filter((p) => {
    return (p.organizer_name && p.organizer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
           (p.event_title && p.event_title.toLowerCase().includes(searchTerm.toLowerCase())) ||
           (p.bank_name && p.bank_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
           p.id.toString().includes(searchTerm);
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
            <FiDollarSign className="text-emerald-600" /> Financial Admin - Revenue Ledger & Payouts Hub
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Audit platform ticket sales ledger, verify organizer revenue commission splits, and process bank transfer payouts.
          </p>
        </div>

        <a
          href="http://localhost/EventEase/backend/api/admin_export_financial_csv.php"
          download
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center gap-2"
        >
          <FiDownload /> Export Financial CSV Ledger
        </a>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-md">
          <div className="text-xs text-gray-500 font-bold uppercase">Gross Ticket Sales</div>
          <div className="text-2xl font-black text-gray-900 mt-1">LKR {stats.gross_revenue.toLocaleString()}</div>
          <div className="text-[10px] text-gray-400 font-semibold mt-1">Platform-wide confirmed bookings</div>
        </div>

        <div className="bg-white border border-purple-200 p-5 rounded-2xl shadow-md bg-purple-50/40">
          <div className="text-xs text-purple-700 font-bold uppercase">Platform Commission (10%)</div>
          <div className="text-2xl font-black text-purple-700 mt-1">LKR {stats.platform_commission.toLocaleString()}</div>
          <div className="text-[10px] text-purple-600 font-semibold mt-1">Net platform revenue collected</div>
        </div>

        <div className="bg-white border border-amber-200 p-5 rounded-2xl shadow-md bg-amber-50/40">
          <div className="text-xs text-amber-700 font-bold uppercase">Pending Organizer Transfers</div>
          <div className="text-2xl font-black text-amber-700 mt-1">LKR {stats.pending_payouts.toLocaleString()}</div>
          <div className="text-[10px] text-amber-600 font-semibold mt-1">{stats.pending_count} Pending Requests</div>
        </div>

        <div className="bg-white border border-emerald-200 p-5 rounded-2xl shadow-md bg-emerald-50/40">
          <div className="text-xs text-emerald-700 font-bold uppercase">Settled Payout Transfers</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">LKR {stats.settled_payouts.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1">{stats.settled_count} Processed Transfers</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-md">
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search organizer, event, or bank..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-800 focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <FiFilter className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-semibold text-gray-800 focus:outline-none focus:border-emerald-600"
          >
            <option value="all">All Payout Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="transferred">Transferred</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Payouts Table */}
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm font-medium">Loading payout requests...</div>
        ) : filteredPayouts.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm font-medium">No organizer payout records found matching filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-extrabold border-b border-gray-200">
                <tr>
                  <th className="p-4">Payout ID</th>
                  <th className="p-4">Organizer</th>
                  <th className="p-4">Event</th>
                  <th className="p-4">Gross Revenue</th>
                  <th className="p-4">Fee (10%)</th>
                  <th className="p-4">Net Payout</th>
                  <th className="p-4">Bank Account</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredPayouts.map((item) => (
                  <tr key={item.id} className="hover:bg-emerald-50/20 transition">
                    <td className="p-4 font-mono font-bold text-emerald-700">#{item.id}</td>
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{item.organizer_name || 'Organizer #' + item.organizer_id}</div>
                      <div className="text-xs text-gray-400">{item.organizer_email}</div>
                    </td>
                    <td className="p-4 text-xs font-semibold text-gray-800">
                      {item.event_title || 'General Revenue Settlement'}
                    </td>
                    <td className="p-4 font-mono font-bold text-gray-900">
                      LKR {Number(item.gross_revenue).toLocaleString()}
                    </td>
                    <td className="p-4 font-mono text-xs text-purple-700 font-bold">
                      -LKR {Number(item.commission_fee).toLocaleString()}
                    </td>
                    <td className="p-4 font-mono text-sm text-emerald-700 font-black">
                      LKR {Number(item.net_payout).toLocaleString()}
                    </td>
                    <td className="p-4 text-xs">
                      <div className="font-bold text-gray-800">{item.bank_name}</div>
                      <div className="font-mono text-gray-400">{item.account_number}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                        item.status === 'transferred' || item.status === 'approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        item.status === 'rejected' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-emerald-600/20"
                      >
                        Process Payout
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Process Payout Modal */}
      {selectedPayout && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                  <FiCreditCard className="text-emerald-600" /> Process Organizer Payout #{selectedPayout.id}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Requested by {selectedPayout.organizer_name} on {new Date(selectedPayout.requested_at).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => setSelectedPayout(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                <FiXCircle />
              </button>
            </div>

            <form onSubmit={handleProcessPayout} className="p-6 space-y-5">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Gross Sales:</span>
                  <span className="font-mono font-bold text-gray-900">LKR {Number(selectedPayout.gross_revenue).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-purple-700 font-bold">
                  <span>Platform Fee (10%):</span>
                  <span className="font-mono">-LKR {Number(selectedPayout.commission_fee).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-800 font-black text-sm pt-2 border-t border-gray-200">
                  <span>Net Payable Amount:</span>
                  <span className="font-mono">LKR {Number(selectedPayout.net_payout).toLocaleString()}</span>
                </div>
                <div className="pt-2 text-gray-600 border-t border-gray-200">
                  <span>Bank Account: </span>
                  <strong className="text-gray-900">{selectedPayout.bank_name} - Acc #{selectedPayout.account_number}</strong>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase mb-2">Payout Transfer Status</label>
                <select
                  id="payout-status-select"
                  value={actionForm.status}
                  onChange={(e) => setActionForm({ ...actionForm, status: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-extrabold text-gray-900 focus:outline-none focus:border-emerald-600"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="transferred">Transferred (Settled)</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase mb-2">Audit Notes / Payment Reference</label>
                <textarea
                  rows={3}
                  placeholder="Enter transaction reference ID or settlement notes..."
                  value={actionForm.admin_notes}
                  onChange={(e) => setActionForm({ ...actionForm, admin_notes: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 text-xs font-medium text-gray-800 focus:outline-none focus:border-emerald-600"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPayout(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <FiSend /> {submitting ? 'Saving...' : 'Save & Confirm Payout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
