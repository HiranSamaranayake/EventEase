import { useEffect, useState } from "react";

import {
  FaSearch,
  FaTrash,
  FaCheck,
  FaTimes,
  FaEye,
  FaSync,
} from "react-icons/fa";

const AdminEvents = () => {
  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  const [selectedEvent, setSelectedEvent] = useState(null);

  const [actionLoading, setActionLoading] = useState(false);

  const loadEvents = () => {
    setLoading(true);

    fetch("http://localhost/EventEase/backend/api/admin_events.php")
      .then((res) => res.json())

      .then((data) => {
        if (data.success) {
          setEvents(data.events);
        }

        setLoading(false);
      })

      .catch(() => {
        alert("Cannot load events");

        setLoading(false);
      });
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // DELETE EVENT

  const deleteEvent = (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    setActionLoading(true);

    fetch(
      "http://localhost/EventEase/backend/api/admin_delete_event.php",

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
          alert("Event deleted successfully");

          loadEvents();
        } else {
          alert(data.message);
        }

        setActionLoading(false);
      });
  };

  // APPROVE / REJECT

  const updateStatus = (id, status) => {
    setActionLoading(true);

    fetch(
      "http://localhost/EventEase/backend/api/admin_event_status.php",

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
          alert("Event status updated");

          loadEvents();
        } else {
          alert(data.message);
        }

        setActionLoading(false);
      });
  };

  // VIEW EVENT

  const viewEvent = (event) => {
    setSelectedEvent(event);
  };

  const filteredEvents = events.filter((event) => {
    const matchSearch =
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.location.toLowerCase().includes(search.toLowerCase());

    const matchStatus = filter === "all" ? true : event.status === filter;

    return matchSearch && matchStatus;
  });

  if (loading) {
    return <div className="p-10 text-xl">Loading Events...</div>;
  }

  return (
    <div>
      <div
        className="
flex
justify-between
items-center
mb-8
"
      >
        <h1
          className="
text-4xl
font-bold
text-purple-700
"
        >
          Manage Events
        </h1>

        <button
          onClick={loadEvents}
          className="
bg-purple-600
text-white
px-4
py-2
rounded-lg
flex
gap-2
items-center
"
        >
          <FaSync />
          Refresh
        </button>
      </div>

      <div
        className="
bg-white
p-5
rounded-xl
shadow
mb-6
flex
gap-4
"
      >
        <input
          className="
border
p-3
rounded-lg
flex-1
"
          placeholder="Search events"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="
border
rounded-lg
px-4
"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>

          <option value="pending">Pending</option>

          <option value="approved">Approved</option>

          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div
        className="
bg-white
rounded-xl
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
              <th className="p-4">ID</th>

              <th className="p-4">Title</th>

              <th className="p-4">Organizer</th>

              <th className="p-4">Date</th>

              <th className="p-4">Status</th>

              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredEvents.map((event) => (
              <tr
                key={event.id}
                className="
border-b
hover:bg-gray-50
"
              >
                <td className="p-4">{event.id}</td>

                <td className="p-4 font-semibold">{event.title}</td>

                <td className="p-4">{event.organizer}</td>

                <td className="p-4">{event.event_date}</td>

                <td className="p-4">
                  <span
                    className="
px-3
py-1
rounded-full
bg-gray-100
"
                  >
                    {event.status || "pending"}
                  </span>
                </td>

                <td
                  className="
p-4
flex
gap-2
"
                >
                  <button
                    onClick={() => viewEvent(event)}
                    className="
bg-blue-600
text-white
p-2
rounded-lg
"
                  >
                    <FaEye />
                  </button>

                  <button
                    disabled={actionLoading}
                    onClick={() => updateStatus(event.id, "approved")}
                    className="
bg-green-600
text-white
p-2
rounded-lg
"
                  >
                    <FaCheck />
                  </button>

                  <button
                    disabled={actionLoading}
                    onClick={() => updateStatus(event.id, "rejected")}
                    className="
bg-orange-500
text-white
p-2
rounded-lg
"
                  >
                    <FaTimes />
                  </button>

                  <button
                    disabled={actionLoading}
                    onClick={() => deleteEvent(event.id)}
                    className="
bg-red-600
text-white
p-2
rounded-lg
"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EVENT DETAILS MODAL */}

      {selectedEvent && (
        <div
          className="
fixed
inset-0
bg-black/50
flex
items-center
justify-center
"
        >
          <div
            className="
bg-white
rounded-xl
p-8
w-96
"
          >
            <h2
              className="
text-2xl
font-bold
mb-4
"
            >
              Event Details
            </h2>

            <p>
              <b>Name:</b> {selectedEvent.title}
            </p>

            <p>
              <b>Date:</b> {selectedEvent.event_date}
            </p>

            <p>
              <b>Location:</b> {selectedEvent.location}
            </p>

            <button
              onClick={() => setSelectedEvent(null)}
              className="
mt-5
bg-purple-600
text-white
px-4
py-2
rounded-lg
"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
