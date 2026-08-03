import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaTicketAlt, FaFilePdf, FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaCouch, FaPrint, FaQrcode, FaShieldAlt } from "react-icons/fa";

const API = "http://localhost/EventEase/backend/api/";
const IMAGE_URL = "http://localhost/EventEase/backend/";

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!id) {
      setError("Booking ID missing");
      setLoading(false);
      return;
    }

    fetch(API + "download_ticket.php?booking_id=" + id)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.ticket) {
          // Ownership Security Check: Customers can ONLY view their own tickets
          if (
            currentUser &&
            currentUser.role === "customer" &&
            data.ticket.user_id &&
            parseInt(currentUser.id) !== parseInt(data.ticket.user_id)
          ) {
            setError("❌ Access Denied: You are only authorized to view your own booked tickets.");
          } else {
            setTicket(data.ticket);
          }
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

  const handlePrint = () => {
    window.print();
  };

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
        <div className="bg-slate-900 border border-rose-500/40 p-8 rounded-3xl shadow-2xl text-center space-y-4 max-w-md w-full">
          <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto text-3xl">
            <FaShieldAlt />
          </div>
          <h1 className="text-xl text-rose-400 font-extrabold">{error}</h1>
          <button
            onClick={() => navigate("/my-bookings")}
            className="w-full py-3.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl transition text-xs shadow-lg"
          >
            Go to My Bookings
          </button>
        </div>
      </div>
    );
  }

  const qrSrc = ticket.qr_code 
    ? IMAGE_URL + ticket.qr_code 
    : `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(ticket.ticket_code || id)}`;

  const pdfDownloadUrl = `${API}download_ticket_pdf.php?booking_id=${ticket.booking_id || id}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-900/20 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-3xl w-full space-y-6 relative z-10">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/my-bookings")}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10"
          >
            <FaArrowLeft /> Back to My Bookings
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 text-xs font-bold text-purple-300 hover:text-white transition bg-purple-950/60 hover:bg-purple-900 px-4 py-2 rounded-xl border border-purple-500/30 shadow"
          >
            <FaPrint /> Print Ticket Pass
          </button>
        </div>

        {/* Ticket Digital Pass Card */}
        <div className="bg-slate-900/90 border border-purple-500/40 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-8">
          
          {/* Ticket Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-6 gap-4">
            <div>
              <span className="bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                ✓ VERIFIED CUSTOMER PASS
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 flex items-center gap-2">
                <FaTicketAlt className="text-purple-400" /> {ticket.title}
              </h1>
              <p className="text-xs text-slate-400 mt-1">Organized by {ticket.organization_name || "Verified Eventease Organizer"}</p>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 px-4 rounded-2xl text-center shrink-0">
              <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-black block">Status</span>
              <span className="text-xs font-extrabold text-emerald-300 uppercase">
                {ticket.status || "CONFIRMED"}
              </span>
            </div>
          </div>

          {/* Ticket Body Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            
            {/* Left Info Columns */}
            <div className="md:col-span-2 space-y-4 text-xs">
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold flex items-center gap-1">
                  <FaCalendarAlt className="text-purple-400" /> Event Date & Time
                </span>
                <p className="text-sm font-bold text-white">
                  {ticket.event_date} {ticket.event_time ? `at ${ticket.event_time}` : ''}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold flex items-center gap-1">
                  <FaMapMarkerAlt className="text-purple-400" /> Venue Location
                </span>
                <p className="text-sm font-bold text-white">{ticket.location || "Main Venue Auditorium"}</p>
              </div>

              <div className="bg-purple-950/60 border border-purple-500/30 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] text-purple-300 uppercase tracking-wider font-extrabold flex items-center gap-1">
                  <FaCouch className="text-purple-400" /> Reserved Seat Numbers
                </span>
                <p className="text-base font-black text-purple-200">
                  {ticket.seat_number || "General Admission Seats"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-bold">Ticket Quantity:</span>
                  <span className="text-xs font-extrabold text-white">{ticket.ticket_quantity || 1} Ticket(s)</span>
                </div>

                <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-bold">Total Amount Paid:</span>
                  <span className="text-xs font-extrabold text-emerald-400">LKR {parseFloat(ticket.total_amount || 0).toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-1">
                <span className="text-[10px] text-slate-400 block font-bold">Ticket Holder:</span>
                <span className="text-xs font-bold text-slate-200">{ticket.full_name} ({ticket.email})</span>
              </div>
            </div>

            {/* Right QR Code Column */}
            <div className="bg-white rounded-3xl p-5 text-center space-y-3 shadow-2xl shrink-0">
              <div className="flex items-center justify-center gap-1 text-[10px] font-black uppercase text-purple-950 tracking-wider">
                <FaQrcode /> Entrance Scanner QR Code
              </div>

              <img
                src={qrSrc}
                alt="Ticket Entrance QR Code"
                className="w-48 h-48 object-contain mx-auto rounded-xl border border-gray-200 shadow"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(ticket.ticket_code || id)}`;
                }}
              />

              <div className="bg-slate-100 p-2 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Reference Code</span>
                <span className="font-mono font-black text-slate-900 text-xs">
                  {ticket.ticket_code || `EVT-${id}`}
                </span>
              </div>
            </div>

          </div>

          {/* Action Download Link */}
          <div className="pt-4 border-t border-white/10">
            <a
              href={pdfDownloadUrl}
              download={`Ticket-${ticket.ticket_code || id}.pdf`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-black text-sm rounded-2xl shadow-xl transition flex items-center justify-center gap-2 group cursor-pointer text-center block"
            >
              <FaFilePdf className="text-lg inline" /> Download Official PDF Ticket Pass
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TicketDetails;