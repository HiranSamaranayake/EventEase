import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch(
      `http://localhost/EventEase/backend/api/my_bookings.php?user_id=${user.id}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBookings(data.bookings);
        }
      });
  }, []);
  console.log("MY BOOKINGS PAGE LOADED");
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      <table className="w-full bg-white shadow rounded-xl">
        <thead className="bg-purple-600 text-white">
          <tr>
            <th className="p-4 text-left">Event</th>

            <th className="p-4 text-left">Date</th>

            <th className="p-4 text-left">Ticket</th>

            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-b">
              <td className="p-4">{booking.title}</td>

              <td className="p-4">{booking.event_date}</td>

              <td className="p-4">{booking.ticket_code}</td>

              <td className="p-4">
                {booking.status === "used" ? (
                  <span
                    className="
                bg-red-100
                text-red-700
                px-3
                py-1
                rounded-full
                text-sm
                font-semibold
            "
                  >
                    Used
                  </span>
                ) : (
                  <span
                    className="
                bg-green-100
                text-green-700
                px-3
                py-1
                rounded-full
                text-sm
                font-semibold
            "
                  >
                    Unused
                  </span>
                )}
              </td>
              <td className="p-4">
                <Link
                  to={`/ticket/${booking.ticket_id}`}
                  className="
            bg-purple-600
            hover:bg-purple-700
            text-white
            px-4
            py-2
            rounded-lg
            transition
        "
                >
                  View Ticket
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyBookings;
