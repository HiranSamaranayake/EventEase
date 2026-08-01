import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

const OrganizerBookings = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `http://localhost/EventEase/backend/api/organizer_bookings.php?user_id=${user.id}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBookings(data.bookings);
        }

        setLoading(false);
      });
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    return (
      booking.full_name.toLowerCase().includes(search.toLowerCase()) ||
      booking.event_title.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalRevenue = bookings.reduce(
    (sum, booking) => sum + Number(booking.total_amount),
    0,
  );

  const totalTickets = bookings.reduce(
    (sum, booking) => sum + Number(booking.ticket_quantity),
    0,
  );

  const successfulPayments = bookings.filter(
    (booking) => booking.payment_status === "success",
  ).length;

  if (loading) {
    return <div className="text-center text-2xl p-20">Loading Bookings...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-purple-700 mb-8">
        Organizer Bookings
      </h1>
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl p-6 shadow-lg">
          <p className="text-sm opacity-80">Total Bookings</p>
          <h2 className="text-3xl font-bold mt-2">{bookings.length}</h2>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-6 shadow-lg">
          <p className="text-sm opacity-80">Revenue</p>
          <h2 className="text-3xl font-bold mt-2">Rs {totalRevenue}</h2>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-2xl p-6 shadow-lg">
          <p className="text-sm opacity-80">Tickets Sold</p>
          <h2 className="text-3xl font-bold mt-2">{totalTickets}</h2>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-6 shadow-lg">
          <p className="text-sm opacity-80">Successful Payments</p>
          <h2 className="text-3xl font-bold mt-2">{successfulPayments}</h2>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-5 mb-8">
        <div className="flex items-center border rounded-xl px-4">
          <FaSearch className="text-gray-400" />

          <input
            type="text"
            placeholder="Search customer or event..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 outline-none"
          />
        </div>
      </div>

      <div
        className="
bg-white
rounded-3xl
shadow-xl
overflow-x-auto
"
      >
        <table className="w-full">
          <thead className="bg-purple-700 text-white">
            <tr>
              <th className="p-4 text-left">Customer</th>

              <th className="p-4 text-left">Event</th>

              <th className="p-4 text-center">Tickets</th>

              <th className="p-4 text-center">Amount</th>

              <th className="p-4 text-center">Payment</th>
              <th className="p-4 text-center">Booking</th>

              <th className="p-4 text-center">Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-16">
                  <div className="text-6xl mb-4">🎟</div>

                  <h2 className="text-2xl font-bold text-gray-700">
                    No Bookings Found
                  </h2>

                  <p className="text-gray-500 mt-2">
                    There are no bookings matching your search.
                  </p>
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => (
                <tr
key={booking.id}
className="
border-b
hover:bg-purple-50
transition-all
duration-300
"
>
                  <td className="p-4">
                    <div className="font-semibold">{booking.full_name}</div>

                    <div className="text-sm text-gray-500">{booking.email}</div>

                    <div className="text-sm text-gray-500">{booking.phone}</div>
                  </td>

                  <td className="p-4">{booking.event_title}</td>

                  <td className="p-4 text-center">{booking.ticket_quantity}</td>

                  <td className="p-4 text-center">Rs {booking.total_amount}</td>

                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.payment_status === "success"
                          ? "bg-green-100 text-green-700"
                          : booking.payment_status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {booking.payment_status}
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.booking_status === "confirmed"
                          ? "bg-blue-100 text-blue-700"
                          : booking.booking_status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {booking.booking_status}
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    {new Date(booking.booking_date).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      },
                    )}
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

export default OrganizerBookings;
