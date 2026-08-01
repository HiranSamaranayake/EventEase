import React, { useState, useEffect } from 'react';
import { 
  FaShieldAlt, 
  FaUserShield, 
  FaCoins, 
  FaHeadset, 
  FaPlus, 
  FaTrashAlt, 
  FaEdit, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaSearch, 
  FaUserCheck,
  FaUserPlus
} from 'react-icons/fa';

const ROLE_DESCRIPTIONS = {
  super_admin: {
    title: 'Super Admin',
    badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    icon: FaShieldAlt,
    color: 'from-purple-600 to-indigo-600',
    desc: 'Full platform access: Admin creation, platform configurations, database backup controls, system analytics & all permissions.'
  },
  support_admin: {
    title: 'Junior / Support Admin',
    badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: FaHeadset,
    color: 'from-blue-600 to-cyan-600',
    desc: 'Handles customer complaints, moderates event listings, reviews organizer requests, and manages customer support tickets.'
  },
  financial_admin: {
    title: 'Financial Admin',
    badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    icon: FaCoins,
    color: 'from-emerald-600 to-teal-600',
    desc: 'Monitors payments & transactions, processes customer refund requests, reviews revenue reports and handles payment disputes.'
  },
  security_admin: {
    title: 'Security Admin',
    badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    icon: FaUserShield,
    color: 'from-amber-600 to-rose-600',
    desc: 'Monitors suspicious activities, fraud detection alerts, user permission governance, security logs and access control policies.'
  }
};

const AdminSubAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [notification, setNotification] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    admin_role: 'support_admin'
  });

  useEffect(() => {
    fetchAdmins();
    fetchCandidates();
  }, []);

  const showFeedback = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 8000);
  };

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost/EventEase/backend/api/admin_subadmins.php');
      const data = await res.json();
      if (data.success) {
        setAdmins(data.data || []);
      } else {
        showFeedback(data.message || 'Failed to load sub-admins', 'error');
      }
    } catch (err) {
      console.error(err);
      showFeedback('Network error fetching admin users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidates = async () => {
    try {
      const res = await fetch('http://localhost/EventEase/backend/api/admin_subadmins.php?type=candidates');
      const data = await res.json();
      if (data.success) {
        setCandidates(data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingAdmin) {
        const res = await fetch('http://localhost/EventEase/backend/api/admin_subadmins.php', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingAdmin.id,
            admin_role: formData.admin_role
          })
        });
        const data = await res.json();
        setShowModal(false);
        setEditingAdmin(null);
        if (data.success) {
          showFeedback('Sub-Admin role updated successfully in database!', 'success');
          fetchAdmins();
        } else {
          showFeedback(data.message || 'Failed to update sub-admin role.', 'error');
        }
      } else if (modalMode === 'promote') {
        if (!selectedCandidateId) {
          setShowModal(false);
          showFeedback('Please select a registered user to promote.', 'error');
          return;
        }
        const res = await fetch('http://localhost/EventEase/backend/api/admin_subadmins.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'promote',
            user_id: selectedCandidateId,
            admin_role: formData.admin_role
          })
        });
        const data = await res.json();
        setShowModal(false);
        if (data.success) {
          showFeedback('Registered user promoted to Sub-Admin and saved to database!', 'success');
          setSelectedCandidateId('');
          fetchAdmins();
          fetchCandidates();
        } else {
          showFeedback(data.message || 'Failed to promote user.', 'error');
        }
      } else {
        const res = await fetch('http://localhost/EventEase/backend/api/admin_subadmins.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create',
            ...formData
          })
        });
        const data = await res.json();
        setShowModal(false);
        if (data.success) {
          showFeedback('New Sub-Admin account provisioned and saved to database!', 'success');
          setFormData({ full_name: '', email: '', phone: '', password: '', admin_role: 'support_admin' });
          fetchAdmins();
          fetchCandidates();
        } else {
          showFeedback(data.message || 'Failed to provision sub-admin.', 'error');
        }
      }
    } catch (err) {
      console.error(err);
      setShowModal(false);
      showFeedback('Error saving sub-admin to database.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to revoke sub-admin access for ${name}?`)) return;
    try {
      const res = await fetch(`http://localhost/EventEase/backend/api/admin_subadmins.php?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        showFeedback(`Sub-Admin ${name} access revoked.`);
        fetchAdmins();
        fetchCandidates();
      } else {
        showFeedback(data.message, 'error');
      }
    } catch (err) {
      showFeedback('Failed to remove sub-admin', 'error');
    }
  };

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRoleFilter === 'all' || admin.admin_role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleCounts = () => {
    return {
      super_admin: admins.filter(a => a.admin_role === 'super_admin').length,
      support_admin: admins.filter(a => a.admin_role === 'support_admin').length,
      financial_admin: admins.filter(a => a.admin_role === 'financial_admin').length,
      security_admin: admins.filter(a => a.admin_role === 'security_admin').length,
    };
  };

  const counts = getRoleCounts();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <FaShieldAlt className="text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-white">Sub-Admin Governance Center</h1>
          </div>
          <p className="text-slate-400 text-sm max-w-xl">
            Assign granular administrative roles (Super Admin, Support, Financial, Security) to existing users or provision new sub-admins.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingAdmin(null);
            setModalMode('create');
            setFormData({ full_name: '', email: '', phone: '', password: '', admin_role: 'support_admin' });
            setSelectedCandidateId('');
            setShowModal(true);
          }}
          className="mt-4 md:mt-0 flex items-center justify-center space-x-2 px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition duration-200"
        >
          <FaPlus />
          <span>Provision / Promote Sub-Admin</span>
        </button>
      </div>

      {notification && (
        <div className={`p-4 rounded-xl border flex items-center justify-between shadow-lg ${
          notification.type === 'error' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        }`}>
          <div className="flex items-center space-x-3">
            {notification.type === 'error' ? <FaExclamationTriangle className="text-lg flex-shrink-0" /> : <FaCheckCircle className="text-lg flex-shrink-0" />}
            <span className="font-medium text-sm">{notification.msg}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white font-bold ml-4">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.keys(ROLE_DESCRIPTIONS).map((roleKey) => {
          const roleInfo = ROLE_DESCRIPTIONS[roleKey];
          const IconComp = roleInfo.icon;
          const count = counts[roleKey] || 0;
          const isSelected = selectedRoleFilter === roleKey;

          return (
            <div
              key={roleKey}
              onClick={() => setSelectedRoleFilter(isSelected ? 'all' : roleKey)}
              className={`cursor-pointer p-5 rounded-2xl border transition-all duration-200 ${
                isSelected ? 'bg-slate-800 border-indigo-500 shadow-lg shadow-indigo-500/10 scale-[1.02]' : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${roleInfo.color} text-white shadow-md`}>
                  <IconComp className="text-lg" />
                </div>
                <span className="text-2xl font-bold text-white">{count}</span>
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">{roleInfo.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{roleInfo.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <FaSearch className="absolute left-3 top-3.5 text-slate-500 text-sm" />
          <input
            type="text"
            placeholder="Search sub-admin name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400">Filter Role:</span>
          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Sub-Admin Roles ({admins.length})</option>
            <option value="super_admin">Super Admins ({counts.super_admin})</option>
            <option value="support_admin">Junior / Support Admins ({counts.support_admin})</option>
            <option value="financial_admin">Financial Admins ({counts.financial_admin})</option>
            <option value="security_admin">Security Admins ({counts.security_admin})</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-3"></div>
            <p>Fetching Sub-Admin governance records...</p>
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FaUserCheck className="text-4xl text-slate-600 mx-auto mb-3" />
            <p className="text-lg font-medium text-slate-300">No sub-admins found matching criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-semibold">Administrator</th>
                  <th className="px-6 py-4 font-semibold">Sub-Admin Role & Privileges</th>
                  <th className="px-6 py-4 font-semibold">Contact Phone</th>
                  <th className="px-6 py-4 font-semibold">Created Date</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredAdmins.map((admin) => {
                  const roleConfig = ROLE_DESCRIPTIONS[admin.admin_role] || ROLE_DESCRIPTIONS.super_admin;
                  const IconComponent = roleConfig.icon;

                  return (
                    <tr key={admin.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white">
                            {admin.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{admin.full_name}</div>
                            <div className="text-xs text-slate-400">{admin.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${roleConfig.badge}`}>
                          <IconComponent className="text-xs" />
                          <span>{roleConfig.title}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {admin.phone || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {new Date(admin.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingAdmin(admin);
                            setFormData({
                              full_name: admin.full_name,
                              email: admin.email,
                              phone: admin.phone || '',
                              password: '',
                              admin_role: admin.admin_role
                            });
                            setShowModal(true);
                          }}
                          className="p-2 text-slate-400 hover:text-indigo-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                          title="Edit Sub-Admin Role"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(admin.id, admin.full_name)}
                          className="p-2 text-slate-400 hover:text-rose-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                          title="Revoke Admin Access"
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <FaShieldAlt className="text-indigo-400" />
                <span>
                  {editingAdmin 
                    ? `Update ${editingAdmin.full_name}` 
                    : modalMode === 'promote' 
                    ? 'Promote Existing User to Sub-Admin' 
                    : 'Provision New Sub-Admin Account'}
                </span>
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white text-lg font-bold">✕</button>
            </div>

            {!editingAdmin && (
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalMode('create')}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 transition ${
                    modalMode === 'create' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FaUserPlus />
                  <span>Provision New Account</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalMode('promote')}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 transition ${
                    modalMode === 'promote' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FaUserCheck />
                  <span>Promote Existing User ({candidates.length})</span>
                </button>
              </div>
            )}

            <form onSubmit={handleCreateOrUpdate} className="space-y-4">
              {!editingAdmin && modalMode === 'promote' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Select Registered User / Organizer to Promote</label>
                  {candidates.length === 0 ? (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                      No candidate non-admin users found in database.
                    </div>
                  ) : (
                    <select
                      required
                      value={selectedCandidateId}
                      onChange={(e) => setSelectedCandidateId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="">-- Choose User or Organizer --</option>
                      {candidates.map((cand) => (
                        <option key={cand.id} value={cand.id}>
                          {cand.full_name} ({cand.email}) — [{cand.role.toUpperCase()}]
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {!editingAdmin && modalMode === 'create' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="sarah@eventease.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
                      <input
                        type="text"
                        placeholder="0771234567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Account Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Designated Sub-Admin Role</label>
                <div className="grid grid-cols-1 gap-2.5 mt-2">
                  {Object.keys(ROLE_DESCRIPTIONS).map((roleKey) => {
                    const info = ROLE_DESCRIPTIONS[roleKey];
                    const isSelected = formData.admin_role === roleKey;
                    const Icon = info.icon;

                    return (
                      <div
                        key={roleKey}
                        onClick={() => setFormData({ ...formData, admin_role: roleKey })}
                        className={`cursor-pointer p-3 rounded-xl border flex items-start space-x-3 transition ${
                          isSelected ? 'bg-indigo-500/10 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${info.color} text-white mt-0.5`}>
                          <Icon className="text-sm" />
                        </div>
                        <div className="flex-1 text-xs">
                          <div className="font-semibold text-white text-sm">{info.title}</div>
                          <div className="text-slate-400 mt-0.5">{info.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg transition disabled:opacity-50 flex items-center space-x-2"
                >
                  {submitting && <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />}
                  <span>
                    {editingAdmin 
                      ? 'Save Role Changes' 
                      : modalMode === 'promote' 
                      ? 'Promote User to Sub-Admin' 
                      : 'Provision Sub-Admin'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubAdmins;
