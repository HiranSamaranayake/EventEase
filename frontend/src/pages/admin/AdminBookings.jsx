import { useEffect, useState } from "react";

import {
  FaSearch,
  FaEye,
  FaTrash,
  FaTicketAlt,
  FaCalendarAlt,
  FaUsers,
} from "react-icons/fa";

import { motion } from "framer-motion";

const API = "http://localhost/EventEase/backend/api/";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await fetch(API + "admin_bookings.php");

      const data = await response.json();

      if (data.success) {
        setBookings(data.bookings);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);

      setLoading(false);
    }
  };

  const deleteBooking = async (id) => {
    const confirmDelete = window.confirm("Delete this booking?");

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        API + "admin_delete_booking.php",

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            id: id,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setBookings((prev) => prev.filter((booking) => booking.id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filteredBookings = bookings.filter((item) => {
    const text = `${item.customer}
${item.email}
${item.event}`.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  if (loading) {
    return (
      <div
        className="
p-10
text-xl
font-semibold
"
      >
        Loading bookings...
      </div>
    );
  }

  return (
    <div>
      <h1
        className="
text-4xl
font-bold
text-gray-800
mb-8
"
      >
        Booking Management
      </h1>

      {/* STATS */}

      <div
        className="
grid
grid-cols-1
md:grid-cols-3
gap-6
mb-10
"
      >
        <StatCard
          title="Total Bookings"
          value={bookings.length}
          icon={<FaTicketAlt />}
        />

        <StatCard
          title="Customers"
          value={new Set(bookings.map((item) => item.customer)).size}
          icon={<FaUsers />}
        />

        <StatCard
          title="Events Booked"
          value={new Set(bookings.map((item) => item.event)).size}
          icon={<FaCalendarAlt />}
        />
      </div>

      {/* SEARCH */}

      <div
        className="
bg-white
shadow
rounded-xl
p-5
mb-6
"
      >
        <div
          className="
flex
items-center
border
rounded-lg
px-4
"
        >
          <FaSearch
            className="
text-gray-400
"
          />

          <input
            className="
w-full
p-3
outline-none
"
            placeholder="
Search customer or event...
"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}

      <div
        className="
bg-white
rounded-2xl
shadow
overflow-x-auto
"
      >
        <table
          className="
w-full
"
        >
          <thead
            className="
bg-purple-600
text-white
"
          >
            <tr>
              <th className="p-4 text-left">ID</th>

              <th className="p-4 text-left">Customer</th>

              <th className="p-4 text-left">Event</th>

              <th className="p-4 text-left">Event Date</th>

              <th className="p-4 text-left">Booking Date</th>

              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="
text-center
p-10
text-gray-500
"
                >
                  No bookings found
                </td>
              </tr>
            ) : (
              filteredBookings.map((item) => (
                <tr
                  key={item.id}
                  className="
border-b
hover:bg-gray-50
"
                >
                  <td className="p-4">#{item.id}</td>

                  <td className="p-4">
                    <p className="font-semibold">{item.customer}</p>

                    <p
                      className="
text-sm
text-gray-500
"
                    >
                      {item.email}
                    </p>
                  </td>

                  <td className="p-4">{item.event}</td>

                  <td className="p-4">{item.event_date}</td>

                  <td className="p-4">{item.booking_date}</td>

                  <td
                    className="
p-4
flex
gap-2
"
                  >
                    <button
                      onClick={() => setSelected(item)}
                      className="
bg-blue-600
text-white
p-3
rounded-lg
hover:bg-blue-700
"
                    >
                      <FaEye />
                    </button>

                    <button
                      onClick={() => deleteBooking(item.id)}
                      className="
bg-red-600
text-white
p-3
rounded-lg
hover:bg-red-700
"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* VIEW MODAL */}

      {selected && (
        <div
          className="
fixed
inset-0
bg-black/40
flex
items-center
justify-center
z-50
"
        >
          <motion.div
            initial={{
              scale: 0.8,
            }}
            animate={{
              scale: 1,
            }}
            className="
bg-white
rounded-2xl
p-8
w-96
shadow-xl
"
          >
            <h2
              className="
text-2xl
font-bold
mb-5
"
            >
              Booking Details
            </h2>

            <p>
              <b>ID:</b> #{selected.id}
            </p>

            <p>
              <b>Customer:</b> {selected.customer}
            </p>

            <p>
              <b>Email:</b> {selected.email}
            </p>

            <p>
              <b>Event:</b> {selected.event}
            </p>

            <p>
              <b>Date:</b> {selected.event_date}
            </p>

            <p>
              <b>Booked:</b> {selected.booking_date}
            </p>

            <button
              onClick={() => setSelected(null)}
              className="
mt-6
bg-purple-600
text-white
px-5
py-2
rounded-lg
"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({
  title,

  value,

  icon,
}) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
      }}
      className="
bg-white
rounded-2xl
shadow
p-6
flex
justify-between
items-center
"
    >
      <div>
        <p
          className="
text-gray-500
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
text-purple-600
text-4xl
"
      >
        {icon}
      </div>
    </motion.div>
  );
};

export default AdminBookings;
