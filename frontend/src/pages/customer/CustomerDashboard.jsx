import { useEffect, useState } from "react";

import DashboardLayout from "../../components/DashboardLayout";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";

import {
  FaCalendarCheck,
  FaTicketAlt,
  FaClock,
  FaWallet,
  FaArrowUp,
  FaChartLine,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaStar,
  FaUserCircle,
  FaEdit,
  FaTrash,
  FaBell,
  FaCheckCircle,
  FaHeart,
  FaBookmark
} from "react-icons/fa";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const CustomerDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  /*
 ===========================
 DASHBOARD STATES
 ===========================
*/

  const [stats, setStats] = useState({
    totalBookings: 0,

    upcomingEvents: 0,

    totalTickets: 0,

    totalSpent: 0,
  });

  const [bookings, setBookings] = useState([]);

  const [tickets, setTickets] = useState([]);

  const [bookingChart, setBookingChart] = useState([]);

  const [ticketChart, setTicketChart] = useState([]);

  const [recommendations, setRecommendations] = useState([]);

  const [loading, setLoading] = useState(true);

  /*
 ===========================
 SEARCH + PAGINATION
 ===========================
*/

  const [searchBooking, setSearchBooking] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const bookingsPerPage = 5;

  /*
 ===========================
 MODALS
 ===========================
*/

  const [selectedBooking, setSelectedBooking] = useState(null);

  const [selectedTicket, setSelectedTicket] = useState(null);

  const [editProfile, setEditProfile] = useState(false);

  /*
 ===========================
 PROFILE DATA
 ===========================
*/

  const [profile, setProfile] = useState({
    full_name: user?.full_name || "",

    email: user?.email || "",

    phone: user?.phone || "",
  });

  /*
 ===========================
 COLORS
 ===========================
*/

  const COLORS = ["#8B5CF6", "#3B82F6", "#10B981", "#F59E0B"];

  /*
 ===========================
 FILTER BOOKINGS
 ===========================
*/

  const filteredBookings = bookings.filter((booking) =>
    booking.title

      ?.toLowerCase()

      .includes(searchBooking.toLowerCase()),
  );

  const indexLast = currentPage * bookingsPerPage;

  const indexFirst = indexLast - bookingsPerPage;

  const currentBookings = filteredBookings.slice(
    indexFirst,

    indexLast,
  );

  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  /*
 ===========================
 GREETING
 ===========================
*/

  const hour = new Date().getHours();

  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  const today = new Date().toLocaleDateString(
    "en-US",

    {
      weekday: "long",

      year: "numeric",

      month: "long",

      day: "numeric",
    },
  );

  /*
 ===========================
 LOAD DASHBOARD DATA
 ===========================
*/

  useEffect(() => {
    if (!user) return;

    const loadDashboard = async () => {
      try {
        const [
          statsRes,

          bookingRes,

          ticketRes,

          bookingChartRes,

          ticketChartRes,
          
          recommendRes
        ] = await Promise.all([
          fetch(
            "http://localhost/EventEase/backend/api/customer_dashboard.php",
          ),

          fetch(
            `http://localhost/EventEase/backend/api/my_bookings.php?user_id=${user.id}`,
          ),

          fetch(
            `http://localhost/EventEase/backend/api/my_tickets.php?user_id=${user.id}`,
          ),

          fetch(
            `http://localhost/EventEase/backend/api/customer_booking_chart.php?user_id=${user.id}`,
          ),

          fetch(
            `http://localhost/EventEase/backend/api/customer_ticket_chart.php?user_id=${user.id}`,
          ),
          
          fetch(
            `http://localhost/EventEase/backend/api/event_recommendations.php?user_id=${user.id}`,
          ),
        ]);

        const statsData = await statsRes.json();

        const bookingData = await bookingRes.json();

        const ticketData = await ticketRes.json();

        const bookingChartData = await bookingChartRes.json();

        const ticketChartData = await ticketChartRes.json();
        
        const recommendData = await recommendRes.json();

        if (statsData.success) {
          setStats({
            totalBookings: statsData.totalBookings || 0,

            upcomingEvents: statsData.upcomingEvents || 0,

            totalTickets: statsData.totalTickets || 0,

            totalSpent: statsData.totalSpent || 0,
          });
        }

        if (bookingData.success) setBookings(bookingData.bookings || []);

        if (ticketData.success) setTickets(ticketData.tickets || []);

        if (bookingChartData.success)
          setBookingChart(bookingChartData.chart || []);

        if (ticketChartData.success)
          setTicketChart(ticketChartData.chart || []);
          
        if (recommendData.success)
          setRecommendations(recommendData.recommendations || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  /*
 ===========================
 DELETE BOOKING
 ===========================
*/

  const deleteBooking = async (id) => {
    const confirmDelete = window.confirm("Remove this booking?");

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost/EventEase/backend/api/delete_booking.php?id=${id}`,

        {
          method: "DELETE",
        },
      );

      const data = await res.json();

      if (data.success) {
        setBookings(bookings.filter((item) => item.id !== id));

        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  /*
 ===========================
 DELETE TICKET
 ===========================
*/

  const deleteTicket = async (id) => {
    const confirmDelete = window.confirm("Remove this ticket?");

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost/EventEase/backend/api/delete_ticket.php?id=${id}`,

        {
          method: "DELETE",
        },
      );

      const data = await res.json();

      if (data.success) {
        setTickets(tickets.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.log(err);
    }
  };

  /*
 ===========================
 PROFILE UPDATE
 ===========================
*/

  const updateProfile = async () => {
    try {
      const res = await fetch(
        "http://localhost/EventEase/backend/api/update_profile.php",

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            id: user.id,

            ...profile,
          }),
        },
      );

      const data = await res.json();

      if (data.success) {
        localStorage.setItem(
          "user",

          JSON.stringify({
            ...user,

            ...profile,
          }),
        );

        setEditProfile(false);

        alert("Profile updated");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const statCards = [
    {
      title: "Total Bookings",

      value: stats.totalBookings,

      icon: <FaCalendarCheck />,

      gradient: "from-purple-600 to-indigo-700",

      change: "+12%",
    },

    {
      title: "Upcoming Events",

      value: stats.upcomingEvents,

      icon: <FaClock />,

      gradient: "from-blue-500 to-cyan-600",

      change: "Live",
    },

    {
      title: "Active Tickets",

      value: stats.totalTickets,

      icon: <FaTicketAlt />,

      gradient: "from-green-500 to-emerald-600",

      change: "Ready",
    },

    {
      title: "Total Spent",

      value: `$${stats.totalSpent}`,

      icon: <FaWallet />,

      gradient: "from-orange-500 to-red-600",

      change: "+8%",
    },
  ];
  return (
    <DashboardLayout>
      <div
        className="
space-y-8
"
      >
        {/* ================= HERO ================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="
rounded-[2rem]
p-10
bg-gradient-to-br
from-purple-700
via-indigo-700
to-blue-700
text-white
shadow-2xl
relative
overflow-hidden
"
        >
          <div
            className="
absolute
right-[-100px]
top-[-100px]
w-80
h-80
rounded-full
bg-white/10
"
          ></div>

          <div
            className="
relative
z-10
flex
flex-col
lg:flex-row
justify-between
gap-8
items-center
"
          >
            <div>
              <h1
                className="
text-5xl
font-black
"
              >
                {greeting}, {user?.full_name?.split(" ")[0]}
                👋
              </h1>

              <p
                className="
mt-4
text-xl
text-purple-100
"
              >
                Manage your events, tickets and experiences easily.
              </p>

              <p
                className="
mt-3
text-purple-200
"
              >
                {today}
              </p>

              <div
                className="
flex
gap-4
mt-8
"
              >
                <button
                  onClick={() => navigate("/")}
                  className="
bg-white
text-purple-700
px-7
py-3
rounded-2xl
font-bold
hover:scale-105
transition
flex
items-center
gap-2
"
                >
                  <FaHome />
                  Return Home
                </button>

                <button
                  onClick={() => navigate("/saved-events")}
                  className="
bg-rose-500
hover:bg-rose-600
text-white
px-7
py-3
rounded-2xl
font-bold
hover:scale-105
transition
flex
items-center
gap-2
shadow-lg
"
                >
                  <FaHeart />
                  My Saved Wishlist
                </button>

                {/* <button
                  className="
border
border-white/40
bg-white/10
px-7
py-3
rounded-2xl
font-bold
"
                >
                  My Tickets
                </button> */}
              </div>
            </div>

            <div
              className="
bg-white/10
backdrop-blur-xl
border
border-white/20
rounded-3xl
p-7
"
            >
              <div
                className="
flex
items-center
gap-4
"
              >
                <FaStar
                  className="
text-yellow-300
text-4xl
"
                />

                <div>
                  <p
                    className="
text-purple-200
"
                  >
                    Customer Rating
                  </p>

                  <h2
                    className="
text-4xl
font-black
"
                  >
                    4.9
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ================= PROFILE + NOTIFICATION ================= */}

        <div
          className="
grid
grid-cols-1
lg:grid-cols-3
gap-6
"
        >
          {/* PROFILE CARD */}

          <div
            className="
bg-white
rounded-3xl
shadow-xl
p-7
"
          >
            <div
              className="
flex
items-center
gap-4
"
            >
              <FaUserCircle
                className="
text-purple-600
text-6xl
"
              />

              <div>
                <h2
                  className="
text-xl
font-black
"
                >
                  {profile.full_name}
                </h2>

                <p
                  className="
text-gray-500
"
                >
                  {profile.email}
                </p>
              </div>
            </div>

            <button
              onClick={() => setEditProfile(true)}
              className="
mt-6
w-full
bg-purple-600
text-white
py-3
rounded-xl
font-bold
flex
justify-center
items-center
gap-2
"
            >
              <FaEdit />
              Edit Profile
            </button>
          </div>

          {/* NOTIFICATION */}

          <div
            className="
bg-white
rounded-3xl
shadow-xl
p-7
"
          >
            <div
              className="
flex
items-center
gap-3
"
            >
              <FaBell
                className="
text-purple-600
text-3xl
"
              />

              <h2
                className="
text-xl
font-black
"
              >
                Notifications
              </h2>
            </div>

            <div
              className="
mt-6
space-y-4
"
            >
              <div
                className="
bg-green-50
p-4
rounded-xl
flex
gap-3
"
              >
                <FaCheckCircle
                  className="
text-green-600
"
                />

                <p>Your ticket is ready</p>
              </div>

              <div
                className="
bg-purple-50
p-4
rounded-xl
"
              >
                Upcoming event reminder
              </div>
            </div>
          </div>

          {/* QUICK INFO */}

          <div
            className="
bg-gradient-to-br
from-indigo-600
to-purple-700
rounded-3xl
text-white
p-7
"
          >
            <h2
              className="
text-xl
font-black
"
            >
              EventEase Plus
            </h2>

            <p
              className="
mt-4
text-purple-100
"
            >
              Enjoy faster booking, digital tickets and exclusive events.
            </p>
          </div>
        </div>

        {/* ================= STAT CARDS ================= */}

        <div
          className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-4
gap-6
"
        >
          {statCards.map((card, index) => (
            <motion.div
              key={index}
              whileHover={{
                y: -8,
              }}
              className={`

rounded-3xl
p-7
text-white
shadow-xl
bg-gradient-to-br

${card.gradient}

`}
            >
              <div
                className="
flex
justify-between
"
              >
                <div
                  className="
text-4xl
"
                >
                  {card.icon}
                </div>

                <span
                  className="
bg-white/20
px-3
py-1
rounded-full
"
                >
                  {card.change}
                </span>
              </div>

              <p
                className="
mt-8
opacity-80
"
              >
                {card.title}
              </p>

              <h2
                className="
text-5xl
font-black
mt-2
"
              >
                {card.value}
              </h2>

              <div
                className="
flex
gap-2
mt-4
text-sm
"
              >
                <FaArrowUp />
                Growing
              </div>
            </motion.div>
          ))}
        </div>

        {/* ================= RECOMMENDED EVENTS FOR YOU ================= */}
        {recommendations.length > 0 && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <FaStar className="text-amber-500" /> Recommended For You
                </h2>
                <p className="text-gray-500 text-sm mt-0.5">
                  Hand-picked events tailored to your favorite categories and booking interests.
                </p>
              </div>
              <button
                onClick={() => navigate("/events")}
                className="text-sm font-bold text-purple-700 hover:text-purple-900 hover:underline"
              >
                View All Events →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => navigate(`/event/${rec.id}`)}
                  className="bg-slate-50 rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition cursor-pointer group flex flex-col justify-between"
                >
                  <div className="relative h-40 bg-slate-800">
                    {rec.image ? (
                      <img
                        src={`http://localhost/EventEase/backend/uploads/${rec.image}`}
                        alt={rec.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="w-full h-full bg-purple-900 flex items-center justify-center text-white text-3xl">
                        🎟️
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-purple-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                      {rec.category || "General"}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-purple-700 transition line-clamp-1">
                        {rec.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                        <FaCalendarAlt className="text-indigo-500" />
                        <span>{rec.event_date}</span>
                        <span className="mx-1">•</span>
                        <FaMapMarkerAlt className="text-rose-500" />
                        <span className="line-clamp-1">{rec.location || "TBD"}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <span className="font-extrabold text-sm text-gray-900">
                        {parseFloat(rec.price) > 0 ? `LKR ${parseFloat(rec.price).toLocaleString()}` : "Free"}
                      </span>
                      <span className="text-xs font-bold text-purple-700 group-hover:translate-x-1 transition flex items-center gap-1">
                        Book <FaTicketAlt className="text-xs" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= CHARTS ================= */}

        <div
          className="
grid
grid-cols-1
xl:grid-cols-2
gap-8
"
        >
          <div
            className="
bg-white
rounded-3xl
shadow-xl
p-8
"
          >
            <h2
              className="
text-2xl
font-black
mb-6
"
            >
              📈 Booking Analytics
            </h2>

            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={bookingChart}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="#8B5CF6"
                  fill="#DDD6FE"
                  strokeWidth={4}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div
            className="
bg-white
rounded-3xl
shadow-xl
p-8
"
          >
            <h2
              className="
text-2xl
font-black
mb-6
"
            >
              🎫 Ticket Analytics
            </h2>

            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={ticketChart}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  label
                >
                  {ticketChart.map((item, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ================= BOOKING TABLE ================= */}

        <div
          className="
bg-white
rounded-3xl
shadow-xl
p-8
"
        >
          <div
            className="
flex
flex-col
md:flex-row
justify-between
gap-5
mb-8
"
          >
            <h2
              className="
text-2xl
font-black
"
            >
              📋 My Bookings
            </h2>

            <input
              value={searchBooking}
              onChange={(e) => setSearchBooking(e.target.value)}
              placeholder="
Search booking...
"
              className="
border
rounded-xl
px-5
py-3
outline-none
focus:ring-2
focus:ring-purple-500
"
            />
          </div>

          <div
            className="
overflow-x-auto
"
          >
            <table
              className="
w-full
"
            >
              <thead>
                <tr
                  className="
border-b
text-gray-500
"
                >
                  <th className="p-4 text-left">ID</th>

                  <th className="p-4 text-left">Event</th>

                  <th className="p-4 text-left">Date</th>

                  <th className="p-4 text-left">Status</th>

                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentBookings.length > 0 ? (
                  currentBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="
border-b
hover:bg-purple-50
transition
"
                    >
                      <td className="p-4">#{booking.id}</td>

                      <td className="p-4 font-semibold">{booking.title}</td>

                      <td className="p-4">
                        {new Date(booking.booking_date).toLocaleDateString()}
                      </td>

                      <td className="p-4">
                        <span
                          className={`
px-4
py-1
rounded-full
font-semibold

${
  booking.booking_status === "Confirmed"
    ? "bg-green-100 text-green-700"
    : booking.booking_status === "Pending"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700"
}
`}
                        >
                          {booking.booking_status}
                        </span>
                      </td>

                      <td
                        className="
p-4
"
                      >
                        <div
                          className="
flex
justify-center
gap-2
"
                        >
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="
bg-purple-600
text-white
px-4
py-2
rounded-xl
"
                          >
                            View
                          </button>

                          <button
                            onClick={() => deleteBooking(booking.id)}
                            className="
bg-red-500
text-white
px-4
py-2
rounded-xl
"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="
text-center
p-8
text-gray-500
"
                    >
                      No bookings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div
            className="
flex
justify-between
items-center
mt-6
"
          >
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="
bg-gray-200
px-5
py-2
rounded-xl
disabled:opacity-40
"
            >
              ← Previous
            </button>

            <p
              className="
font-bold
"
            >
              Page {currentPage} / {totalPages || 1}
            </p>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="
bg-purple-600
text-white
px-5
py-2
rounded-xl
disabled:opacity-40
"
            >
              Next →
            </button>
          </div>
        </div>

        {/* ================= TICKET WALLET =================

        <div
          className="
bg-white
rounded-3xl
shadow-xl
p-8
"
        >
          <div
            className="
flex
justify-between
mb-8
"
          >
            <h2
              className="
text-2xl
font-black
"
            >
              🎫 My Ticket Wallet
            </h2>

            <span
              className="
bg-purple-100
text-purple-700
px-4
py-2
rounded-full
font-bold
"
            >
              {tickets.length}
            </span>
          </div>

          <div
            className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-3
gap-6
"
          >
            {tickets.map((ticket) => (
              <motion.div
                key={ticket.id}
                whileHover={{
                  y: -8,
                }}
                className="
border
rounded-3xl
p-6
bg-gradient-to-br
from-white
to-purple-50
shadow-md
"
              >
                <div
                  className="
flex
justify-between
"
                >
                  <div>
                    <h3
                      className="
text-xl
font-black
"
                    >
                      {ticket.title}
                    </h3>

                    <p
                      className="
text-gray-500
"
                    >
                      {ticket.event_date}
                    </p>
                  </div>

                  <FaTicketAlt
                    className="
text-purple-600
text-3xl
"
                  />
                </div>

                <p
                  className="
mt-5
bg-purple-100
p-3
rounded-xl
font-bold
text-purple-700
"
                >
                  {ticket.ticket_code}
                </p>

                <div
                  className="
flex
gap-3
mt-5
"
                >
                  <button
                    onClick={() => setSelectedTicket(ticket)}
                    className="
flex-1
bg-purple-600
text-white
py-3
rounded-xl
font-bold
"
                  >
                    QR Ticket
                  </button>

                  <button
                    onClick={() => deleteTicket(ticket.id)}
                    className="
bg-red-500
text-white
px-5
rounded-xl
"
                  >
                    <FaTrash />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div> */}
        {/* ================= BOOKING DETAILS MODAL ================= */}

        {selectedBooking && (
          <div
            className="
fixed
inset-0
bg-black/60
flex
items-center
justify-center
z-50
px-4
"
          >
            <div
              className="
bg-white
rounded-3xl
p-8
max-w-lg
w-full
"
            >
              <h2
                className="
text-3xl
font-black
mb-6
text-purple-700
"
              >
                Booking Details
              </h2>

              <div className="space-y-4">
                <p>
                  <strong>Booking ID:</strong> #{selectedBooking.id}
                </p>

                <p>
                  <strong>Event:</strong> {selectedBooking.title}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedBooking.booking_date).toLocaleString()}
                </p>

                <p>
                  <strong>Status:</strong> {selectedBooking.status}
                </p>
              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                className="
mt-8
w-full
bg-purple-600
text-white
py-3
rounded-xl
font-bold
"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* ================= QR MODAL ================= */}

        {selectedTicket && (
          <div
            className="
fixed
inset-0
bg-black/60
flex
items-center
justify-center
z-50
px-4
"
          >
            <div
              className="
bg-white
rounded-3xl
p-8
max-w-md
w-full
text-center
"
            >
              <h2
                className="
text-2xl
font-black
"
              >
                {selectedTicket.title}
              </h2>

              <img
                src={`http://localhost/EventEase/backend/${selectedTicket.qr_code}`}
                className="
w-56
h-56
mx-auto
mt-6
"
                alt="QR"
              />

              <a
                href={`http://localhost/EventEase/backend/api/download_ticket.php?id=${selectedTicket.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="
block
bg-purple-600
text-white
py-3
rounded-xl
mt-6
font-bold
"
              >
                Download PDF
              </a>

              <button
                onClick={() => setSelectedTicket(null)}
                className="
mt-4
bg-gray-200
px-6
py-3
rounded-xl
"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* ================= EDIT PROFILE MODAL ================= */}

        {editProfile && (
          <div
            className="
fixed
inset-0
bg-black/50
flex
items-center
justify-center
z-50
px-4
"
          >
            <div
              className="
bg-white
rounded-3xl
p-8
w-full
max-w-lg
"
            >
              <h2
                className="
text-3xl
font-black
mb-6
"
              >
                Edit Profile
              </h2>

              <input
                value={profile.full_name}
                onChange={(e) =>
                  setProfile({
                    ...profile,

                    full_name: e.target.value,
                  })
                }
                className="
border
rounded-xl
w-full
p-3
mb-4
"
                placeholder="Name"
              />

              <input
                value={profile.email}
                onChange={(e) =>
                  setProfile({
                    ...profile,

                    email: e.target.value,
                  })
                }
                className="
border
rounded-xl
w-full
p-3
mb-4
"
                placeholder="Email"
              />

              <input
                value={profile.phone}
                onChange={(e) =>
                  setProfile({
                    ...profile,

                    phone: e.target.value,
                  })
                }
                className="
border
rounded-xl
w-full
p-3
"
                placeholder="Phone"
              />

              <div
                className="
flex
gap-4
mt-6
"
              >
                <button
                  onClick={updateProfile}
                  className="
flex-1
bg-purple-600
text-white
py-3
rounded-xl
font-bold
"
                >
                  Save
                </button>

                <button
                  onClick={() => setEditProfile(false)}
                  className="
flex-1
bg-gray-200
py-3
rounded-xl
"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;
