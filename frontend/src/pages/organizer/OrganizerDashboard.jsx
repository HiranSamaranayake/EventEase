import { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";

import DashboardCards from "../../components/DashboardCards";
import RevenueChart from "../../components/RevenueChart";
import BookingChart from "../../components/BookingChart";
import RecentBookings from "../../components/RecentBookings";
import UpcomingEvents from "../../components/UpcomingEvents";
import QuickActions from "../../components/QuickActions";
import NotificationPanel from "../../components/NotificationPanel";

const OrganizerDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetch(
      `http://localhost/EventEase/backend/api/organizer_dashboard.php?user_id=${user.id || 2}`
    )
      .then((res) => res.json())
      .then((data) => {
        setDashboard(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-xl font-bold text-gray-500">
        Loading Organizer Dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-md">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Welcome back, {user?.full_name || "Organizer"}! 👋
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Manage your live events, ticket sales, bookings, attendance forecasts, and venue seating.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-full text-xs font-black bg-purple-100 text-purple-800 border border-purple-200 uppercase">
            Verified Organizer Portal
          </span>
        </div>
      </div>

      {/* STAT CARDS */}
      <DashboardCards stats={dashboard?.stats} />

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="overflow-x-auto">
          <RevenueChart data={dashboard?.monthlyRevenue} />
        </div>
        <div className="overflow-x-auto">
          <BookingChart data={dashboard?.monthlyBookings} />
        </div>
      </div>

      {/* LOWER SECTION: BOOKINGS & EVENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="overflow-x-auto">
          <RecentBookings bookings={dashboard?.recentBookings} />
        </div>
        <div className="overflow-x-auto">
          <UpcomingEvents events={dashboard?.upcomingEvents} />
        </div>
      </div>

      {/* QUICK ACTIONS & NOTIFICATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActions />
        <NotificationPanel notifications={dashboard?.notifications} />
      </div>
    </div>
  );
};

export default OrganizerDashboard;