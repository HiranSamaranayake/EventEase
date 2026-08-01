import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import InteractiveSeatMap from "../../components/InteractiveSeatMap";
import { FaTicketAlt, FaCreditCard, FaLock, FaArrowLeft, FaCheckCircle } from "react-icons/fa";

/* global payhere */

const BookEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const [event, setEvent] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetch(`http://localhost/EventEase/backend/api/event_details.php?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEvent(data.event);
        }
      });
  }, [id]);

  const handleBooking = () => {
    if (!user) {
      alert("User not logged in");
      navigate("/login");
      return;
    }

    if (!event) {
      alert("Event not found");
      return;
    }

    setBookingLoading(true);

    fetch("http://localhost/EventEase/backend/api/create_booking.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user.id,
        event_id: event.id,
        ticket_quantity: selectedSeats.length > 0 ? selectedSeats.length : 1,
        selected_seats: selectedSeats
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          alert(data.message || "Failed to confirm booking");
          setBookingLoading(false);
          return;
        }

        // Check if PayHere is loaded or fallback to direct confirmation
        fetch("http://localhost/EventEase/backend/api/create_payment.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            booking_id: data.booking_id,
          }),
        })
          .then((res) => res.json())
          .then((payment) => {
            if (!payment.success || typeof payhere === "undefined") {
              // Direct success fallback
              navigate(`/payment-success?booking=${data.booking_id}`);
              return;
            }

            payhere.onCompleted = function (orderId) {
              navigate(`/payment-success?booking=${orderId}`);
            };

            payhere.onDismissed = function () {
              navigate("/payment-cancel");
            };

            payhere.onError = function (error) {
              console.log(error);
              navigate(`/payment-success?booking=${data.booking_id}`);
            };

            payhere.startPayment(payment);
          })
          .catch(() => {
            navigate(`/payment-success?booking=${data.booking_id}`);
          });
      })
      .catch((err) => {
        console.error(err);
        alert("Server error during booking");
      })
      .finally(() => {
        setBookingLoading(false);
      });
  };

  if (!event) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-950">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const calculatedTotal = selectedSeats.length > 0
    ? selectedSeats.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0)
    : (parseFloat(event.price) || 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8 relative overflow-hidden pb-20">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10 pt-4">
        {/* Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-purple-300 hover:text-white transition backdrop-blur-md"
        >
          <FaArrowLeft /> Back to Event Details
        </button>

        {/* Hero Section */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              {event.category || "General Admission"}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white">{event.title}</h1>
            <p className="text-slate-400 text-xs sm:text-sm">📅 {event.event_date} | 📍 {event.location || "Venue TBD"}</p>
          </div>

          <div className="bg-purple-950/60 border border-purple-500/30 rounded-2xl p-4 px-6 text-right shrink-0">
            <span className="text-[10px] text-purple-300 uppercase tracking-wider font-bold block">Base Ticket Price</span>
            <span className="text-2xl font-black text-white mt-0.5 block">
              {parseFloat(event.price) > 0 ? `LKR ${parseFloat(event.price).toLocaleString()}` : "FREE"}
            </span>
          </div>
        </div>

        {/* Interactive Seat Map Component */}
        <InteractiveSeatMap
          eventId={event.id}
          basePrice={event.price}
          onSeatSelectionChange={(seats) => setSelectedSeats(seats)}
        />

        {/* Final Order Confirmation Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <FaCheckCircle className="text-emerald-400" /> Confirm Order & Proceed to Checkout
          </h3>

          <div className="space-y-3 text-xs sm:text-sm border-t border-b border-white/10 py-4">
            <div className="flex justify-between">
              <span className="text-slate-400">Selected Seat Count:</span>
              <span className="font-bold text-white">{selectedSeats.length > 0 ? `${selectedSeats.length} Seats` : "1 Ticket (General Admission)"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Selected Seats:</span>
              <span className="font-mono font-bold text-purple-300">
                {selectedSeats.length > 0 ? selectedSeats.map((s) => s.seat_code).join(", ") : "General"}
              </span>
            </div>
            <div className="flex justify-between text-base pt-2 border-t border-white/10">
              <span className="font-extrabold text-white">Final Total Amount:</span>
              <span className="font-black text-emerald-400 text-xl">LKR {calculatedTotal.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={handleBooking}
            disabled={bookingLoading}
            className="w-full py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 disabled:opacity-50 text-white font-black text-base rounded-2xl shadow-xl shadow-purple-600/30 transition flex items-center justify-center gap-2 group"
          >
            {bookingLoading ? (
              "Processing Reservation..."
            ) : (
              <>
                <FaCreditCard className="group-hover:scale-110 transition" /> Confirm Booking & Pay (LKR {calculatedTotal.toLocaleString()})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookEvent;
