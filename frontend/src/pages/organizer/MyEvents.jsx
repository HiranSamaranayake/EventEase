import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyEvents = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(
      `http://localhost/EventEase/backend/api/my_events.php?organizer_id=${user.id}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEvents(data.events);
        }
      });
  }, []);

  const deleteEvent = (eventId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?",
    );

    if (!confirmDelete) {
      return;
    }

    fetch("http://localhost/EventEase/backend/api/delete_event.php", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        event_id: eventId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEvents(events.filter((event) => event.id != eventId));
        } else {
          alert(data.message);
        }
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-purple-700 mb-8">My Events</h1>

      {events.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow">
          <h2 className="text-xl text-gray-500 text-center">
            No events found.
          </h2>
        </div>
      ) : (
        <div className="grid gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white shadow-lg rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-purple-700">
                {event.title}
              </h2>

              <p className="mt-3 text-gray-600">{event.description}</p>

              <p className="mt-4">📅 {event.event_date}</p>

              <p>📍 {event.location}</p>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => navigate(`/edit-event/${event.id}`)}
                  className="bg-yellow-500 text-white px-5 py-2 rounded-lg hover:bg-yellow-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteEvent(event.id)}
                  className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>

                <button
                  onClick={() => navigate(`/event-bookings/${event.id}`)}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                >
                  View Bookings
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEvents;
