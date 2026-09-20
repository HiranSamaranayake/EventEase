import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaTicketAlt,
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaQrcode,
  FaTimes,
  FaDownload,
} from "react-icons/fa";

const OrganizerTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [search, setSearch] = useState("");

const [filter, setFilter] = useState("All");


useEffect(() => {
  if (!user.id) return;

  fetch(
    `http://localhost/EventEase/backend/api/organizer_tickets.php?organizer_id=${user.id}`
  )
    .then((res) => res.json())
    .then((data) => {

      if (data.success) {
        setTickets(data.tickets);
      } else {
        console.log(data.message);
      }

    })
    .catch((err) => console.error("Error fetching tickets:", err));

}, [user.id]);

const filteredTickets = tickets.filter((ticket) => {

  const matchesSearch =
    (ticket.full_name || "")
      .toLowerCase()
      .includes(search.toLowerCase()) ||

    (ticket.event_title || "")
      .toLowerCase()
      .includes(search.toLowerCase()) ||

    (ticket.ticket_code || "")
      .toLowerCase()
      .includes(search.toLowerCase());

  const matchesFilter =
    filter === "All" ||
    ticket.status === filter;

  return matchesSearch && matchesFilter;

});

const usedTickets =
  tickets.filter((t) => t.status === "used").length;

const activeTickets =
tickets.filter((t) => t.status === "unused").length;

