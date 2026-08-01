import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaMoneyBillWave,
  FaTicketAlt,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
} from "react-icons/fa";

const MyEvents = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [events, setEvents] = useState([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All");

  const [loading, setLoading] = useState(true);

  // FETCH EVENTS

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const url = `http://localhost/EventEase/backend/api/my_events.php?user_id=${user.id}`;

      console.log("Fetching:", url);

      const response = await fetch(url);

      const data = await response.json();
      console.log("API Response:", data);

      console.log("MY EVENTS RESPONSE:", data);

      if (data.success) {
        setEvents(data.events);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.log("Fetch Events Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, []);

  // DELETE EVENT

  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;

    try {
      const response = await fetch(
        "http://localhost/EventEase/backend/api/delete_event.php",

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            event_id: id,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setEvents(events.filter((event) => event.id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filteredEvents = events.filter((event) => {
    const searchMatch = event.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const filterMatch = filter === "All" || event.status === filter;

    return searchMatch && filterMatch;
  });

  const totalRevenue = events.reduce(
    (sum, event) => sum + Number(event.revenue || 0),

    0,
  );

  const totalTickets = events.reduce(
    (sum, event) => sum + Number(event.tickets_sold || 0),

    0,
  );

  return (
    <div
      className="
min-h-screen
bg-gray-100
p-8
"
    >
      <h1
        className="
text-4xl
font-bold
text-purple-700
mb-8
"
      >
        My Events
      </h1>

      <div
        className="
grid
md:grid-cols-4
gap-6
mb-8
"
      >
        <Card
          icon={<FaCalendarAlt />}
          title="Total Events"
          value={events.length}
          color="from-purple-600 to-indigo-700"
        />

        <Card
          icon={<FaTicketAlt />}
          title="Tickets Sold"
          value={totalTickets}
          color="from-blue-600 to-cyan-600"
        />

        <Card
          icon={<FaMoneyBillWave />}
          title="Revenue"
          value={`Rs ${totalRevenue}`}
          color="from-green-500 to-emerald-700"
        />

        <Card
          icon={<FaCalendarAlt />}
          title="Upcoming"
          value={events.filter((event) => event.status === "Upcoming").length}
          color="from-orange-500 to-red-600"
        />
      </div>

      <div
        className="
bg-white
rounded-2xl
shadow
p-5
mb-8
flex
gap-4
flex-wrap
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
          <FaSearch />

          <input
            className="
outline-none
p-2
w-full
"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="
border
rounded-xl
px-4
"
        >
          <option>All</option>

          <option>Upcoming</option>

          <option>Completed</option>
        </select>
      </div>

      {loading ? (
        <div
          className="
text-center
text-xl
font-bold
"
        >
          Loading Events...
        </div>
      ) : (
        <div
          className="
grid
lg:grid-cols-3
gap-6
"
        >
          {filteredEvents.length === 0 ? (
            <div
              className="
col-span-full
bg-white
rounded-3xl
shadow
p-16
text-center
"
            >
              <div
                className="
text-7xl
"
              >
                🎉
              </div>

              <h2
                className="
text-3xl
font-bold
text-gray-700
mt-5
"
              >
                No Events Found
              </h2>

              <p
                className="
text-gray-500
mt-3
"
              >
                Create your first event
              </p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                }}
                className="
bg-white
rounded-3xl
shadow-lg
overflow-hidden
"
              >
                <img
                  src={
                    event.image
                      ? `http://localhost/EventEase/backend/uploads/${event.image}`
                      : "https://placehold.co/600x400"
                  }
                  className="
h-48
w-full
object-cover
"
                />

                <div className="p-6">
                  <h2
                    className="
text-2xl
font-bold
text-gray-800
"
                  >
                    {event.title}
                  </h2>

                  <span
                    className="
inline-block
mt-2
px-3
py-1
rounded-full
bg-purple-100
text-purple-700
text-xs
"
                  >
                    {event.category}
                  </span>

                  <div
                    className="
space-y-3
mt-5
text-gray-600
"
                  >
                    <p className="flex gap-3 items-center">
                      <FaCalendarAlt />

                      {event.event_date}
                    </p>

                    <p className="flex gap-3 items-center">
                      <FaMapMarkerAlt />

                      {event.location}
                    </p>

                    <p className="flex gap-3 items-center">
                      <FaMoneyBillWave />
                      Rs {event.price}
                    </p>

                    <p className="flex gap-3 items-center">
                      <FaUsers />
                      Capacity : {event.capacity}
                    </p>

                    <p className="flex gap-3 items-center">
                      <FaTicketAlt />
                      Sold : {event.tickets_sold || 0}
                    </p>
                  </div>

                  <div
                    className="
mt-6
bg-green-50
rounded-xl
p-4
flex
justify-between
"
                  >
                    <span>Revenue</span>

                    <b
                      className="
text-green-700
text-xl
"
                    >
                      Rs {event.revenue || 0}
                    </b>
                  </div>

                  <div
                    className="
flex
gap-2
mt-6
flex-wrap
"
                  >
                    <button
                      onClick={() =>
                        navigate(`/organizer/edit-event/${event.id}`)
                      }
                      className="
bg-yellow-500
hover:bg-yellow-600
text-white
px-4
py-2
rounded-xl
flex
items-center
gap-2
"
                    >
                      <FaEdit />
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/organizer/event-bookings/${event.id}`)
                      }
                      className="
bg-blue-600
hover:bg-blue-700
text-white
px-4
py-2
rounded-xl
flex
items-center
gap-2
"
                    >
                      <FaEye />
                      Bookings
                    </button>

                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="
bg-red-600
hover:bg-red-700
text-white
px-4
py-2
rounded-xl
flex
items-center
gap-2
"
                    >
                      <FaTrash />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const Card = ({ icon, title, value, color }) => (
  <motion.div
    whileHover={{
      y: -5,
      scale: 1.02,
    }}
    className={`
rounded-3xl
p-6
shadow-xl
text-white
bg-gradient-to-r
${color}
`}
  >
    <div
      className="
flex
justify-between
items-center
"
    >
      <div>
        <p
          className="
text-white/80
"
        >
          {title}
        </p>

        <h2
          className="
text-3xl
font-bold
mt-2
"
        >
          {value}
        </h2>
      </div>

      <div
        className="
text-4xl
bg-white/20
p-4
rounded-2xl
"
      >
        {icon}
      </div>
    </div>
  </motion.div>
);

export default MyEvents;
