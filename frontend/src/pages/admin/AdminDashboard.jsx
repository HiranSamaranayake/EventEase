import { useState } from "react";

import {
  FaUsers,
  FaUserTie,
  FaCalendarAlt,
  FaTicketAlt,
  FaMoneyBillWave,
  FaChartLine,
  FaMoon,
  FaSun,
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


  const [darkMode, setDarkMode] = useState(false);



  const stats = {

    users: 1250,

    organizers: 185,

    events: 342,

    bookings: 5680,

    tickets: 12450,

    revenue: 2450000,


    monthly: [

      {
        month:"Jan",
        revenue:350000,
        bookings:620,
      },

      {
        month:"Feb",
        revenue:420000,
        bookings:850,
      },

      {
        month:"Mar",
        revenue:520000,
        bookings:1100,
      },

      {
        month:"Apr",
        revenue:680000,
        bookings:1450,
      },

      {
        month:"May",
        revenue:850000,
        bookings:1900,
      },

      {
        month:"Jun",
        revenue:980000,
        bookings:2300,
      }

    ],



    recent_events:[

      {
        id:1,
        title:"Colombo Music Festival",
        event_date:"2026-08-15",
        location:"Colombo"
      },

      {
        id:2,
        title:"Tech Innovation Summit",
        event_date:"2026-09-05",
        location:"Kandy"
      },

      {
        id:3,
        title:"Food Carnival",
        event_date:"2026-10-12",
        location:"Galle"
      },

      {
        id:4,
        title:"Business Expo 2026",
        event_date:"2026-11-20",
        location:"Colombo"
      }

    ],



    recent_bookings:[

      {
        id:1,
        event:"Colombo Music Festival",
        customer:"Kasun Perera"
      },

      {
        id:2,
        event:"Tech Innovation Summit",
        customer:"Nimal Silva"
      },

      {
        id:3,
        event:"Food Carnival",
        customer:"Amal Fernando"
      },

      {
        id:4,
        event:"Business Expo 2026",
        customer:"Saman Jayasuriya"
      }

    ]

  };



  const chartData = stats.monthly;



  return (

<div

className={

darkMode

?

"min-h-screen bg-gray-900 text-white p-6"

:

"min-h-screen bg-gray-100 text-gray-800 p-6"

}

>



<div className="flex justify-between items-center mb-8">


<h1

className={

darkMode

?

"text-4xl font-bold text-white"

:

"text-4xl font-bold text-gray-800"

}

>

Admin Dashboard

</h1>



<button

onClick={()=>setDarkMode(!darkMode)}

className="
flex
items-center
gap-2
bg-purple-600
hover:bg-purple-700
text-white
px-5
py-3
rounded-xl
"

>


{

darkMode

?

<FaSun/>

:

<FaMoon/>

}


{

darkMode

?

"Light Mode"

:

"Dark Mode"

}


</button>


</div>
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


<StatCard
title="Users"
value={stats.users}
icon={<FaUsers/>}
darkMode={darkMode}
/>


<StatCard
title="Organizers"
value={stats.organizers}
icon={<FaUserTie/>}
darkMode={darkMode}
/>


<StatCard
title="Events"
value={stats.events}
icon={<FaCalendarAlt/>}
darkMode={darkMode}
/>


<StatCard
title="Bookings"
value={stats.bookings}
icon={<FaTicketAlt/>}
darkMode={darkMode}
/>


<StatCard
title="Tickets Sold"
value={stats.tickets}
icon={<FaChartLine/>}
darkMode={darkMode}
/>


<StatCard
title="Revenue"
value={`Rs ${stats.revenue.toLocaleString()}`}
icon={<FaMoneyBillWave/>}
darkMode={darkMode}
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

className={

darkMode

?

"bg-gray-800 rounded-2xl shadow-xl p-6 text-white"

:

"bg-white rounded-2xl shadow-xl p-6"

}

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


<CartesianGrid strokeDasharray="3 3"/>


<XAxis 
dataKey="month"
stroke={darkMode ? "white":"black"}
/>


<YAxis
stroke={darkMode ? "white":"black"}
/>


<Tooltip/>


<Line
type="monotone"
dataKey="revenue"
stroke="#9333ea"
strokeWidth={3}
/>


</LineChart>


</ResponsiveContainer>


</div>






<div

className={

darkMode

?

"bg-gray-800 rounded-2xl shadow-xl p-6 text-white"

:

"bg-white rounded-2xl shadow-xl p-6"

}

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


<CartesianGrid strokeDasharray="3 3"/>


<XAxis
dataKey="month"
stroke={darkMode ? "white":"black"}
/>


<YAxis
stroke={darkMode ? "white":"black"}
/>


<Tooltip/>


<Bar
dataKey="bookings"
fill="#2563eb"
/>


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


{/* LATEST EVENTS */}


<div

className={

darkMode

?

"bg-gray-800 rounded-2xl shadow-xl p-6 text-white"

:

"bg-white rounded-2xl shadow-xl p-6"

}

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



{

stats.recent_events.map((event)=>(


<div

key={event.id}

className={

darkMode

?

"border-b border-gray-700 py-4"

:

"border-b py-4"

}

>


<h3
className="
font-bold
text-lg
"
>

{event.title}

</h3>



<p className="text-gray-500">

📅 {event.event_date}

</p>



<p className="text-gray-500">

📍 {event.location}

</p>



</div>


))


}


</div>





{/* LATEST BOOKINGS */}



<div

className={

darkMode

?

"bg-gray-800 rounded-2xl shadow-xl p-6 text-white"

:

"bg-white rounded-2xl shadow-xl p-6"

}

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




{

stats.recent_bookings.map((item)=>(


<div

key={item.id}

className={

darkMode

?

"border-b border-gray-700 py-4"

:

"border-b py-4"

}

>


<h3 className="font-bold">

{item.event}

</h3>


<p className="text-gray-500">

Customer: {item.customer}

</p>



</div>


))


}



</div>



</div>


</div>


);

};





const StatCard = ({
title,
value,
icon,
darkMode
}) => {


return (

<motion.div

whileHover={{
scale:1.05
}}


className={

darkMode

?

`
bg-gray-800
text-white
rounded-2xl
shadow-xl
p-6
flex
items-center
justify-between
border
border-gray-700
`

:

`
bg-white
text-gray-800
rounded-2xl
shadow-xl
p-6
flex
items-center
justify-between
border
`

}

>


<div>


<p
className={

darkMode

?

"text-gray-400"

:

"text-gray-500"

}

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