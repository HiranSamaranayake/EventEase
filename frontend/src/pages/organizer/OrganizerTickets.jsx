import { useEffect, useState } from "react";

import {
  FaTicketAlt,
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";

const OrganizerTickets = () => {
  const [tickets, setTickets] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const [search, setSearch] = useState("");

const [filter, setFilter] = useState("All");


useEffect(() => {

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

    });

}, []);
const filteredTickets = tickets.filter((ticket) => {

  const matchesSearch =
    ticket.full_name
      .toLowerCase()
      .includes(search.toLowerCase()) ||

    ticket.event_title
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
      <h1 className="text-4xl font-bold text-purple-700 mb-8">
        Ticket Management
      </h1>

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
      placeholder="Search customer or event..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

  </div>

  <select
    value={filter}
    onChange={(e) => setFilter(e.target.value)}
    className="border rounded-xl px-4"
  >

    <option>All</option>
  <option>unused</option>
    <option>used</option>
    <option>cancelled</option>

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
colSpan="6"
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
  className="w-16 h-16 mx-auto rounded-lg border"
/>

</td>
<td className="p-4">

<div className="font-semibold">
{ticket.full_name}
</div>

<div className="text-sm text-gray-500">
{ticket.email}
</div>

</td>

<td className="p-4">

<div className="font-semibold">
{ticket.event_title}
</div>

<div className="text-sm text-gray-500">
{ticket.event_date}
</div>

</td>

<td className="p-4 text-center">

{ticket.ticket_quantity}

</td>

<td className="p-4 text-center">

<span
className="
font-mono
text-sm
bg-gray-100
px-3
py-2
rounded-lg
"
>

{ticket.ticket_code}

</span>

</td>


<td className="p-4 text-center">

<span
className={`px-3 py-1 rounded-full text-xs font-semibold ${
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

<td className="p-4 text-center">

{new Date(ticket.booking_date).toLocaleDateString()}

</td>

<td className="p-4 text-center">

<button
className="
bg-purple-600
hover:bg-purple-700
text-white
px-4
py-2
rounded-xl
"
>

View

</button>

</td>

</tr>

))

)}

</tbody>

</table>

</div>
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