// import { useEffect, useState } from "react";

// import {
//   FaUsers,
//   FaUserTie,
//   FaCalendarAlt,
//   FaTicketAlt,
//   FaMoneyBillWave,
//   FaChartLine,
// } from "react-icons/fa";

// import {
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
// } from "recharts";

// import { motion } from "framer-motion";

// const AdminDashboard = () => {
//   const [stats, setStats] = useState(null);

//   const [loading, setLoading] = useState(true);

//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetch("http://localhost/EventEase/backend/api/admin_dashboard_stats.php")
//       .then((res) => res.json())

//       .then((data) => {
//         console.log(data);

//         if (data.success) {
//           setStats(data);
//         } else {
//           setError(data.message || "Failed to load dashboard");
//         }

//         setLoading(false);
//       })

//       .catch((err) => {
//         console.log(err);

//         setError("Cannot connect to server");

//         setLoading(false);
//       });
//   }, []);

//   if (loading) {
//     return (
//       <div
//         className="
//             p-10
//             text-xl
//             font-semibold
//             "
//       >
//         Loading Dashboard...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div
//         className="
//             p-10
//             "
//       >
//         <div
//           className="
//                 bg-red-100
//                 text-red-700
//                 p-5
//                 rounded-xl
//                 "
//         >
//           {error}
//         </div>
//       </div>
//     );
//   }

//   const chartData = stats?.monthly || [];

//   return (
//     <div>
//       <h1
//         className="
// text-4xl
// font-bold
// text-gray-800
// mb-8
// "
//       >
//         Admin Dashboard
//       </h1>

//       {/* STAT CARDS */}

//       <div
//         className="
// grid
// grid-cols-1
// md:grid-cols-2
// xl:grid-cols-6
// gap-6
// mb-10
// "
//       >
//         <StatCard title="Users" value={stats?.users || 0} icon={<FaUsers />} />

//         <StatCard
//           title="Organizers"
//           value={stats?.organizers || 0}
//           icon={<FaUserTie />}
//         />

//         <StatCard
//           title="Events"
//           value={stats?.events || 0}
//           icon={<FaCalendarAlt />}
//         />

//         <StatCard
//           title="Bookings"
//           value={stats?.bookings || 0}
//           icon={<FaTicketAlt />}
//         />

//         <StatCard
//           title="Tickets"
//           value={stats?.tickets || 0}
//           icon={<FaChartLine />}
//         />

//         <StatCard
//           title="Revenue"
//           value={`Rs ${stats?.revenue || 0}`}
//           icon={<FaMoneyBillWave />}
//         />
//       </div>

//       {/* CHART AREA */}

//       <div
//         className="
// grid
// lg:grid-cols-2
// gap-8
// mb-10
// "
//       >
//         <div
//           className="
// bg-white
// rounded-2xl
// shadow
// p-6
// "
//         >
//           <h2
//             className="
// text-xl
// font-bold
// mb-5
// "
//           >
//             Revenue Analytics
//           </h2>

//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={chartData}>
//               <CartesianGrid strokeDasharray="3 3" />

//               <XAxis dataKey="month" />

//               <YAxis />

//               <Tooltip />

//               <Line type="monotone" dataKey="revenue" />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         <div
//           className="
// bg-white
// rounded-2xl
// shadow
// p-6
// "
//         >
//           <h2
//             className="
// text-xl
// font-bold
// mb-5
// "
//           >
//             Booking Analytics
//           </h2>

//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={chartData}>
//               <CartesianGrid strokeDasharray="3 3" />

//               <XAxis dataKey="month" />

//               <YAxis />

//               <Tooltip />

//               <Bar dataKey="bookings" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* RECENT SECTIONS */}

//       <div
//         className="
// grid
// lg:grid-cols-2
// gap-8
// "
//       >
//         <div
//           className="
// bg-white
// rounded-2xl
// shadow
// p-6
// "
//         >
//           <h2
//             className="
// text-xl
// font-bold
// mb-5
// "
//           >
//             Recent Events
//           </h2>

//           {stats?.recent_events?.length > 0 ? (
//             stats.recent_events.map((event) => (
//               <div
//                 key={event.id}
//                 className="
// border-b
// py-3
// "
//               >
//                 <p
//                   className="
// font-semibold
// "
//                 >
//                   {event.title}
//                 </p>

//                 <p
//                   className="
// text-gray-500
// "
//                 >
//                   {event.event_date}
//                 </p>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500">No recent events</p>
//           )}
//         </div>

//         <div
//           className="
// bg-white
// rounded-2xl
// shadow
// p-6
// "
//         >
//           <h2
//             className="
// text-xl
// font-bold
// mb-5
// "
//           >
//             Recent Bookings
//           </h2>

//           {stats?.recent_bookings?.length > 0 ? (
//             stats.recent_bookings.map((item) => (
//               <div
//                 key={item.id}
//                 className="
// border-b
// py-3
// "
//               >
//                 <p className="font-semibold">{item.event}</p>

//                 <p className="text-gray-500">{item.customer}</p>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500">No recent bookings</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const StatCard = ({
//   title,

//   value,

//   icon,
// }) => {
//   return (
//     <motion.div
//       whileHover={{
//         scale: 1.05,
//       }}
//       className="
// bg-white
// rounded-2xl
// shadow
// p-6
// flex
// items-center
// justify-between
// "
//     >
//       <div>
//         <p
//           className="
// text-gray-500
// "
//         >
//           {title}
//         </p>

