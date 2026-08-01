import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaCheckDouble, FaTicketAlt, FaClock, FaShieldAlt, FaUndo, FaInfoCircle } from "react-icons/fa";

const NotificationCenter = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState("all"); // 'all' | 'unread'
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;
    fetchNotifications();

    // Poll every 30 seconds for live updates
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`http://localhost/EventEase/backend/api/get_notifications.php?user_id=${userId}`);
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unread_count || 0);
      }
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await fetch("http://localhost/EventEase/backend/api/mark_notifications_read.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          notification_id: notificationId
        })
      });

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: "1" } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification read", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch("http://localhost/EventEase/backend/api/mark_notifications_read.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          mark_all: true
        })
      });

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: "1" })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all read", err);
    }
  };

  const handleNotificationClick = (item) => {
    if (parseInt(item.is_read) === 0) {
      handleMarkAsRead(item.id);
    }
    if (item.link) {
      navigate(item.link);
      setIsOpen(false);
    }
  };

  const filteredList = notifications.filter((n) => {
    if (filter === "unread") return parseInt(n.is_read) === 0;
    return true;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case "booking":
        return <FaTicketAlt className="text-purple-400" />;
      case "waiting_list":
        return <FaClock className="text-amber-400" />;
      case "verification":
        return <FaShieldAlt className="text-emerald-400" />;
      case "refund":
        return <FaUndo className="text-blue-400" />;
      default:
        return <FaInfoCircle className="text-purple-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white transition backdrop-blur-md flex items-center justify-center"
        title="In-App Notification Center"
      >
        <FaBell className="text-lg text-slate-200 hover:text-purple-300 transition" />

        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-slate-950 animate-pulse shadow-lg">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-slate-900/95 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-2xl z-50 overflow-hidden text-slate-100 animate-fadeIn">
          {/* Header */}
          <div className="p-4 px-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <h3 className="font-black text-sm text-white">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} New
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-[11px] font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition"
              >
                <FaCheckDouble className="text-xs" /> Mark all read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-white/10 text-xs font-bold bg-black/20">
            <button
              onClick={() => setFilter("all")}
              className={`flex-1 py-2 text-center transition ${
                filter === "all" ? "text-purple-400 border-b-2 border-purple-500 bg-white/5" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`flex-1 py-2 text-center transition ${
                filter === "unread" ? "text-purple-400 border-b-2 border-purple-500 bg-white/5" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* List Content */}
          <div className="max-h-80 overflow-y-auto divide-y divide-white/5 scrollbar-thin">
            {filteredList.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <p className="text-2xl">🔔</p>
                <p className="text-xs font-semibold text-slate-400">No notifications found.</p>
              </div>
            ) : (
              filteredList.map((item) => {
                const isUnread = parseInt(item.is_read) === 0;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    className={`p-4 transition cursor-pointer hover:bg-white/5 flex gap-3 ${
                      isUnread ? "bg-purple-950/30 font-semibold" : "opacity-80"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      {getNotificationIcon(item.type)}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={`text-xs font-bold ${isUnread ? "text-white" : "text-slate-300"}`}>
                          {item.title}
                        </h4>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">{item.message}</p>
                      <span className="text-[9px] text-slate-500 block font-mono">
                        {item.created_at || "Recently"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
