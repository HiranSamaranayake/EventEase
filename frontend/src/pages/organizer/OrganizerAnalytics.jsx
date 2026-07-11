import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import {
  FaMoneyBillWave,
  FaTicketAlt,
  FaCalendarAlt,
  FaChartLine,
} from "react-icons/fa";

import { motion } from "framer-motion";



const OrganizerAnalytics = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);

  const totalRevenue =
  analytics?.monthlyRevenue?.reduce(
    (sum, item) => sum + Number(item.revenue),
    0
  ) || 0;

const totalBookings =
  analytics?.monthlyBookings?.reduce(
    (sum, item) => sum + Number(item.bookings),
    0
  ) || 0;

const totalMonths = analytics?.monthlyRevenue?.length || 0;

const averageRevenue =
  totalMonths > 0
    ? Math.round(totalRevenue / totalMonths)
    : 0;
const highestRevenue =
  analytics?.monthlyRevenue?.length > 0
    ? Math.max(
        ...analytics.monthlyRevenue.map((item) => Number(item.revenue))
      )
    : 0;

const highestBookings =
  analytics?.monthlyBookings?.length > 0
    ? Math.max(
        ...analytics.monthlyBookings.map((item) => Number(item.bookings))
      )
    : 0;



  useEffect(() => {
    fetch(
      `http://localhost/EventEase/backend/api/organizer_analytics.php?user_id=${user.id}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        setAnalytics(data);

        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-2xl font-bold">
        Loading Analytics...
      </div>
    );
  }

return (
  <motion.div
    initial={{
      opacity: 0,
      y: 30,
    }}
    animate={{
      opacity: 1,
      y: 0,
    }}
    transition={{
      duration: 0.6,
    }}
    className="space-y-8"
  >

      <h1 className="text-4xl font-bold text-purple-700">
        Organizer Analytics
      </h1>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

  <StatCard
    title="Total Revenue"
    value={`Rs ${totalRevenue}`}
    icon={<FaMoneyBillWave />}
    color="from-green-500 to-emerald-600"
  />

  <StatCard
    title="Bookings"
    value={totalBookings}
    icon={<FaTicketAlt />}
    color="from-purple-500 to-indigo-600"
  />

  <StatCard
    title="Revenue / Month"
    value={`Rs ${averageRevenue}`}
    icon={<FaChartLine />}
    color="from-pink-500 to-rose-500"
  />

  <StatCard
    title="Months"
    value={totalMonths}
    icon={<FaCalendarAlt />}
    color="from-blue-500 to-cyan-500"
  />

</div>
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.6 }}
  className="
    bg-white
    rounded-3xl
    shadow-xl
    p-8
  "
>
  <h2 className="text-2xl font-bold text-gray-800 mb-6">
    Performance Summary
  </h2>

  <div className="grid md:grid-cols-2 gap-8">

    <div>
      <p className="text-gray-500">
        Highest Monthly Revenue
      </p>

      <h3 className="text-4xl font-bold text-green-600 mt-2">
        Rs {highestRevenue}
      </h3>
    </div>

    <div>
      <p className="text-gray-500">
        Highest Monthly Bookings
      </p>

      <h3 className="text-4xl font-bold text-purple-600 mt-2">
        {highestBookings}
      </h3>
    </div>

  </div>
</motion.div>





   <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2 }}
>

  <div className="bg-white rounded-3xl shadow-xl p-8">

    <h2 className="text-2xl font-bold mb-6">
      Monthly Revenue
    </h2>

    <ResponsiveContainer width="100%" height={350}>
      ...
    </ResponsiveContainer>

  </div>

  <h2 className="text-2xl font-bold mb-6">
    Monthly Revenue
  </h2>

  <ResponsiveContainer
    width="100%"
    height={350}
  >
    <LineChart
      data={analytics.monthlyRevenue}
    >
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="month" />

      <YAxis />

      <Tooltip />

      <Line
        type="monotone"
        dataKey="revenue"
        stroke="#7C3AED"
        strokeWidth={4}
      />
    </LineChart>
  </ResponsiveContainer>
</motion.div>

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4 }}
>

  <div className="bg-white rounded-3xl shadow-xl p-8">

    <h2 className="text-2xl font-bold mb-6">
      Monthly Bookings
    </h2>

    <ResponsiveContainer width="100%" height={350}>
      ...
    </ResponsiveContainer>

  </div>

  <h2 className="text-2xl font-bold mb-6">
    Monthly Bookings
  </h2>

  <ResponsiveContainer
    width="100%"
    height={350}
  >
    <BarChart
      data={analytics.monthlyBookings}
    >
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="month" />

      <YAxis />

      <Tooltip />

      <Bar
        dataKey="bookings"
        fill="#9333EA"
      />
    </BarChart>
  </ResponsiveContainer>

</motion.div>






    </motion.div>
  );
};


const StatCard = ({ title, value, icon, color }) => (
  <motion.div
    whileHover={{
      y: -8,
      scale: 1.03,
    }}
    transition={{
      duration: 0.2,
    }}
    className={`
      rounded-3xl
      bg-gradient-to-r
      ${color}
      p-6
      text-white
      shadow-xl
      overflow-hidden
      relative
    `}
  >
    {/* Background Circle */}
    <div
      className="
        absolute
        -top-8
        -right-8
        w-28
        h-28
        rounded-full
        bg-white/10
      "
    />

    <div className="flex justify-between items-center relative z-10">
      <div>
        <p className="text-white/80 text-sm">
          {title}
        </p>

        <h2 className="text-3xl font-bold mt-2">
          {value}
        </h2>
      </div>

      <div className="text-5xl">
        {icon}
      </div>
    </div>
  </motion.div>
);




export default OrganizerAnalytics;