import { useEffect, useState } from "react";

import { FaSearch, FaTrash, FaUserShield } from "react-icons/fa";

import { motion } from "framer-motion";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [role, setRole] = useState("all");

  useEffect(() => {
    fetch("http://localhost/EventEase/backend/api/admin_users.php")
      .then((res) => res.json())

      .then((data) => {
        if (data.success) {
          setUsers(data.users);
        }

        setLoading(false);
      });
  }, []);

  const deleteUser = (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    fetch(
      "http://localhost/EventEase/backend/api/delete_user.php",

      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id: id,
        }),
      },
    )
      .then((res) => res.json())

      .then((data) => {
        if (data.success) {
          setUsers(users.filter((user) => user.id !== id));
        } else {
          alert(data.message);
        }
      });
  };

  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.full_name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchRole = role === "all" ? true : user.role === role;

    return matchSearch && matchRole;
  });

  if (loading) {
    return <div className="p-10 text-xl">Loading Users...</div>;
  }

  return (
    <div>
      <h1
        className="
text-4xl
font-bold
mb-8
text-gray-800
"
      >
        User Management
      </h1>

      {/* SEARCH AREA */}

      <div
        className="
bg-white
rounded-2xl
shadow
p-5
mb-8
flex
flex-col
md:flex-row
gap-4
"
      >
        <div
          className="
flex
items-center
border
rounded-xl
px-4
flex-1
"
        >
          <FaSearch className="text-gray-400" />

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
w-full
p-3
outline-none
"
          />
        </div>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="
border
rounded-xl
px-4
"
        >
          <option value="all">All Roles</option>

          <option value="customer">Customer</option>

          <option value="organizer">Organizer</option>

          <option value="admin">Admin</option>
        </select>
      </div>

      {/* TABLE */}

      <div
        className="
bg-white
rounded-2xl
shadow
overflow-hidden
"
      >
        <table
          className="
w-full
"
        >
          <thead
            className="
bg-purple-700
text-white
"
          >
            <tr>
              <th className="p-4 text-left">ID</th>

              <th className="p-4 text-left">Name</th>

              <th className="p-4 text-left">Email</th>

              <th className="p-4 text-left">Role</th>

              <th className="p-4 text-left">Date</th>

              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user, index) => (
              <motion.tr
                key={user.id}
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  delay: index * 0.05,
                }}
                className="
border-b
hover:bg-gray-50
"
              >
                <td className="p-4">{user.id}</td>

                <td className="p-4 font-semibold">{user.full_name}</td>

                <td className="p-4">{user.email}</td>

                <td className="p-4">
                  <span
                    className="
px-3
py-1
rounded-full
bg-purple-100
text-purple-700
text-sm
"
                  >
                    {user.role}
                  </span>
                </td>

                <td className="p-4">{user.created_at}</td>

                <td className="p-4 flex gap-3">
                  <button
                    className="
bg-red-600
text-white
px-4
py-2
rounded-lg
hover:bg-red-700
"
                    onClick={() => deleteUser(user.id)}
                  >
                    <FaTrash />
                  </button>

                  <button
                    className="
bg-blue-600
text-white
px-4
py-2
rounded-lg
"
                  >
                    <FaUserShield />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
