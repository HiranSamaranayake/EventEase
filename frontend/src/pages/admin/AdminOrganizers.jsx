import { useEffect, useState } from "react";

import { FaSearch, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

import { motion } from "framer-motion";

const AdminOrganizers = () => {
  const [organizers, setOrganizers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost/EventEase/backend/api/admin_organizers.php")
      .then((res) => res.json())

      .then((data) => {
        if (data.success) {
          setOrganizers(data.organizers);
        }

        setLoading(false);
      });
  }, []);

  const deleteOrganizer = (id) => {
    if (!window.confirm("Delete this organizer?")) return;

    fetch(
      "http://localhost/EventEase/backend/api/delete_organizer.php",

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
          setOrganizers(organizers.filter((item) => item.id !== id));
        }
      });
  };

  const changeStatus = (id, status) => {
    fetch(
      "http://localhost/EventEase/backend/api/update_organizer_status.php",

      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id: id,

          status: status,
        }),
      },
    )
      .then((res) => res.json())

      .then((data) => {
        if (data.success) {
          setOrganizers(
            organizers.map((org) =>
              org.id === id
                ? {
                    ...org,
                    status: status,
                  }
                : org,
            ),
          );
        }
      });
  };

  const filteredOrganizers = organizers.filter(
    (org) =>
      org.full_name.toLowerCase().includes(search.toLowerCase()) ||
      org.email.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return <div className="p-10 text-xl">Loading Organizers...</div>;
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
        Organizer Management
      </h1>

      <div
        className="
bg-white
rounded-2xl
shadow
p-5
mb-8
"
      >
        <div
          className="
flex
items-center
border
rounded-xl
px-4
"
        >
          <FaSearch className="text-gray-400" />

          <input
            placeholder="Search organizers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
w-full
p-3
outline-none
"
          />
        </div>
      </div>

      <div
        className="
bg-white
rounded-2xl
shadow
overflow-hidden
"
      >
        <table className="w-full">
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

              <th className="p-4 text-left">Events</th>

              <th className="p-4 text-left">Status</th>

              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrganizers.map((org, index) => (
              <motion.tr
                key={org.id}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.05,
                }}
                className="
border-b
hover:bg-gray-50
"
              >
                <td className="p-4">{org.id}</td>

                <td className="p-4 font-semibold">{org.full_name}</td>

                <td className="p-4">{org.email}</td>

                <td className="p-4">{org.events_count || 0}</td>

                <td className="p-4">
                  <span
                    className="
px-3
py-1
rounded-full
bg-yellow-100
text-yellow-700
"
                  >
                    {org.status || "pending"}
                  </span>
                </td>

                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => changeStatus(org.id, "approved")}
                    className="
bg-green-600
text-white
px-3
py-2
rounded-lg
"
                  >
                    <FaCheck />
                  </button>

                  <button
                    onClick={() => changeStatus(org.id, "rejected")}
                    className="
bg-orange-500
text-white
px-3
py-2
rounded-lg
"
                  >
                    <FaTimes />
                  </button>

                  <button
                    onClick={() => deleteOrganizer(org.id)}
                    className="
bg-red-600
text-white
px-3
py-2
rounded-lg
"
                  >
                    <FaTrash />
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

export default AdminOrganizers;
