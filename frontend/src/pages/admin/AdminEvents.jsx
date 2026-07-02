import { useEffect, useState } from "react";

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost/EventEase/backend/api/admin_events.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEvents(data.events);
        }

        setLoading(false);
      });
  }, []);

  const deleteEvent = (id) => {
    if (!window.confirm("Delete this event?")) {
      return;
    }

    fetch("http://localhost/EventEase/backend/api/admin_delete_event.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEvents((prevEvents) =>
            prevEvents.filter((event) => event.id !== id),
          );
        } else {
          if (data.success) {
            setEvents((prevEvents) =>
              prevEvents.filter((event) => event.id !== id),
            );

            alert("Event deleted successfully.");
          } else {
            alert(data.message);
          }
        }
      });
  };

  if (loading) {
    return <div className="p-10 text-xl">Loading Events...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-4xl font-bold text-purple-700 mb-8">Manage Events</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-purple-600 text-white">
            <tr>
              <th className="p-4 text-left">ID</th>

              <th className="p-4 text-left">Title</th>

              <th className="p-4 text-left">Organizer</th>

              <th className="p-4 text-left">Date</th>

              <th className="p-4 text-left">Location</th>

              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{event.id}</td>

                <td className="p-4">{event.title}</td>

                <td className="p-4">{event.organizer}</td>

                <td className="p-4">{event.event_date}</td>

                <td className="p-4">{event.location}</td>

                <td className="p-4">
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="
                      bg-red-600
                      hover:bg-red-700
                      text-white
                      px-4
                      py-2
                      rounded-lg
                    "
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminEvents;
