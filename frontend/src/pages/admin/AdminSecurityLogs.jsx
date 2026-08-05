import React, { useState, useEffect } from 'react';
import { 
  FiShield, 
  FiAlertOctagon, 
  FiAlertTriangle, 
  FiInfo, 
  FiFilter, 
  FiSearch, 
  FiFlag, 
  FiUserX, 
  FiActivity,
  FiXCircle,
  FiRefreshCw
} from 'react-icons/fi';

export default function AdminSecurityLogs() {
  const admin = JSON.parse(localStorage.getItem('user') || '{}');
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ total_logs: 0, critical: 0, high: 0, medium: 0, low: 0, flagged: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [flaggedOnly, setFlaggedOnly] = useState(false);

  const [selectedLog, setSelectedLog] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchSecurityLogs();
  }, [riskFilter, typeFilter, flaggedOnly]);

  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const fetchSecurityLogs = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (riskFilter !== 'all') queryParams.append('risk', riskFilter);
      if (typeFilter !== 'all') queryParams.append('type', typeFilter);
      if (flaggedOnly) queryParams.append('flagged', '1');

      const res = await fetch(`http://localhost/EventEase/backend/api/admin_security_logs.php?${queryParams.toString()}`);
      const data = await res.json();
      if (data.status === 'success') {
        setLogs(data.data || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to load security logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFlag = async (log) => {
    setActionLoading(true);
    try {
      const res = await fetch('http://localhost/EventEase/backend/api/admin_security_action.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ log_id: log.id, action: 'toggle_flag' })
      });
      const data = await res.json();
      if (data.status === 'success') {
        triggerToast(`Security Log #${log.id} flag status toggled.`);
        if (selectedLog && selectedLog.id === log.id) {
          setSelectedLog({ ...selectedLog, is_flagged: !selectedLog.is_flagged });
        }
        fetchSecurityLogs();
      } else {
        triggerToast(data.message || 'Action failed', 'error');
      }
    } catch (err) {
      triggerToast('Error performing security action.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateRisk = async (log, newRisk) => {
    setActionLoading(true);
    try {
      const res = await fetch('http://localhost/EventEase/backend/api/admin_security_action.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ log_id: log.id, action: 'update_risk', risk_score: newRisk })
      });
      const data = await res.json();
      if (data.status === 'success') {
        triggerToast(`Risk level updated to ${newRisk.toUpperCase()}`);
        if (selectedLog && selectedLog.id === log.id) {
          setSelectedLog({ ...selectedLog, risk_score: newRisk });
        }
        fetchSecurityLogs();
      } else {
        triggerToast(data.message || 'Failed to update risk level', 'error');
      }
    } catch (err) {
      triggerToast('Error updating risk score.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBlockUser = async (userId) => {
    if (!userId) return;
    if (!window.confirm(`Are you sure you want to block User #${userId}?`)) return;

    setActionLoading(true);
    try {
      const res = await fetch('http://localhost/EventEase/backend/api/admin_security_action.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'block_user', user_id: userId })
      });
      const data = await res.json();
      if (data.status === 'success') {
        triggerToast(`User #${userId} blocked successfully!`);
        fetchSecurityLogs();
      } else {
        triggerToast(data.message || 'Block failed', 'error');
      }
    } catch (err) {
      triggerToast('Error blocking user.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredLogs = logs.filter((l) => {
    const matchesSearch = 
      l.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.ip_address.includes(searchTerm) ||
      l.event_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.user_name && l.user_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      l.id.toString().includes(searchTerm);
    return matchesSearch;
  });

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'critical':
        return <span className="px-2.5 py-1 bg-rose-100 text-rose-800 border border-rose-200 text-xs font-extrabold rounded-full flex items-center gap-1"><FiAlertOctagon /> CRITICAL</span>;
      case 'high':
        return <span className="px-2.5 py-1 bg-orange-100 text-orange-800 border border-orange-200 text-xs font-bold rounded-full flex items-center gap-1"><FiAlertTriangle /> HIGH</span>;
      case 'medium':
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold rounded-full flex items-center gap-1"><FiActivity /> MEDIUM</span>;
      default:
        return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 border border-blue-200 text-xs font-medium rounded-full flex items-center gap-1"><FiInfo /> LOW</span>;
    }
  };

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
            <FiShield className="text-rose-600" /> Security Admin - Security Audit & Fraud Detection
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Real-time security logs monitoring, suspicious transaction tracking, IP tracing, and threat mitigation controls.
          </p>
        </div>
        <button
          onClick={fetchSecurityLogs}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-2 border border-gray-200 transition"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} /> Refresh Logs
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-md">
          <div className="text-xs text-gray-500 font-bold uppercase">Total Security Logs</div>
          <div className="text-2xl font-extrabold text-gray-900 mt-1">{stats.total_logs}</div>
        </div>
        <div className="bg-white border border-rose-200 p-4 rounded-2xl shadow-md bg-rose-50/50">
          <div className="text-xs text-rose-700 font-bold uppercase">Critical Threats</div>
          <div className="text-2xl font-black text-rose-700 mt-1">{stats.critical}</div>
        </div>
        <div className="bg-white border border-orange-200 p-4 rounded-2xl shadow-md bg-orange-50/50">
          <div className="text-xs text-orange-700 font-bold uppercase">High Risk Events</div>
          <div className="text-2xl font-bold text-orange-700 mt-1">{stats.high}</div>
        </div>
        <div className="bg-white border border-amber-200 p-4 rounded-2xl shadow-md bg-amber-50/50">
          <div className="text-xs text-amber-700 font-semibold uppercase">Medium Risk</div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{stats.medium}</div>
        </div>
        <div className="bg-white border border-purple-200 p-4 rounded-2xl shadow-md bg-purple-50/50">
          <div className="text-xs text-purple-700 font-bold uppercase">Flagged Suspicious</div>
          <div className="text-2xl font-bold text-purple-700 mt-1">{stats.flagged}</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-md">
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search IP, details, or user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-800 focus:outline-none focus:border-rose-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-400" />
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-rose-600"
            >
              <option value="all">All Risk Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-rose-600"
          >
            <option value="all">All Event Types</option>
            <option value="failed_login">Failed Login</option>
            <option value="unauthorized_access">Unauthorized Access</option>
            <option value="suspicious_transaction">Suspicious Transaction</option>
            <option value="privilege_change">Privilege Change</option>
            <option value="ticket_scan_anomaly">Ticket Scan Anomaly</option>
            <option value="user_blocked">User Blocked</option>
          </select>

          <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
            <input
              type="checkbox"
              checked={flaggedOnly}
              onChange={(e) => setFlaggedOnly(e.target.checked)}
              className="rounded bg-white border-gray-300 text-rose-600 focus:ring-0"
            />
            Flagged Only
          </label>
        </div>
      </div>

      {/* Security Logs Table */}
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm font-medium">Loading security logs...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm font-medium">No security audit logs found matching criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-extrabold border-b border-gray-200">
                <tr>
                  <th className="p-4">Log ID</th>
                  <th className="p-4">Event Type</th>
                  <th className="p-4">Risk Level</th>
                  <th className="p-4">IP Address</th>
                  <th className="p-4">User Details</th>
                  <th className="p-4">Details</th>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredLogs.map((item) => (
                  <tr key={item.id} className={`hover:bg-rose-50/20 transition ${item.is_flagged ? 'bg-rose-50/40' : ''}`}>
                    <td className="p-4 font-mono font-bold text-gray-500">#{item.id}</td>
                    <td className="p-4 font-bold text-gray-900 uppercase text-xs">
                      {item.event_type.replace(/_/g, ' ')}
                    </td>
                    <td className="p-4">
                      {getRiskBadge(item.risk_score)}
                    </td>
                    <td className="p-4 font-mono text-xs text-indigo-600 font-bold">
                      {item.ip_address}
                    </td>
                    <td className="p-4">
                      {item.user_name ? (
                        <div>
                          <div className="font-bold text-gray-900">{item.user_name}</div>
                          <div className="text-xs text-gray-400">{item.user_email} (ID #{item.user_id})</div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Anonymous / Unauthenticated</span>
                      )}
                    </td>
                    <td className="p-4 text-xs text-gray-700 max-w-xs truncate" title={item.details}>
                      {item.details}
                    </td>
                    <td className="p-4 text-xs text-gray-400 whitespace-nowrap">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleFlag(item)}
                          title={item.is_flagged ? "Unflag Event" : "Flag Suspicious Event"}
                          className={`p-2 rounded-xl border transition ${
                            item.is_flagged ? 'bg-rose-100 text-rose-700 border-rose-300 hover:bg-rose-200' : 'bg-gray-100 text-gray-600 border-gray-200 hover:text-gray-900'
                          }`}
                        >
                          <FiFlag />
                        </button>
                        <button
                          onClick={() => setSelectedLog(item)}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-rose-600/20"
                        >
                          Inspect & Act
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inspect Log & Action Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-fade-in border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                  <FiShield className="text-rose-600" /> Security Audit Log #{selectedLog.id}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Recorded on {new Date(selectedLog.created_at).toLocaleString()}</p>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                <FiXCircle />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                  <div className="text-xs text-gray-500 uppercase font-bold">Event Type</div>
                  <div className="text-sm font-extrabold text-gray-900 uppercase mt-1">{selectedLog.event_type.replace(/_/g, ' ')}</div>
                </div>
                <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                  <div className="text-xs text-gray-500 uppercase font-bold">Current Risk Level</div>
                  <div className="mt-1">{getRiskBadge(selectedLog.risk_score)}</div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2">
                <div className="text-xs text-gray-500 uppercase font-bold">Event Description & Details</div>
                <p className="text-sm text-gray-800 font-medium">{selectedLog.details}</p>
                <div className="text-xs text-indigo-700 font-mono font-bold mt-2">
                  IP Address: {selectedLog.ip_address}
                </div>
                {selectedLog.user_agent && (
                  <div className="text-xs text-gray-400 font-mono truncate" title={selectedLog.user_agent}>
                    User Agent: {selectedLog.user_agent}
                  </div>
                )}
              </div>

              {/* Adjust Risk Level */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase mb-2">Adjust Risk Classification</label>
                <div className="flex gap-2">
                  {['low', 'medium', 'high', 'critical'].map((r) => (
                    <button
                      key={r}
                      onClick={() => handleUpdateRisk(selectedLog, r)}
                      disabled={actionLoading}
                      className={`flex-1 py-2 text-xs font-extrabold uppercase rounded-xl border transition ${
                        selectedLog.risk_score === r ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/20' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fraud Mitigation Actions */}
              <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                <button
                  onClick={() => handleToggleFlag(selectedLog)}
                  disabled={actionLoading}
                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 border transition ${
                    selectedLog.is_flagged ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  <FiFlag /> {selectedLog.is_flagged ? 'Flagged (Click to Unflag)' : 'Flag as Suspicious'}
                </button>

                {selectedLog.user_id && (
                  <button
                    onClick={() => handleBlockUser(selectedLog.user_id)}
                    disabled={actionLoading}
                    className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5 shadow-lg shadow-rose-600/20"
                  >
                    <FiUserX /> Block User #{selectedLog.user_id}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
