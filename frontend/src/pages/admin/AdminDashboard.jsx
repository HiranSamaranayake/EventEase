import React, { useState, useEffect } from "react";
import { 
  FaUsers, 
  FaUserTie, 
  FaCalendarAlt, 
  FaTicketAlt, 
  FaMoneyBillWave, 
  FaChartLine,
  FaArrowUp,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaShieldAlt,
  FaHeadset,
  FaSync
} from "react-icons/fa";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [stats, setStats] = useState({
    users: 0,
    organizers: 0,
    events: 0,
    bookings: 0,
    tickets: 0,
    revenue: 0,
    monthly: [],
    recent_events: [],
    recent_bookings: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost/EventEase/backend/api/admin_dashboard_stats.php");
      const data = await res.json();
      if (data && data.success) {
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to load admin stats:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      {/* HERO WELCOME BANNER */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-purple-950 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-purple-200 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Live System Monitoring Active
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            Welcome Back, {user.full_name || "Administrator"}!
          </h1>
          <p className="text-purple-200 text-sm">
            Here is your live SaaS performance overview across users, ticket sales, platform revenue, and recent events.
          </p>
        </div>

        <div className="z-10 flex flex-wrap gap-3">
          <Link
            to="/admin-organizers"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-extrabold rounded-xl border border-white/20 transition flex items-center gap-2"
          >
            <FaUserTie /> Verify Organizers
          </Link>
          <Link
            to="/admin-complaints"
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-purple-600/30 transition flex items-center gap-2"
          >
            <FaHeadset /> Support Desk
          </Link>
          <button
            onClick={fetchDashboardStats}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition"
            title="Refresh Data"
          >
            <FaSync className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* METRICS STAT CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Registered Users"
          value={stats.users.toLocaleString()}
          subtitle={`${stats.organizers} Registered Organizers`}
          icon={<FaUsers />}
          color="from-purple-500 to-indigo-600"
        />
        <StatCard
          title="Active Events Catalog"
          value={stats.events.toLocaleString()}
          subtitle="Events Listed Platform-Wide"
          icon={<FaCalendarAlt />}
          color="from-indigo-500 to-blue-600"
        />
        <StatCard
          title="Total Bookings & Tickets"
          value={stats.bookings.toLocaleString()}
          subtitle={`${stats.tickets} Issued Tickets`}
          icon={<FaTicketAlt />}
          color="from-blue-500 to-teal-600"
        />
        <StatCard
          title="Gross Platform Revenue"
          value={`LKR ${stats.revenue.toLocaleString()}`}
          subtitle="Confirmed Completed Payments"
          icon={<FaMoneyBillWave />}
          color="from-emerald-500 to-teal-700"
        />
      </div>

      {/* ANALYTICS CHARTS SECTION */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* REVENUE GROWTH CHART */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black text-gray-900">Revenue Growth Analytics</h2>
              <p className="text-xs text-gray-500">Monthly revenue trends across confirmed ticket bookings</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-100 flex items-center gap-1">
              <FaChartLine /> Live Metric
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthly}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e1b4b", borderRadius: "12px", border: "none", color: "#fff", fontSize: "12px" }}
                  formatter={(val) => [`LKR ${Number(val).toLocaleString()}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BOOKING TICKET DISTRIBUTION CHART */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black text-gray-900">Ticket Booking Volume</h2>
              <p className="text-xs text-gray-500">Monthly completed ticket reservations</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100 flex items-center gap-1">
              <FaTicketAlt /> Volume Trace
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthly}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "none", color: "#fff", fontSize: "12px" }}
                  formatter={(val) => [`${val} Bookings`, "Volume"]}
                />
                <Bar dataKey="bookings" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* RECENT DATA FEEDS GRID */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* LATEST EVENTS MODERATION LIST */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 space-y-5">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">Latest Event Submissions</h2>
              <p className="text-xs text-gray-500">Recent events submitted by organizers for platform review</p>
            </div>
            <Link to="/admin-events" className="text-xs font-bold text-purple-700 hover:text-purple-900 transition">
              View All Events &rarr;
            </Link>
          </div>

          {stats.recent_events.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-400 bg-gray-50 rounded-2xl">No recent event submissions found.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {stats.recent_events.map((ev) => (
                <div key={ev.id} className="py-3.5 flex justify-between items-center gap-4 hover:bg-gray-50/60 p-2 rounded-xl transition">
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">{ev.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span>📅 {ev.event_date}</span>
                      <span>📍 {ev.location || "N/A"}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                      ev.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      ev.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {ev.status || 'pending'}
                    </span>
                    <span className="text-xs font-mono font-bold text-gray-700">LKR {Number(ev.price || 0).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* LATEST BOOKINGS STREAM */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 space-y-5">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">Recent Booking Transactions</h2>
              <p className="text-xs text-gray-500">Live ticket bookings placed across events</p>
            </div>
            <Link to="/admin-bookings" className="text-xs font-bold text-purple-700 hover:text-purple-900 transition">
              View All Bookings &rarr;
            </Link>
          </div>

          {stats.recent_bookings.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-400 bg-gray-50 rounded-2xl">No recent customer bookings found.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {stats.recent_bookings.map((item) => (
                <div key={item.id} className="py-3.5 flex justify-between items-center gap-4 hover:bg-gray-50/60 p-2 rounded-xl transition">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-purple-700">#{item.id}</span>
                      <h3 className="font-bold text-sm text-gray-900">{item.event || "Event Reservation"}</h3>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Customer: <span className="font-semibold text-gray-800">{item.customer || "Registered Customer"}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                      item.booking_status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      item.booking_status === 'Cancelled' ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {item.booking_status || 'Pending'}
                    </span>
                    <span className="text-xs font-mono font-bold text-gray-900">LKR {Number(item.total_amount || 0).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, subtitle, icon, color }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 relative overflow-hidden flex flex-col justify-between"
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{title}</p>
          <h2 className="text-2xl font-black text-gray-900 mt-1">{value}</h2>
        </div>
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} text-white flex items-center justify-center text-xl shadow-md`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1 text-xs text-gray-500 font-medium">
        <FaArrowUp className="text-emerald-500 text-[10px]" /> {subtitle}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;