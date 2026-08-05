import { useEffect, useState } from "react";

import { FaSearch, FaTrash, FaUserShield } from "react-icons/fa";

import { motion } from "framer-motion";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedSubRole, setSelectedSubRole] = useState("super_admin");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch("http://localhost/EventEase/backend/api/admin_users.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsers(data.users);
        }
        setLoading(false);
      });
  };

  const deleteUser = (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    fetch("http://localhost/EventEase/backend/api/delete_user.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsers(users.filter((user) => user.id !== id));
        } else {
          alert(data.message);
        }
      });
  };

  const handleUpdateAdminRole = () => {
    if (!selectedUser) return;

    fetch("http://localhost/EventEase/backend/api/update_admin_role.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: selectedUser.id,
        admin_role: selectedSubRole,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert(`Success: ${data.message}`);
          setSelectedUser(null);
          fetchUsers();
        } else {
          alert(`Error: ${data.message}`);
        }
      })
      .catch((err) => alert("Failed to update role"));
  };

  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.full_name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchRole = role === "all" ? true : user.role === role;

    return matchSearch && matchRole;
  });

  const getSubRoleBadge = (subRole) => {
    switch (subRole) {
      case "junior_admin":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">Support Admin</span>;
      case "financial_admin":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Financial Admin</span>;
      case "security_admin":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">Security Admin</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">Super Admin</span>;
    }
  };

  if (loading) {
    return <div className="p-10 text-xl font-medium text-slate-700">Loading Users...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-800">
        User Management & Admin Roles
      </h1>

      {/* SEARCH & FILTER */}
      <div className="bg-white rounded-2xl shadow p-5 flex flex-col md:flex-row gap-4">
        <div className="flex items-center border rounded-xl px-4 flex-1">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 outline-none"
          />
        </div>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border rounded-xl px-4 py-2 font-medium text-slate-700"
        >
          <option value="all">All Roles</option>
          <option value="customer">Customer</option>
          <option value="organizer">Organizer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-purple-700 text-white">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role / Level</th>
              <th className="p-4 text-left">Admin Sub-Role</th>
              <th className="p-4 text-left">Joined</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                className="border-b hover:bg-slate-50 transition"
              >
                <td className="p-4 font-semibold text-slate-600">#{user.id}</td>
                <td className="p-4 font-semibold text-slate-800">{user.full_name}</td>
                <td className="p-4 text-slate-600">{user.email}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                    user.role === 'organizer' ? 'bg-indigo-100 text-indigo-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  {user.role === 'admin' ? getSubRoleBadge(user.admin_role) : <span className="text-gray-400 text-xs">—</span>}
                </td>
                <td className="p-4 text-sm text-slate-500">{user.created_at?.split(' ')[0]}</td>
                <td className="p-4 flex gap-2">
                  <button
                    title="Assign Admin Sub-Role"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition"
                    onClick={() => {
                      setSelectedUser(user);
                      setSelectedSubRole(user.admin_role || "super_admin");
                    }}
                  >
                    <FaUserShield /> Role
                  </button>
                  <button
                    title="Delete User"
                    className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition"
                    onClick={() => deleteUser(user.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SUB-ROLE ASSIGNMENT MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FaUserShield className="text-purple-600" /> Configure Admin Sub-Role
            </h3>
            <p className="text-sm text-slate-500">
              Assign a specialized admin role to <strong>{selectedUser.full_name}</strong> according to the proposal governance specification (Page 15).
            </p>

            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold uppercase text-slate-500">Select Sub-Role:</label>
              <select
                value={selectedSubRole}
                onChange={(e) => setSelectedSubRole(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="super_admin">⚡ Super Admin (Full Platform Access)</option>
                <option value="junior_admin">🎧 Junior Admin / Support (Complaints & Moderation)</option>
                <option value="financial_admin">💳 Financial Admin (Payments & Refunds)</option>
                <option value="security_admin">🛡️ Security Admin (Fraud Monitoring & Audit Logs)</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateAdminRole}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-sm shadow transition"
              >
                Save Sub-Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
