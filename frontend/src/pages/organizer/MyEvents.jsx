import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaMoneyBillWave,
  FaTag,
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

  const deleteEvent = (id) => {
    if (!window.confirm("Delete this event?")) return;

    fetch("http://localhost/EventEase/backend/api/delete_event.php", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        event_id: id,
      }),
    })
      .then((res) => res.json())

      .then((data) => {
        if (data.success) {
          setEvents(events.filter((e) => e.id !== id));
        }
      });
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter = filter === "All" || event.status === filter;

    return matchesSearch && matchesFilter;
  });

  const totalRevenue = events.reduce((sum, e) => sum + Number(e.revenue), 0);

  const totalTickets = events.reduce(
    (sum, e) => sum + Number(e.tickets_sold),
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

      {/* SUMMARY */}

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
          value={events.filter((e) => e.status === "Upcoming").length}
          color="from-orange-500 to-red-600"
        />
      </div>

      {/* SEARCH FILTER */}

      <div
        className="
bg-white
p-5
rounded-2xl
shadow
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
rounded-lg
px-4
flex-1
"
        >
          <FaSearch />

          <input
            placeholder="Search events..."
            className="
outline-none
p-2
w-full
"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="
border
rounded-lg
px-4
"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>All</option>

          <option>Upcoming</option>

          <option>Completed</option>
        </select>
      </div>

      {/* EVENTS */}

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
      shadow-lg
      p-16
      text-center
      "
    >
      <div className="text-7xl mb-6">
        🎉
      </div>

      <h2 className="text-3xl font-bold text-gray-700">
        No Events Found
      </h2>

      <p className="text-gray-500 mt-4">
        Try changing the search or create a new event.
      </p>
    </div>

  ) : (

    filteredEvents.map((event) => (
       <motion.div
  key={event.id}
  initial={{
    opacity: 0,
    y: 30,
  }}
  animate={{
    opacity: 1,
    y: 0,
  }}
  transition={{
    duration: 0.4,
  }}
  whileHover={{
    y: -8,
    scale: 1.02,
  }}
  className="
bg-white
rounded-3xl
shadow-lg
overflow-hidden
transition-all
duration-300
"
>
            <img
             src={
  event.image
    ? `http://localhost/EventEase/backend/uploads/${event.image}`
    : "https://placehold.co/600x400?text=EventEase"
}
              className="
h-48
w-full
object-cover
"
            />

            <div
              className="
p-6
"
            >
              <div
                className="
flex
justify-between
"
              >
                <div>
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
font-semibold
"
                  >
                    {event.category}
                  </span>
                </div>

                <span
                  className="
bg-green-100
text-green-700
px-3
py-1
rounded-full
text-sm
"
                >
                  {event.status}
                </span>
              </div>

              <div className="space-y-3 mt-5">
                <div className="flex items-center gap-3 text-gray-600">
                  <FaCalendarAlt className="text-purple-600" />
                  <span>{event.event_date}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <FaMapMarkerAlt className="text-red-500" />
                  <span>{event.location}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <FaMoneyBillWave className="text-green-600" />
                  <span>Rs {event.price}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <FaUsers className="text-blue-600" />
                  <span>Capacity : {event.capacity}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <FaTicketAlt className="text-orange-500" />
                  <span>Sold : {event.tickets_sold}</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Occupancy</span>

                  <span className="font-bold">{event.occupancy}%</span>
                </div>

                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="
h-full
bg-gradient-to-r
from-purple-500
to-pink-500
rounded-full
transition-all
duration-700
"
                    style={{
                      width: `${event.occupancy}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div
                className="
mt-6
rounded-2xl
bg-gradient-to-r
from-green-50
to-emerald-50
border
border-green-100
p-4
flex
justify-between
items-center
"
              >
                <span className="text-gray-600">Revenue</span>

                <span
                  className="
text-2xl
font-bold
text-green-700
"
                >
                  Rs {event.revenue}
                </span>
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
  onClick={() => navigate(`/organizer/edit-event/${event.id}`)}
  className="
flex
items-center
gap-2
bg-yellow-500
hover:bg-yellow-600
text-white
px-4
py-2
rounded-xl
transition
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
flex
items-center
gap-2
bg-blue-600
hover:bg-blue-700
text-white
px-4
py-2
rounded-xl
transition
"
>
  <FaEye />
  Bookings
</button>

              <button
  onClick={() => deleteEvent(event.id)}
  className="
flex
items-center
gap-2
bg-red-600
hover:bg-red-700
text-white
px-4
py-2
rounded-xl
transition
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
    </div>
  );
};

const Card = ({ icon, title, value, color }) => (
  <motion.div
    whileHover={{
      y: -6,
      scale: 1.02,
    }}
    className={`
      rounded-3xl
      p-6
      shadow-xl
      text-white
      bg-gradient-to-r
      ${color}
      overflow-hidden
      relative
    `}
  >
    {/* Background Circle */}

    <div
      className="
      absolute
      -right-8
      -top-8
      w-28
      h-28
      rounded-full
      bg-white/10
    "
    />

    <div className="flex justify-between items-center relative z-10">
      <div>
        <p className="text-white/80 text-sm">{title}</p>

        <h2 className="text-3xl font-bold mt-2">{value}</h2>
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
