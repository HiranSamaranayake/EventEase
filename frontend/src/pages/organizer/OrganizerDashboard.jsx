import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
const user = JSON.parse(localStorage.getItem("user"));

useEffect(() => {
fetch(
`http://localhost/EventEase/backend/api/organizer_dashboard.php?user_id=${user.id}`
)   .then(res => res.json())
        .then(data => {
            setDashboard(data);
            setLoading(false);
        });
}, []);

if (loading) {
  return (
    <div className="flex justify-center items-center h-screen text-2xl">
      Loading Dashboard...
    </div>
  );
}





  return (

    <div
      className="
      min-h-screen
      bg-gray-100
      p-6
      "
    >


      {/* HEADER */}

      <div
        className="
        flex
        justify-between
        items-center
        mb-8
        "
      >

        <div>

          <h1
            className="
            text-4xl
            font-bold
            text-gray-800
            "
          >
            Organizer Dashboard
          </h1>


          <p
            className="
            text-gray-500
            mt-2
            "
          >
            Manage your events, bookings and revenue
          </p>


        </div>



        <div
          className="
          bg-white
          p-4
          rounded-xl
          shadow
          "
        >

          <FaBell
            className="
            text-purple-600
            text-2xl
            "
          />

        </div>


      </div>




      {/* STAT CARDS */}

<DashboardCards stats={dashboard?.stats} />





      {/* CHARTS */}


      <div
        className="
        grid
        lg:grid-cols-2
        gap-6
        mt-8
        "
      >

       <RevenueChart data={dashboard?.monthlyRevenue} />

     <BookingChart data={dashboard?.monthlyBookings} />

      </div>





      {/* LOWER SECTION */}


      <div
        className="
        grid
        lg:grid-cols-2
        gap-6
        mt-8
        "
      >

     <RecentBookings bookings={dashboard?.recentBookings} />

  <UpcomingEvents events={dashboard?.upcomingEvents} />

      </div>





      {/* ACTION + NOTIFICATIONS */}


      <div
        className="
        grid
        lg:grid-cols-2
        gap-6
        mt-8
        "
      >


        <QuickActions/>


  <NotificationPanel notifications={dashboard?.notifications} />


      </div>



    </div>

  );

};


export default OrganizerDashboard;