import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    fetch(
      `http://localhost/EventEase/backend/api/my_bookings.php?user_id=${user.id}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBookings(data.bookings);
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);

        setLoading(false);
      });
  }, []);
 
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      {bookings.length === 0 && (
        <div
          className="
                bg-white
                rounded-xl
                shadow
                p-10
                text-center
            "
        >
          <h2 className="text-2xl font-bold">No Bookings Yet</h2>

          <p className="text-gray-500 mt-2">
            Book your first event to see it here.
          </p>
        </div>
      )}

      {bookings.length > 0 && (
        <table className="w-full bg-white shadow rounded-xl">
          <thead className="bg-purple-600 text-white">
            <tr>
              <th className="p-4 text-left">Event</th>

              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Booking Date</th>

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
                <td className="p-4">{booking.booking_date}</td>

                <td className="p-4">
                  <span
                    className="
            bg-purple-100
            text-purple-700
            px-3
            py-1
            rounded-full
            font-semibold
        "
                  >
                    {booking.ticket_code}
                  </span>
                </td>

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
                  <div className="flex gap-2">
                 <button

onClick={() => navigate(`/ticket/${booking.id}`)}

className="
bg-blue-600
text-white
px-4
py-2
rounded-lg
"

>

View Ticket

</button>

                    <a
                     href={`http://localhost/EventEase/backend/api/download_ticket_pdf.php?booking_id=${booking.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
            bg-green-600
            hover:bg-green-700
            text-white
            px-4
            py-2
            rounded-lg
            transition
        "
                    >
                      PDF
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyBookings;
