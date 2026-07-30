import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaTicketAlt, FaFilePdf, FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaCouch } from "react-icons/fa";

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
        if (data.success) {
          setTicket(data.ticket);
        } else {
          setError(data.message || "Unable to find ticket");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load ticket details");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
        <div className="bg-slate-900 border border-white/10 p-8 rounded-3xl shadow-xl text-center space-y-4">
          <h1 className="text-2xl text-rose-500 font-bold">{error}</h1>
          <button
            onClick={() => navigate("/my-bookings")}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition"
          >
            Back to My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center items-center p-6 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="bg-slate-900/90 border border-white/10 rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl backdrop-blur-xl space-y-6 relative z-10">
        <div className="text-center space-y-2 border-b border-white/10 pb-4">
          <span className="bg-purple-500/20 text-purple-300 font-mono text-xs px-3.5 py-1 rounded-full font-bold uppercase tracking-wider">
            {ticket.ticket_code}
          </span>
          <h1 className="text-3xl font-black text-white">Event Ticket</h1>
          <p className="text-xs text-slate-400">Present this QR code for scanning at venue entrance</p>
        </div>

        <div className="space-y-3.5 text-xs sm:text-sm">
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-slate-400">Event Title:</span>
            <span className="font-bold text-white text-right">{ticket.title}</span>
          </div>

          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-slate-400">Attendee:</span>
            <span className="font-semibold text-slate-200">{ticket.full_name} ({ticket.email})</span>
          </div>

          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-slate-400">Date & Location:</span>
            <span className="font-medium text-slate-300 text-right">{ticket.event_date} | {ticket.location}</span>
          </div>

          {/* Reserved Seat Badge */}
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-slate-400 flex items-center gap-1.5">
              <FaCouch className="text-purple-400" /> Seat Number(s):
            </span>
            <span className="bg-purple-600 text-white font-mono font-black text-sm px-3.5 py-1 rounded-xl shadow">
              {ticket.seat_number || "General Admission"}
            </span>
          </div>

          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-slate-400">Tickets Quantity:</span>
            <span className="font-bold text-white">{ticket.ticket_quantity} Ticket(s)</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Total Amount Paid:</span>
            <span className="font-black text-emerald-400 text-base">LKR {Number(ticket.total_amount).toLocaleString()}</span>
          </div>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl">
          {ticket.qr_code ? (
            <img
              src={IMAGE_URL + ticket.qr_code}
              alt="QR Code"
              className="w-48 h-48 object-contain"
            />
          ) : (
            <div className="text-rose-500 font-bold text-xs p-6">
              QR Code Not Available
            </div>
          )}
          <span className="text-[10px] text-gray-500 font-mono mt-2 font-bold">{ticket.ticket_code}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <a
            href={`http://localhost/EventEase/backend/api/download_ticket_pdf.php?booking_id=${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
          >
            <FaFilePdf /> Download Ticket PDF
          </a>

          <button
            onClick={() => navigate("/my-bookings")}
            className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <FaArrowLeft /> Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;