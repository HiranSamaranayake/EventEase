import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react";
import { FaTicketAlt, FaFilePdf, FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaCouch, FaPrint, FaDownload, FaSpinner } from "react-icons/fa";

const API = "http://localhost/EventEase/backend/api/";
const IMAGE_URL = "http://localhost/EventEase/backend/";

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
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

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    const pdfEndpoint = `${API}download_ticket_pdf.php?booking_id=${id}`;

    try {
      const response = await fetch(pdfEndpoint);
      if (!response.ok) throw new Error("PDF response failed");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `Ticket-${ticket?.ticket_code || id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 2000);
    } catch (err) {
      console.warn("Direct blob download failed, falling back to window location assignment", err);
      window.location.href = pdfEndpoint;
    } finally {
      setDownloading(false);
    }
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

  const qrSrc = ticket.qr_code 
    ? IMAGE_URL + ticket.qr_code 
    : `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(ticket.ticket_code || id)}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center items-center p-6 relative overflow-hidden py-12 print:bg-white print:p-0">
      {/* Ambient background glow - Hidden when printing */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none print:hidden"></div>

      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          .print\\:hidden { display: none !important; }
          #printable-ticket {
            box-shadow: none !important;
            border: 2px solid #000 !important;
            background: #fff !important;
            color: #000 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          #printable-ticket * {
            color: #000 !important;
          }
          #printable-ticket .bg-purple-600 {
            background-color: #000 !important;
            color: #fff !important;
          }
        }
      `}</style>

      <div
        id="printable-ticket"
        className="bg-slate-900/90 border border-white/10 rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl backdrop-blur-xl space-y-6 relative z-10 print:max-w-none"
      >
        <div className="text-center space-y-2 border-b border-white/10 pb-4">
          <span className="bg-purple-500/20 text-purple-300 font-mono text-xs px-3.5 py-1 rounded-full font-bold uppercase tracking-wider border border-purple-500/30">
            {ticket.ticket_code}
          </span>
          <h1 className="text-3xl font-black text-white mt-1">Event Ticket Pass</h1>
          <p className="text-xs text-slate-400">Present this QR code for scanning at venue entrance</p>
        </div>

        <div className="space-y-3.5 text-xs sm:text-sm">
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-slate-400">Event Title:</span>
            <span className="font-bold text-white text-right">{ticket.title}</span>
          </div>

          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-slate-400">Attendee Name:</span>
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

        {/* Scannable Ticket QR Code */}
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200">
          <img
            src={qrSrc}
            alt="Ticket QR Code"
            className="w-48 h-48 object-contain rounded-xl"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(ticket.ticket_code || id)}`;
            }}
          />
          <span className="text-[10px] text-gray-800 font-mono mt-2 font-black">{ticket.ticket_code}</span>
        </div>

        {/* Action Buttons - Hidden in Print View */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 print:hidden">
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {downloading ? (
              <>
                <FaSpinner className="animate-spin" /> Downloading...
              </>
            ) : (
              <>
                <FaFilePdf /> Download Ticket PDF
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5"
          >
            <FaPrint /> Print Pass
          </button>

          <button
            onClick={() => navigate("/my-bookings")}
            className="py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <FaArrowLeft /> My Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;