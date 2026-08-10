import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTicketAlt, FaFilePdf, FaBan, FaCheckCircle, FaExclamationTriangle, FaUndo, FaClock, FaBullhorn, FaTimes, FaInfoCircle } from "react-icons/fa";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  // Broadcast Modal State
  const [selectedBookingForBroadcast, setSelectedBookingForBroadcast] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    setLoading(true);
    fetch(`http://localhost/EventEase/backend/api/my_bookings.php?user_id=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBookings(data.bookings);
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  const handleOpenBroadcastModal = (booking) => {
    setSelectedBookingForBroadcast(booking);
    setLoadingAnnouncements(true);
    const eventId = booking.event_id || booking.id;
    fetch(`http://localhost/EventEase/backend/api/get_event_announcements.php?event_id=${eventId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setAnnouncements(data.data || []);
        } else {
          setAnnouncements([]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingAnnouncements(false));
  };

  const handleCancelBooking = async () => {
    if (!selectedBookingForCancel) return;

    setCancelLoading(true);
    try {
      const res = await fetch("http://localhost/EventEase/backend/api/cancel_booking.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id: selectedBookingForCancel.id,
          user_id: user.id,
          reason: cancelReason
        })
      });

      const data = await res.json();
      if (data.success) {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === selectedBookingForCancel.id
              ? {
                  ...b,
                  booking_status: "Cancelled",
                  payment_status: data.payment_status,
                  status: "cancelled"
                }
              : b
          )
        );

        setToastMsg(data.message);
        setTimeout(() => setToastMsg(null), 4000);
        setSelectedBookingForCancel(null);
        setCancelReason("");
      } else {
        alert(data.message || "Failed to cancel booking");
      }
    } catch (err) {
      console.error(err);
      alert("Error cancelling booking");
    } finally {
      setCancelLoading(false);
    }
  };

  const handleDownloadPdfBlob = async (bookingId) => {
    const downloadUrl = `http://localhost/EventEase/backend/api/download_ticket_pdf.php?booking_id=${bookingId}`;
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
      link.download = `Ticket-EVT-${bookingId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 2000);
    } catch (e) {
      window.open(downloadUrl, "_blank");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Bookings & Event Passes</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your event reservations, view organizer broadcast notices, download PDF tickets, or request cancellations.</p>
        </div>
      </div>

      {toastMsg && (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 px-6 py-4 rounded-2xl shadow flex items-center justify-between text-sm font-semibold animate-fadeIn">
          <span className="flex items-center gap-2">
            <FaCheckCircle className="text-amber-600 text-base" /> {toastMsg}
          </span>
          <button onClick={() => setToastMsg(null)} className="text-gray-500 hover:text-gray-800">✕</button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-3xl shadow p-12 text-center border border-gray-100 max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto text-purple-600 text-2xl">
            🎟️
          </div>
          <h2 className="text-2xl font-bold text-gray-800">No Bookings Yet</h2>
          <p className="text-gray-500 text-sm">You haven't booked any event tickets yet.</p>
          <Link
            to="/events"
            className="inline-block px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm rounded-xl shadow transition"
          >
            Explore Events
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4 pl-6">Event Title</th>
                  <th className="p-4">Event Date</th>
                  <th className="p-4">Booked On</th>
                  <th className="p-4">Ticket Code</th>
                  <th className="p-4">Booking Status</th>
                  <th className="p-4">Payment Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-sm">
                {bookings.map((booking) => {
                  const isCancelled = booking.booking_status === "Cancelled" || booking.status === "cancelled";
                  const isRefundRequested = booking.payment_status === "Refund Requested";
                  const isRefunded = booking.payment_status === "Refunded";

                  return (
                    <tr key={booking.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4 pl-6 font-bold text-gray-900">
                        <button
                          onClick={() => handleOpenBroadcastModal(booking)}
                          className="hover:text-purple-700 text-left cursor-pointer flex items-center gap-1.5"
                          title="Click to view Organizer Broadcast Messages"
                        >
                          {booking.title}
                          <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold">
                            📢 Alerts
                          </span>
                        </button>
                      </td>
                      <td className="p-4 text-gray-600">{booking.event_date}</td>
                      <td className="p-4 text-gray-500 text-xs">{booking.booking_date}</td>
                      <td className="p-4">
                        <span className="bg-purple-100 text-purple-800 font-mono text-xs px-3 py-1 rounded-full font-bold">
                          {booking.ticket_code || `EVT-${booking.id}`}
                        </span>
                      </td>

                      {/* Booking Status Badge */}
                      <td className="p-4">
                        {isCancelled ? (
                          <span className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-xs font-extrabold inline-flex items-center gap-1">
                            <FaBan className="text-xs" /> Cancelled
                          </span>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-extrabold inline-flex items-center gap-1">
                            <FaCheckCircle className="text-xs" /> Confirmed
                          </span>
                        )}
                      </td>

                      {/* Payment / Refund Status Badge */}
                      <td className="p-4">
                        {isRefunded ? (
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                            <FaUndo className="text-xs" /> Refunded
                          </span>
                        ) : isRefundRequested ? (
                          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                            <FaClock className="text-xs" /> Refund Pending
                          </span>
                        ) : isCancelled ? (
                          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
                            Cancelled
                          </span>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
                            {booking.payment_status || "Paid"}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          <button
                            onClick={() => handleOpenBroadcastModal(booking)}
                            className="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer"
                            title="View Organizer Broadcast Messages"
                          >
                            <FaBullhorn /> Broadcast Messages
                          </button>

                          {!isCancelled && (
                            <>
                              <button
                                onClick={() => navigate(`/ticket/${booking.id}`)}
                                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1"
                              >
                                <FaTicketAlt /> Ticket
                              </button>

                              <button
                                onClick={() => handleDownloadPdfBlob(booking.id)}
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1 cursor-pointer"
                                title="Download Official PDF Ticket Pass"
                              >
                                <FaFilePdf /> PDF
                              </button>

                              <button
                                onClick={() => setSelectedBookingForCancel(booking)}
                                className="px-3.5 py-1.5 bg-rose-100 hover:bg-rose-600 text-rose-700 hover:text-white font-bold text-xs rounded-xl border border-rose-200 transition flex items-center gap-1"
                                title="Cancel Booking"
                              >
                                <FaBan /> Cancel
                              </button>
                            </>
                          )}

                          {isCancelled && (
                            <span className="text-xs text-gray-400 font-medium italic">Cancelled</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Broadcast Messages Modal */}
      {selectedBookingForBroadcast && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-purple-100 animate-scaleUp">
            <div className="p-6 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex justify-between items-center">
              <div>
                <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">ORGANIZER BROADCAST ALERTS</span>
                <h3 className="text-xl font-black text-white mt-1 flex items-center gap-2">
                  <FaBullhorn className="text-amber-400" /> {selectedBookingForBroadcast.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBookingForBroadcast(null)}
                className="text-purple-200 hover:text-white text-2xl transition cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {loadingAnnouncements ? (
                <div className="py-12 text-center text-gray-400 text-xs font-bold">
                  Loading organizer broadcast messages...
                </div>
              ) : announcements.length === 0 ? (
                <div className="py-12 text-center bg-purple-50 rounded-2xl border border-purple-100 p-6 space-y-2">
                  <FaInfoCircle className="mx-auto text-3xl text-purple-400" />
                  <p className="font-extrabold text-gray-800 text-sm">No Broadcast Messages Yet</p>
                  <p className="text-xs text-gray-500">The event organizer has not sent any urgent notices or advisories for this event yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {announcements.map((item) => (
                    <div key={item.id} className="bg-slate-900 text-white rounded-2xl p-5 space-y-3 shadow-lg border border-purple-800/40">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-purple-800/40 pb-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                            item.priority === 'emergency' ? 'bg-rose-500 text-white' :
                            item.priority === 'urgent' ? 'bg-amber-400 text-amber-950' : 'bg-purple-600 text-white'
                          }`}>
                            {item.priority || 'Notice'}
                          </span>
                          <h4 className="font-extrabold text-sm text-white">{item.title}</h4>
                        </div>
                        <span className="text-[11px] text-purple-300 font-mono">
                          ⏰ {new Date(item.created_at).toLocaleString()}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-purple-100 leading-relaxed font-medium">
                        {item.message}
                      </p>

                      <div className="text-[11px] text-purple-300/80 font-mono pt-1 flex justify-between">
                        <span>Broadcast Target: {item.broadcast_type ? item.broadcast_type.replace('_', ' ') : 'All Attendees'}</span>
                        <span className="text-emerald-400 font-bold">✓ Official Organizer Notice</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t text-right">
              <button
                onClick={() => setSelectedBookingForBroadcast(null)}
                className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
              >
                Close Broadcast Modal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {selectedBookingForCancel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 animate-scaleUp">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-2xl shrink-0">
                <FaExclamationTriangle />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900">Cancel Booking</h3>
                <p className="text-xs text-gray-500">{selectedBookingForCancel.title}</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to cancel this booking? If you have paid online, a refund request will be submitted to the Financial Admin for processing.
            </p>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Reason for Cancellation (Optional)</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Why are you cancelling?"
                className="w-full p-3 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-rose-500"
                rows="3"
              ></textarea>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSelectedBookingForCancel(null)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={cancelLoading}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow transition"
              >
                {cancelLoading ? "Cancelling..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