const cancelledTickets =
  tickets.filter((t) => t.status === "cancelled").length;

  return (
    <div className="min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-4xl font-bold text-purple-700">
          Ticket Management
        </h1>
        <Link
          to="/organizer/scan-ticket"
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-emerald-500/20 transition flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <FaQrcode className="text-xl" /> Scan Venue Tickets
        </Link>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">

  <StatCard
    title="Total Tickets"
    value={tickets.length}
    icon={<FaTicketAlt />}
    color="from-purple-500 to-indigo-600"
  />

  <StatCard
    title="Active"
    value={activeTickets}
    icon={<FaCheckCircle />}
    color="from-green-500 to-emerald-600"
  />

  <StatCard
    title="Used"
    value={usedTickets}
    icon={<FaClock />}
    color="from-blue-500 to-cyan-600"
  />

  <StatCard
    title="Cancelled"
    value={cancelledTickets}
    icon={<FaTimesCircle />}
    color="from-red-500 to-pink-600"
  />

</div>

<div className="bg-white rounded-2xl shadow p-5 mb-8 flex gap-4 flex-wrap">

  <div className="flex items-center border rounded-xl px-4 flex-1">

    <FaSearch className="text-gray-400" />

    <input
      className="w-full p-3 outline-none"
      placeholder="Search customer, event, or ticket code..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

  </div>

  <select
    value={filter}
    onChange={(e) => setFilter(e.target.value)}
    className="border rounded-xl px-4 font-semibold text-gray-700 outline-none"
  >

    <option value="All">All Statuses</option>
    <option value="unused">Unused</option>
    <option value="used">Used</option>
    <option value="cancelled">Cancelled</option>

  </select>

</div>

<div className="bg-white rounded-3xl shadow-xl overflow-x-auto">

<table className="w-full">

<thead className="bg-purple-700 text-white">

<tr>
    <th className="p-4 text-center">
QR
</th>

<th className="p-4 text-left">Customer</th>

<th className="p-4 text-left">Event</th>

<th className="p-4 text-center">Tickets</th>
<th className="p-4 text-center">
Ticket Code
</th>

<th className="p-4 text-center">Status</th>

<th className="p-4 text-center">Booked</th>

<th className="p-4 text-center">Actions</th>

</tr>

</thead>

<tbody>

{filteredTickets.length === 0 ? (

<tr>

<td
colSpan="8"
className="text-center p-16"
>

<div className="text-6xl mb-4">
🎟
</div>

<h2 className="text-2xl font-bold text-gray-700">
No Tickets Found
</h2>

<p className="text-gray-500 mt-3">
No tickets match your search.
</p>

</td>

</tr>

) : (

filteredTickets.map((ticket) => (

<tr
key={ticket.id}
className="
border-b
hover:bg-purple-50
transition
duration-300
"
>
<td className="p-4 text-center">

<img
 src={`http://localhost/EventEase/backend/${ticket.qr_code}`}
  alt={`QR code for ${ticket.ticket_code}`}
  className="w-16 h-16 mx-auto rounded-lg border cursor-pointer hover:scale-105 hover:shadow-md transition duration-200"
  onClick={() => setSelectedTicket(ticket)}
  title="Click to view QR code"
/>

</td>
<td className="p-4">

<div className="font-semibold text-gray-800">
{ticket.full_name}
</div>

<div className="text-sm text-gray-500">
{ticket.email}
</div>

</td>

<td className="p-4">

<div className="font-semibold text-gray-800">
{ticket.event_title}
</div>

<div className="text-sm text-gray-500">
{ticket.event_date}
</div>

</td>

<td className="p-4 text-center font-medium">

{ticket.ticket_quantity}

</td>

<td className="p-4 text-center">

<span
className="
font-mono
text-sm
bg-purple-50
text-purple-700
border
border-purple-200
px-3
py-1.5
rounded-lg
font-semibold
"
>

{ticket.ticket_code}

</span>

</td>


<td className="p-4 text-center">

<span
className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
ticket.status === "unused"
? "bg-green-100 text-green-700"
: ticket.status === "used"
? "bg-blue-100 text-blue-700"
: "bg-red-100 text-red-700"
}`}
>

{ticket.status}

</span>

</td>

<td className="p-4 text-center text-sm text-gray-600">

{ticket.booking_date ? new Date(ticket.booking_date).toLocaleDateString() : 'N/A'}

</td>

<td className="p-4 text-center">

<button
onClick={() => setSelectedTicket(ticket)}
className="
bg-purple-600
hover:bg-purple-700
text-white
px-4
py-2
rounded-xl
font-semibold
shadow-sm
hover:shadow-purple-200
transition
flex
items-center
gap-1.5
mx-auto
"
>
<FaQrcode /> View
</button>

</td>

</tr>

))

)}

</tbody>

</table>

</div>

      {/* QR Code Detail Modal */}
      {selectedTicket && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedTicket(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-purple-100 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition"
              title="Close"
            >
              <FaTimes className="text-lg" />
            </button>

            <div className="text-center mb-6">
              <span className="inline-block p-3 bg-purple-100 text-purple-600 rounded-2xl mb-3">
                <FaQrcode className="text-2xl" />
              </span>
              <h3 className="text-2xl font-bold text-gray-800">Digital Ticket QR</h3>
              <p className="text-sm text-gray-500 mt-1">Official Event Pass Verification</p>
            </div>

            <div className="bg-gradient-to-b from-purple-50 to-indigo-50/50 p-6 rounded-2xl border border-purple-100 mb-6 flex flex-col items-center">
              {selectedTicket.qr_code ? (
                <img
                  src={`http://localhost/EventEase/backend/${selectedTicket.qr_code}`}
                  alt={`QR Code ${selectedTicket.ticket_code}`}
                  className="w-56 h-56 object-contain bg-white p-3 rounded-2xl shadow-md border border-purple-200 mb-4"
                />
              ) : (
                <div className="w-56 h-56 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mb-4">
                  No QR Code Available
                </div>
              )}

              <div className="bg-purple-900 text-purple-100 font-mono text-lg px-4 py-2 rounded-xl font-semibold tracking-wider">
                {selectedTicket.ticket_code}
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="font-semibold text-gray-500">Attendee</span>
                <span className="font-bold text-gray-800 text-right">{selectedTicket.full_name} ({selectedTicket.email})</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="font-semibold text-gray-500">Event</span>
                <span className="font-bold text-gray-800 text-right">{selectedTicket.event_title}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="font-semibold text-gray-500">Event Date</span>
                <span className="font-medium text-gray-700">{selectedTicket.event_date}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="font-semibold text-gray-500">Quantity</span>
                <span className="font-medium text-gray-700">{selectedTicket.ticket_quantity} ticket(s)</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="font-semibold text-gray-500">Booking Date</span>
                <span className="font-medium text-gray-700">{selectedTicket.booking_date ? new Date(selectedTicket.booking_date).toLocaleString() : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-500">Status</span>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-semibold uppercase ${
                    selectedTicket.status === "unused"
                      ? "bg-green-100 text-green-700"
                      : selectedTicket.status === "used"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {selectedTicket.status}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              {selectedTicket.qr_code && (
                <a
                  href={`http://localhost/EventEase/backend/${selectedTicket.qr_code}`}
                  download={`QR-${selectedTicket.ticket_code}.png`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow transition flex items-center justify-center gap-2"
                >
                  <FaDownload /> Download QR
                </a>
              )}
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


const StatCard = ({ title, value, icon, color }) => (

  <div
    className={`
      rounded-3xl
      p-6
      text-white
      bg-gradient-to-r
      ${color}
      shadow-xl
    `}
  >

    <div className="flex justify-between items-center">

      <div>

        <p className="text-white/80">
          {title}
        </p>

        <h2 className="text-3xl font-bold mt-2">
          {value}
        </h2>

      </div>

      <div className="text-4xl">
        {icon}
      </div>

    </div>

  </div>

);


export default OrganizerTickets;