//         <h2
//           className="
// text-3xl
// font-bold
// mt-2
// "
//         >
//           {value}
//         </h2>
//       </div>

//       <div
//         className="
// text-4xl
// text-purple-600
// "
//       >
//         {icon}
//       </div>
//     </motion.div>
//   );
// };

// export default AdminDashboard;

import {
  FaUsers,
  FaUserTie,
  FaCalendarAlt,
  FaTicketAlt,
  FaMoneyBillWave,
  FaChartLine,
} from "react-icons/fa";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { motion } from "framer-motion";

const AdminDashboard = () => {
  const stats = {
    users: 1250,

    organizers: 185,

    events: 342,

    bookings: 5680,

    tickets: 12450,

    revenue: 2450000,

    monthly: [
      {
        month: "Jan",
        revenue: 350000,
        bookings: 620,
      },

      {
        month: "Feb",
        revenue: 420000,
        bookings: 850,
      },

      {
        month: "Mar",
        revenue: 520000,
        bookings: 1100,
      },

      {
        month: "Apr",
        revenue: 680000,
        bookings: 1450,
      },

      {
        month: "May",
        revenue: 850000,
        bookings: 1900,
      },

      {
        month: "Jun",
        revenue: 980000,
        bookings: 2300,
      },
    ],

    recent_events: [
      {
        id: 1,
        title: "Colombo Music Festival",
        event_date: "2026-08-15",
        location: "Colombo",
      },

      {
        id: 2,
        title: "Tech Innovation Summit",
        event_date: "2026-09-05",
        location: "Kandy",
      },

      {
        id: 3,
        title: "Food Carnival",
        event_date: "2026-10-12",
        location: "Galle",
      },

      {
        id: 4,
        title: "Business Expo 2026",
        event_date: "2026-11-20",
        location: "Colombo",
      },
    ],

    recent_bookings: [
      {
        id: 1,
        event: "Colombo Music Festival",
        customer: "Kasun Perera",
      },

      {
        id: 2,
        event: "Tech Innovation Summit",
        customer: "Nimal Silva",
      },

      {
        id: 3,
        event: "Food Carnival",
        customer: "Amal Fernando",
      },

      {
        id: 4,
        event: "Business Expo 2026",
        customer: "Saman Jayasuriya",
      },
    ],
  };

  const chartData = stats.monthly;

  return (
    <div>
      <h1
        className="
text-4xl
font-bold
text-gray-800
mb-8
"
      >
        Admin Dashboard
      </h1>

      {/* STAT CARDS */}

      <div
        className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-6
gap-6
mb-10
"
      >
        <StatCard title="Users" value={stats.users} icon={<FaUsers />} />

        <StatCard
          title="Organizers"
          value={stats.organizers}
          icon={<FaUserTie />}
        />

        <StatCard
          title="Events"
          value={stats.events}
          icon={<FaCalendarAlt />}
        />

        <StatCard
          title="Bookings"
          value={stats.bookings}
          icon={<FaTicketAlt />}
        />

        <StatCard
          title="Tickets Sold"
          value={stats.tickets}
          icon={<FaChartLine />}
        />

        <StatCard
          title="Revenue"
          value={`Rs ${stats.revenue.toLocaleString()}`}
          icon={<FaMoneyBillWave />}
        />
      </div>

      {/* CHARTS */}

      <div
        className="
grid
lg:grid-cols-2
gap-8
mb-10
"
      >
        <div
          className="
bg-white
rounded-2xl
shadow-xl
p-6
"
        >
          <h2
            className="
text-xl
font-bold
mb-5
"
          >
            Revenue Growth
          </h2>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Line type="monotone" dataKey="revenue" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div
          className="
bg-white
rounded-2xl
shadow-xl
p-6
"
        >
          <h2
            className="
text-xl
font-bold
mb-5
"
          >
            Booking Growth
          </h2>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="bookings" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RECENT DATA */}

      <div
        className="
grid
lg:grid-cols-2
gap-8
"
      >
        <div
          className="
bg-white
rounded-2xl
shadow-xl
p-6
"
        >
          <h2
            className="
text-2xl
font-bold
mb-5
"
          >
            Latest Events
          </h2>

          {stats.recent_events.map((event) => (
            <div
              key={event.id}
              className="
border-b
py-4
"
            >
              <h3
                className="
font-bold
text-lg
"
              >
                {event.title}
              </h3>

              <p
                className="
text-gray-500
"
              >
                📅 {event.event_date}
              </p>

              <p
                className="
text-gray-500
"
              >
                📍 {event.location}
              </p>
            </div>
          ))}
        </div>

        <div
          className="
bg-white
rounded-2xl
shadow-xl
p-6
"
        >
          <h2
            className="
text-2xl
font-bold
mb-5
"
          >
            Latest Bookings
          </h2>

          {stats.recent_bookings.map((item) => (
            <div
              key={item.id}
              className="
border-b
py-4
"
            >
              <h3
                className="
font-bold
"
              >
                {item.event}
              </h3>

              <p
                className="
text-gray-500
"
              >
                Customer: {item.customer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
      }}
      className="
bg-white
rounded-2xl
shadow-xl
p-6
flex
items-center
justify-between
border
"
    >
      <div>
        <p
          className="
text-gray-500
"
        >
          {title}
        </p>

        <h2
          className="
text-3xl
font-bold
mt-2
"
        >
          {value}
        </h2>
      </div>

      <div
        className="
text-purple-600
text-4xl
"
      >
        {icon}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
