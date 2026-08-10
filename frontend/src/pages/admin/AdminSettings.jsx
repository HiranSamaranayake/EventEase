import React, { useState, useEffect } from 'react';
import { 
  FaUserCog, 
  FaLock, 
  FaSun, 
  FaCheckCircle, 
  FaDatabase, 
  FaDownload, 
  FaShieldAlt, 
  FaPlus,
  FaSync,
  FaServer,
  FaSlidersH
} from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

const AdminSettings = () => {
  const { theme } = useTheme();
  const admin = JSON.parse(localStorage.getItem("user") || "{}");

  const [backups, setBackups] = useState([]);
  const [loadingBackups, setLoadingBackups] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [settings, setSettings] = useState({
    maintenance_mode: 'false',
    max_login_attempts: '5',
    session_timeout_mins: '60',
    enforce_tls: 'true',
    auto_backup_frequency: 'daily',
    smtp_host: 'smtp.gmail.com',
    smtp_port: '587',
    smtp_user: '',
    smtp_pass: '',
    smtp_from_email: 'noreply@eventease.com',
    smtp_from_name: 'EventEase Ticketing'
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchBackups();
    fetchSystemSettings();
  }, []);

  const handleTestSmtp = async () => {
    setTestingSmtp(true);
    try {
      const res = await fetch('http://localhost/EventEase/backend/api/admin_test_smtp.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          test_email: admin.email || 'admin@eventease.com',
          ...settings
        })
      });
      const data = await res.json();
      if (data.success) {
        triggerToast(`SMTP Test Success! ${data.message}`);
      } else {
        triggerToast(data.message || 'SMTP test failed.', 'error');
      }
    } catch (err) {
      triggerToast('Error connecting to SMTP test endpoint.', 'error');
    } finally {
      setTestingSmtp(false);
    }
  };

  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const fetchBackups = async () => {
    setLoadingBackups(true);
    try {
      const res = await fetch('http://localhost/EventEase/backend/api/admin_get_backups.php');
      const data = await res.json();
      if (data.status === 'success') {
        setBackups(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch backups:", err);
    } finally {
      setLoadingBackups(false);
    }
  };

  const fetchSystemSettings = async () => {
    try {
      const res = await fetch('http://localhost/EventEase/backend/api/admin_system_settings.php');
      const data = await res.json();
      if (data.status === 'success' && data.data) {
        setSettings(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch system settings:", err);
    }
  };

  const handleGenerateBackup = async () => {
    setGenerating(true);
    try {
      const res = await fetch('http://localhost/EventEase/backend/api/admin_generate_backup.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_id: admin.id || 7 })
      });
      const data = await res.json();
      if (data.status === 'success') {
        triggerToast('Database backup snapshot generated successfully!');
        fetchBackups();
      } else {
        triggerToast(data.message || 'Failed to generate backup', 'error');
      }
    } catch (err) {
      triggerToast('Error generating database backup.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch('http://localhost/EventEase/backend/api/admin_system_settings.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.status === 'success') {
        triggerToast('Security policies and system configurations updated!');
      } else {
        triggerToast(data.message || 'Failed to update settings', 'error');
      }
    } catch (err) {
      triggerToast('Error saving settings.', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 md:p-6">
      {/* Toast */}
      {toast.show && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-xl text-white font-medium flex items-center gap-2 ${
          toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <FaSlidersH className="text-purple-600" /> Admin Platform Settings & Security Policies
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Super Admin controls for database backups, security governance, maintenance modes, and access thresholds.
        </p>
      </div>

      {/* General Preference Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* System Theme Controls */}
        <div className="bg-white shadow-xl rounded-3xl p-6 border border-gray-100 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 text-2xl">
            <FaSun />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">System Theme</h2>
            <p className="text-xs text-gray-500 mt-0.5">High contrast Light mode is enabled globally for maximum text legibility.</p>
          </div>
          <div className="pt-2">
            <div className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center gap-2">
              <FaCheckCircle className="text-emerald-600 text-base" /> Normal Light Mode Active
            </div>
          </div>
        </div>

        {/* Profile Settings */}
        <div className="bg-white shadow-xl rounded-3xl p-6 border border-gray-100 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl">
            <FaUserCog />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">Admin Account Info</h2>
            <p className="text-xs text-gray-500 mt-0.5">Logged in as: <span className="font-bold text-gray-800">{admin.full_name || 'Admin'}</span></p>
            <p className="text-xs text-purple-700 font-bold uppercase mt-1">Role: {admin.admin_role || 'super_admin'}</p>
          </div>
        </div>

        {/* Security Summary */}
        <div className="bg-white shadow-xl rounded-3xl p-6 border border-gray-100 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 text-2xl">
            <FaLock />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">Security & Encryption</h2>
            <p className="text-xs text-gray-500 mt-0.5">TLS 1.3 Encryption & Password Hashing via bcrypt is active across APIs.</p>
          </div>
        </div>
      </div>

      {/* DATABASE BACKUP CONTROLS SECTION */}
      <div className="bg-white shadow-xl rounded-3xl p-6 md:p-8 border border-gray-100 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
              <FaDatabase className="text-purple-600" /> Database Backup Controls & Snapshots
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Create manual SQL backups of MySQL tables, view snapshot history, and download backup files.
            </p>
          </div>
          <button
            onClick={handleGenerateBackup}
            disabled={generating}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/20 transition flex items-center gap-2"
          >
            <FaPlus /> {generating ? 'Generating Backup...' : 'Generate Database Backup Now'}
          </button>
        </div>

        {/* Backup Snapshots Table */}
        <div className="overflow-x-auto">
          {loadingBackups ? (
            <div className="p-8 text-center text-xs text-gray-400">Loading backup history...</div>
          ) : backups.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-400 bg-gray-50 rounded-2xl">
              No manual database backups created yet. Click 'Generate Database Backup Now' above.
            </div>
          ) : (
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-[11px] border-b border-gray-200">
                <tr>
                  <th className="p-3">Snapshot File</th>
                  <th className="p-3">Tables</th>
                  <th className="p-3">File Size</th>
                  <th className="p-3">Created By</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {backups.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/80 transition">
                    <td className="p-3 font-mono font-bold text-purple-700 flex items-center gap-2">
                      <FaServer className="text-purple-400" /> {b.file_name}
                    </td>
                    <td className="p-3">{b.tables_count} Tables</td>
                    <td className="p-3 font-mono">{formatBytes(b.file_size)}</td>
                    <td className="p-3">{b.creator_name || 'Super Admin'}</td>
                    <td className="p-3 text-gray-400">{new Date(b.created_at).toLocaleString()}</td>
                    <td className="p-3 text-right">
                      <a
                        href={`http://localhost/EventEase/backend/api/admin_download_backup.php?file=${encodeURIComponent(b.file_name)}`}
                        download
                        className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs rounded-lg transition inline-flex items-center gap-1.5"
                      >
                        <FaDownload /> Download .sql
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* PLATFORM SECURITY & GOVERNANCE POLICIES SECTION */}
      <div className="bg-white shadow-xl rounded-3xl p-6 md:p-8 border border-gray-100 space-y-6">
        <div className="border-b border-gray-100 pb-5">
          <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <FaShieldAlt className="text-rose-600" /> Platform Security & Governance Policies
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Enforce security rules, maintenance modes, session timeouts, and auto-backup schedules.
          </p>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Maintenance Mode */}
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-2">
              <label className="block text-xs font-extrabold text-gray-800 uppercase">System Maintenance Mode</label>
              <p className="text-xs text-gray-500">When enabled, non-admin customer bookings are temporarily paused.</p>
              <select
                id="setting-maintenance-mode"
                value={settings.maintenance_mode}
                onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-purple-600"
              >
                <option value="false">🟢 Disabled (Normal Operation)</option>
                <option value="true">🔴 Enabled (System Maintenance)</option>
              </select>
            </div>

            {/* Max Login Attempts */}
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-2">
              <label className="block text-xs font-extrabold text-gray-800 uppercase">Max Login Failed Threshold</label>
              <p className="text-xs text-gray-500">Consecutive failed login attempts allowed before IP flag.</p>
              <select
                id="setting-max-login-attempts"
                value={settings.max_login_attempts}
                onChange={(e) => setSettings({ ...settings, max_login_attempts: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-purple-600"
              >
                <option value="3">3 Attempts (Strict)</option>
                <option value="5">5 Attempts (Standard)</option>
                <option value="10">10 Attempts (Relaxed)</option>
              </select>
            </div>

            {/* Session Timeout Mins */}
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-2">
              <label className="block text-xs font-extrabold text-gray-800 uppercase">User Session Timeout</label>
              <p className="text-xs text-gray-500">Inactive user token expiration limit.</p>
              <select
                id="setting-session-timeout"
                value={settings.session_timeout_mins}
                onChange={(e) => setSettings({ ...settings, session_timeout_mins: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-purple-600"
              >
                <option value="30">30 Minutes</option>
                <option value="60">60 Minutes (Default)</option>
                <option value="120">120 Minutes</option>
                <option value="720">12 Hours</option>
              </select>
            </div>

            {/* Enforce TLS Security */}
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-2">
              <label className="block text-xs font-extrabold text-gray-800 uppercase">Enforce TLS 1.3 Transport Security</label>
              <p className="text-xs text-gray-500">Require encrypted TLS connections for payment gateways.</p>
              <select
                id="setting-enforce-tls"
                value={settings.enforce_tls}
                onChange={(e) => setSettings({ ...settings, enforce_tls: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-purple-600"
              >
                <option value="true">🔒 Enabled (TLS 1.3 Strict)</option>
                <option value="false">⚠️ Disabled (Dev Mode)</option>
              </select>
            </div>
          </div>

          {/* SMTP SERVER CONFIGURATION FOR AUTOMATED EMAIL TICKETS */}
          <div className="pt-6 border-t border-gray-200 space-y-4">
            <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
              ✉️ SMTP Automated Email Server Settings
            </h3>
            <p className="text-xs text-gray-500">
              Configure custom SMTP credentials (e.g. Gmail SMTP, Outlook, Brevo, Mailtrap) to dispatch automated PDF ticket emails to customer inboxes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700">SMTP Host</label>
                <input
                  type="text"
                  placeholder="e.g. smtp.gmail.com or smtp.mailtrap.io"
                  value={settings.smtp_host || ''}
                  onChange={(e) => setSettings({ ...settings, smtp_host: e.target.value })}
                  className="w-full mt-1 bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:bg-white focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700">SMTP Port</label>
                <input
                  type="text"
                  placeholder="587 or 465"
                  value={settings.smtp_port || ''}
                  onChange={(e) => setSettings({ ...settings, smtp_port: e.target.value })}
                  className="w-full mt-1 bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:bg-white focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700">SMTP Username / Email</label>
                <input
                  type="text"
                  placeholder="your-email@gmail.com"
                  value={settings.smtp_user || ''}
                  onChange={(e) => setSettings({ ...settings, smtp_user: e.target.value })}
                  className="w-full mt-1 bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:bg-white focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700">SMTP Password / App Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••••••"
                  value={settings.smtp_pass || ''}
                  onChange={(e) => setSettings({ ...settings, smtp_pass: e.target.value })}
                  className="w-full mt-1 bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:bg-white focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700">From Email Address</label>
                <input
                  type="email"
                  placeholder="noreply@eventease.com"
                  value={settings.smtp_from_email || ''}
                  onChange={(e) => setSettings({ ...settings, smtp_from_email: e.target.value })}
                  className="w-full mt-1 bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:bg-white focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700">Sender Display Name</label>
                <input
                  type="text"
                  placeholder="EventEase Ticketing"
                  value={settings.smtp_from_name || ''}
                  onChange={(e) => setSettings({ ...settings, smtp_from_name: e.target.value })}
                  className="w-full mt-1 bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:bg-white focus:outline-none focus:border-purple-600"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleTestSmtp}
              disabled={testingSmtp}
              className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
            >
              <FaServer /> {testingSmtp ? 'Testing Connection...' : 'Test Live SMTP Connection'}
            </button>
            <button
              type="submit"
              disabled={savingSettings}
              className="w-full sm:w-auto px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-purple-700/20 transition flex items-center justify-center gap-2"
            >
              <FaSync className={savingSettings ? 'animate-spin' : ''} /> {savingSettings ? 'Saving Policies...' : 'Save Security Policies'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
