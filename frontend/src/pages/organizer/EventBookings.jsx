import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EventBookings = () => {
  const { id } = useParams();

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `http://localhost/EventEase/backend/api/event_bookings.php?event_id=${id}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBookings(data.bookings);
        }

        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="p-10">Loading Bookings...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold text-purple-700 mb-8">
        Event Bookings
      </h1>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-6">No bookings yet.</div>
      ) : (
        <table className="w-full bg-white rounded-xl shadow">
          <thead className="bg-purple-600 text-white">
            <tr>
              <th className="p-4 text-left">Ticket</th>

              <th className="p-4 text-left">Customer</th>

              <th className="p-4 text-left">Email</th>

              <th className="p-4 text-left">Booking Date</th>

              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b">
                <td className="p-4">{booking.ticket_code}</td>

                <td className="p-4">{booking.full_name}</td>

                <td className="p-4">{booking.email}</td>

                <td className="p-4">{booking.booking_date}</td>

                <td className="p-4 capitalize">{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EventBookings;
