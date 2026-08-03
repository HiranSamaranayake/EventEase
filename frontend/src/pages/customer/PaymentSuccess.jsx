import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaFilePdf, FaTicketAlt, FaQrcode, FaArrowLeft, FaCouch } from "react-icons/fa";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const bookingId =
    searchParams.get("booking") ||
    searchParams.get("booking_id") ||
    searchParams.get("id") ||
    searchParams.get("order_id") ||
    localStorage.getItem("last_booking_id");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [ticketDetails, setTicketDetails] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!bookingId) {
      setError(true);
      setLoading(false);
      return;
    }

    // Trigger payment update in background
    fetch("http://localhost/EventEase/backend/api/payment_success_update.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ booking_id: bookingId }),
    }).catch((err) => console.warn("Background update warning:", err));

    // Fetch ticket details directly for display
    fetch(`http://localhost/EventEase/backend/api/download_ticket.php?booking_id=${bookingId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.ticket) {
          setTicketDetails(data.ticket);
          setError(false);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ticket fetch error:", err);
        setError(true);
        setLoading(false);
      });
  }, [bookingId]);

  const handleDownloadPDF = async () => {
    if (!bookingId) return;
    setDownloading(true);
    const pdfEndpoint = `http://localhost/EventEase/backend/api/download_ticket_pdf.php?booking_id=${bookingId}`;

    try {
      const response = await fetch(pdfEndpoint);
      if (!response.ok) throw new Error("PDF fetch failed");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `Ticket-${ticketDetails?.ticket_code || bookingId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 2000);
    } catch (err) {
      console.warn("Direct blob download failed, falling back to window location", err);
      window.location.href = pdfEndpoint;
    } finally {
      setDownloading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50 p-6">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-xl border border-rose-200 space-y-4">
          <FaTimesCircle className="text-6xl text-rose-600 mx-auto" />
          <h1 className="text-2xl font-black text-rose-700">Payment Verification Failed</h1>
          <p className="text-xs text-gray-600">We could not confirm your booking transaction. Please check your bookings page.</p>
          <button
            onClick={() => navigate("/my-bookings")}
            className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-2xl shadow transition"
          >
            Go to My Bookings
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-600 border-t-transparent mx-auto"></div>
          <h2 className="text-xl font-black text-gray-800">Confirming Payment & Generating QR Ticket...</h2>
          <p className="text-xs text-gray-500">Please wait a moment while we process your pass.</p>
        </div>
      </div>
    );
  }

  const qrImageUrl = ticketDetails?.qr_code 
    ? `http://localhost/EventEase/backend/${ticketDetails.qr_code}`
    : `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(ticketDetails?.ticket_code || bookingId)}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 relative overflow-hidden py-12">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-600/20 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="bg-slate-900/90 border border-emerald-500/30 rounded-[2.5rem] p-8 sm:p-10 max-w-xl w-full text-center space-y-6 shadow-2xl backdrop-blur-xl relative z-10">
        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-4xl shadow-lg">
          <FaCheckCircle />
        </div>

        <div>
          <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full border border-emerald-500/30">
            Payment Confirmed & Verified
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-2">Booking Successful!</h1>
          <p className="text-slate-400 text-xs mt-1">Your ticket pass and scannable QR Code are ready below.</p>
        </div>

        {ticketDetails && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left text-xs space-y-3">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-slate-400">Event Title:</span>
              <span className="font-bold text-white text-right">{ticketDetails.title}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-slate-400">Date & Location:</span>
              <span className="font-semibold text-slate-200 text-right">{ticketDetails.event_date} | {ticketDetails.location}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-slate-400 flex items-center gap-1">
                <FaCouch className="text-purple-400" /> Reserved Seats:
              </span>
              <span className="font-mono font-black text-purple-300 bg-purple-950/80 px-2.5 py-0.5 rounded-lg border border-purple-500/30">
                {ticketDetails.seat_number || "General Admission"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Ticket Reference Code:</span>
              <span className="font-mono font-bold text-amber-400">{ticketDetails.ticket_code || `EVT-${bookingId}`}</span>
            </div>
          </div>
        )}

        {/* SCANNABLE TICKET QR CODE DISPLAY */}
        <div className="bg-white rounded-3xl p-5 max-w-xs mx-auto shadow-2xl space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase text-purple-900 tracking-wider mb-1">
            <FaQrcode /> Scan At Entrance Gate
          </div>
          <img
            src={qrImageUrl}
            alt="Ticket QR Code"
            className="w-48 h-48 object-contain mx-auto rounded-xl"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(ticketDetails?.ticket_code || bookingId)}`;
            }}
          />
          <span className="font-mono font-bold text-slate-800 text-xs block pt-1">
            {ticketDetails?.ticket_code || `EVT-${bookingId}`}
          </span>
        </div>

        {/* ACTION BUTTONS */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-black text-sm rounded-2xl shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <FaFilePdf className="text-lg" /> {downloading ? "Downloading Ticket PDF..." : "Download Official PDF Ticket"}
          </button>

          <div className="grid grid-cols-2 gap-3">
            <Link
              to={`/ticket/${bookingId}`}
              className="py-3 bg-purple-900/60 hover:bg-purple-900 text-purple-200 border border-purple-500/30 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <FaTicketAlt /> View Full Ticket
            </Link>

            <Link
              to="/my-bookings"
              className="py-3 bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <FaArrowLeft /> My Bookings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;