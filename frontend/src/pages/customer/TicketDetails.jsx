import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaTicketAlt, FaFilePdf, FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaCouch, FaPrint, FaQrcode, FaShieldAlt, FaBullhorn, FaInfoCircle } from "react-icons/fa";

const API = "http://localhost/EventEase/backend/api/";
const IMAGE_URL = "http://localhost/EventEase/backend/";

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendStatus, setResendStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleResendEmail = async () => {
    setResendingEmail(true);
    setResendStatus("");
    try {
      const res = await fetch(API + "resend_ticket_email.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id: ticket?.booking_id || id })
      });
      const data = await res.json();
      if (data.success) {
        setResendStatus("✅ Ticket email dispatched successfully!");
        // Refresh email logs
        fetch(API + "get_email_logs.php?booking_id=" + (ticket?.booking_id || id))
          .then((eRes) => eRes.json())
          .then((eData) => {
            if (eData.success) setEmailLogs(eData.email_logs || []);
          });
      } else {
        setResendStatus("❌ " + (data.message || "Failed to resend email"));
      }
    } catch (err) {
      setResendStatus("❌ Connection error while resending email.");
    } finally {
      setResendingEmail(false);
    }
  };

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
            // Fetch broadcast announcements for this event
            const eventId = data.ticket.event_id || id;
            fetch(API + "get_event_announcements.php?event_id=" + eventId)
              .then((aRes) => aRes.json())
              .then((aData) => {
                if (aData.status === "success") {
                  setAnnouncements(aData.data || []);
                }
              })
              .catch((err) => console.error("Error loading broadcast announcements", err));

            // Fetch automated email logs for this booking
            fetch(API + "get_email_logs.php?booking_id=" + id)
              .then((eRes) => eRes.json())
              .then((eData) => {
                if (eData.success) {
                  setEmailLogs(eData.email_logs || []);
                }
              })
              .catch((err) => console.error("Error loading email logs", err));
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

  const handlePdfDownload = async () => {
    const bookingId = ticket?.booking_id || id;
    const downloadUrl = `${API}download_ticket_pdf.php?booking_id=${bookingId}`;
    try {
      const res = await fetch(downloadUrl);
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "PDF generation failed");
      }
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "PDF generation failed");
      }
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `Ticket-${ticket?.ticket_code || bookingId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 2000);
    } catch (e) {
      console.warn("Direct blob download fallback", e);
      window.open(downloadUrl, "_blank");
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
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10 cursor-pointer"
          >
            <FaArrowLeft /> Back to My Bookings
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 text-xs font-bold text-purple-300 hover:text-white transition bg-purple-950/60 hover:bg-purple-900 px-4 py-2 rounded-xl border border-purple-500/30 shadow cursor-pointer"
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

          {/* Action Action Buttons: PDF Download & Automated Email Ticket Preview */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handlePdfDownload}
              className="flex-1 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl transition flex items-center justify-center gap-2 group cursor-pointer text-center"
            >
              <FaFilePdf className="text-lg inline" /> Download Official PDF Ticket Pass
            </button>

            <button
              onClick={() => setShowEmailModal(true)}
              className="py-3.5 px-4 bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-500/40 font-bold text-xs sm:text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <FaInfoCircle className="text-lg text-purple-300" /> View Sent Confirmation Email
            </button>

            <button
              onClick={handleResendEmail}
              disabled={resendingEmail}
              className="py-3.5 px-4 bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 border border-indigo-500/40 font-bold text-xs sm:text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              📧 {resendingEmail ? 'Resending Email...' : 'Resend Email'}
            </button>
          </div>

          {resendStatus && (
            <div className={`p-3 rounded-xl text-xs font-bold text-center ${
              resendStatus.includes('✅') ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}>
              {resendStatus}
            </div>
          )}

          {/* Organizer Broadcast Announcements Advisories */}
          {announcements.length > 0 && (
            <div className="pt-6 border-t border-purple-800/40 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <FaBullhorn className="text-amber-400" /> Organizer Broadcast Advisories ({announcements.length})
                </h3>
                <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                  Live Notices
                </span>
              </div>

              <div className="space-y-3">
                {announcements.map((item) => (
                  <div key={item.id} className="bg-slate-950/80 border border-purple-500/30 p-4 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                          item.priority === 'emergency' ? 'bg-rose-500 text-white' :
                          item.priority === 'urgent' ? 'bg-amber-400 text-amber-950' : 'bg-purple-600 text-white'
                        }`}>
                          {item.priority || 'Notice'}
                        </span>
                        <strong className="text-white font-bold">{item.title}</strong>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ⏰ {new Date(item.created_at).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed font-medium">
                      {item.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Automated Email Confirmation Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-white/10 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xl">
                  📧
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white">Automated Confirmation Email</h2>
                  <p className="text-xs text-slate-400">Sent to {ticket.email || currentUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setShowEmailModal(false)}
                className="w-8 h-8 rounded-xl bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-4 pr-1">
              {emailLogs.length > 0 ? (
                emailLogs.map((log) => (
                  <div key={log.id} className="bg-white rounded-2xl p-4 text-slate-900 shadow-lg text-xs space-y-3">
                    <div className="border-b pb-2 flex justify-between items-center font-mono text-[11px] text-slate-600">
                      <span><strong>To:</strong> {log.recipient_email}</span>
                      <span><strong>Sent:</strong> {new Date(log.created_at).toLocaleString()}</span>
                    </div>
                    <div className="font-bold text-sm text-purple-900 border-b pb-2">
                      Subject: {log.subject}
                    </div>
                    <div 
                      className="email-body-container pt-2 overflow-x-auto max-w-full"
                      dangerouslySetInnerHTML={{ __html: log.body_html }}
                    />
                  </div>
                ))
              ) : (
                <div className="bg-slate-950 p-6 rounded-2xl text-center space-y-3 border border-white/10">
                  <p className="text-sm font-bold text-purple-300">✅ Ticket Dispatch Logged</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    The system automatically dispatches booking confirmation emails with QR codes to <strong>{ticket.email || currentUser.email}</strong> upon payment confirmation.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 shrink-0 text-right">
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetails;