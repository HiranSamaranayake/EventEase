import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API = "http://localhost/EventEase/backend/api/";
const IMAGE_URL = "http://localhost/EventEase/backend/";

const TicketDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Booking ID missing");
      setLoading(false);
      return;
    }

    fetch(API + "download_ticket.php?booking_id=" + id)
      .then((res) => res.json())

      .then((data) => {
        console.log(data);

        if (data.success) {
          setTicket(data.ticket);
        } else {
          setError(data.message);
        }

        setLoading(false);
      })

      .catch((err) => {
        console.log(err);

        setError("Unable to load ticket");

        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Loading Ticket...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-xl text-center">
          <h1 className="text-2xl text-red-600 font-bold">{error}</h1>

          <button
            onClick={() => navigate("/my-bookings")}
            className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">
          Event Ticket
        </h1>

        <div className="space-y-3">

          <p>
            <b>Event:</b> {ticket.title}
          </p>

          <p>
            <b>Name:</b> {ticket.full_name}
          </p>

          <p>
            <b>Email:</b> {ticket.email}
          </p>

          <p>
            <b>Event Date:</b> {ticket.event_date}
          </p>

          <p>
            <b>Location:</b> {ticket.location}
          </p>

          <p>
            <b>Booking Date:</b> {ticket.booking_date}
          </p>

          <p>
            <b>Tickets:</b> {ticket.ticket_quantity}
          </p>

          <p>
            <b>Total:</b> Rs. {ticket.total_amount}
          </p>

          <p>
            <b>Ticket Code:</b>{" "}
            <span className="text-purple-700 font-bold">
              {ticket.ticket_code}
            </span>
          </p>

          <p>
            <b>Status:</b>{" "}
            <span className="text-green-600 font-semibold">
              {ticket.status}
            </span>
          </p>

        </div>

        <div className="mt-8 flex justify-center">
          {ticket.qr_code ? (
            <img
              src={IMAGE_URL + ticket.qr_code}
              alt="QR Code"
              className="w-56 h-56 border rounded-lg"
            />
          ) : (
            <div className="text-red-500 font-semibold">
              QR Code Not Available
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-8">

          <button
            onClick={() => window.print()}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
          >
            Download PDF
          </button>

          <button
            onClick={() => navigate("/my-bookings")}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg"
          >
            Back
          </button>

        </div>

      </div>
    </div>
  );
};

export default TicketDetails;