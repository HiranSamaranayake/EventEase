import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaClock,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaTimes,
  FaArrowLeft,
  FaTags,
  FaUserClock,
  FaCheckCircle,
  FaExclamationCircle
} from "react-icons/fa";

const WaitingList = () => {
  const [waitingList, setWaitingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchWaitingList();
  }, []);

  const fetchWaitingList = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost/EventEase/backend/api/my_waiting_list.php?user_id=${user.id}`
      );
      const data = await response.json();
      if (data.success) {
        setWaitingList(data.waiting_list);
      }
    } catch (err) {
      console.error("Failed to load waiting list", err);
    } finally {
      setLoading(false);
    }
  };

  const leaveWaitingList = async (eventId, eventTitle) => {
    try {
      const response = await fetch(
        "http://localhost/EventEase/backend/api/join_waiting_list.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id, event_id: eventId, action: "leave" })
        }
      );
      const data = await response.json();
      if (data.success) {
        setWaitingList((prev) => prev.filter((item) => parseInt(item.event_id) !== parseInt(eventId)));
      }
    } catch (err) {
      console.error("Failed to leave waiting list", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-600/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10 relative z-10">
        
        {/* Navigation Top Bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/customer-dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-purple-300 hover:text-white transition backdrop-blur-md"
          >
            <FaArrowLeft /> Back to Dashboard
          </Link>

          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <FaUserClock className="text-amber-400" /> Priority Waiting Line
          </span>
        </div>

        {/* Hero Banner Section */}
        <div className="relative rounded-[2.5rem] bg-gradient-to-r from-amber-950/90 via-slate-900/90 to-purple-950/90 p-8 sm:p-12 border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-200 text-xs font-bold uppercase tracking-wider border border-white/10">
                <FaClock className="text-amber-400" /> Priority Reservation Queue
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                My <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent">Waiting Lists</span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Track your real-time queue position for sold-out events. If another customer cancels a reservation, you will be notified to claim your seat!
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 px-6 text-center backdrop-blur-md self-start lg:self-center">
              <span className="text-xs text-slate-400 font-medium block uppercase tracking-wider">Active Queues</span>
              <span className="text-3xl font-black text-amber-400 mt-1 block">
                {waitingList.length}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-14 h-14 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 text-xs font-semibold">Loading your waiting list queues...</p>
          </div>
        ) : waitingList.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-12 sm:p-16 text-center max-w-2xl mx-auto space-y-6 backdrop-blur-xl shadow-2xl">
            <div className="w-24 h-24 bg-amber-500/10 border border-amber-500/30 rounded-3xl flex items-center justify-center mx-auto text-amber-400 text-4xl shadow-inner">
              <FaUserClock />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">No Active Waiting List Queues</h2>
              <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                You are currently not on any waiting lists. When an event is sold out, click "Join Waiting List" to reserve your spot in line!
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/events"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-amber-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 text-white font-extrabold text-sm rounded-2xl shadow-xl transition"
              >
                Browse Events
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {waitingList.map((item) => (
              <div
                key={item.wait_id}
                className="bg-slate-900/90 border border-white/10 rounded-[2rem] overflow-hidden shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1 transition duration-300 flex flex-col justify-between backdrop-blur-md group"
              >
                <div>
                  {/* Event Image Banner */}
                  <div className="relative h-48 bg-slate-800 overflow-hidden">
                    {item.image ? (
                      <img
                        src={`http://localhost/EventEase/backend/uploads/${item.image}`}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-amber-950 via-slate-900 to-purple-950 flex items-center justify-center text-white text-5xl">
                        🎟️
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30"></div>

                    {/* Category Pill */}
                    <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 text-amber-300 font-extrabold text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1.5">
                      <FaTags className="text-amber-400" /> {item.category || "General"}
                    </span>

                    {/* Queue Position Pill */}
                    <span className="absolute top-4 right-4 bg-amber-500 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                      <FaUserClock /> Line Position #{item.position}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-black text-white group-hover:text-amber-400 transition line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-xs font-semibold text-amber-400/90 mt-1">
                        Organized by {item.organization_name || "Verified Organizer"}
                      </p>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300 border-t border-white/10 pt-4">
                      <div className="flex items-center gap-2.5">
                        <FaCalendarAlt className="text-indigo-400" />
                        <span>{item.event_date}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <FaMapMarkerAlt className="text-rose-400" />
                        <span className="line-clamp-1">{item.location || "Venue TBD"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status & Leave Action */}
                <div className="p-6 pt-0 space-y-3">
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-center">
                    <span className="text-[11px] font-bold text-amber-300 flex items-center justify-center gap-1.5">
                      <FaClock className="animate-spin text-xs" /> Position #{item.position} in Priority Queue
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => leaveWaitingList(item.event_id, item.title)}
                      className="flex-1 py-2.5 px-4 bg-white/5 hover:bg-rose-600/20 hover:text-rose-300 border border-white/10 text-slate-300 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      <FaTimes className="text-xs" /> Leave Queue
                    </button>

                    <Link
                      to={`/event/${item.event_id}`}
                      className="py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1 shadow-md shadow-amber-500/20"
                    >
                      View Event
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitingList;
