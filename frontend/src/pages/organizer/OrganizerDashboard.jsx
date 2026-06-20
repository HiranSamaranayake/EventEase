import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import CountUp from "react-countup";

import {
    FaCalendarAlt,
    FaTicketAlt,
    FaMoneyBillWave,
    FaStar
} from "react-icons/fa";

const OrganizerDashboard = () => {

    const [stats, setStats] = useState({
        totalEvents: 0,
        totalBookings: 0,
        totalRevenue: 0
    });
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetch(
            "http://localhost/EventEase/backend/api/recent_bookings.php"
        )
            .then((res) => res.json())
            .then((data) => {
        
                if (data.success) {
        
                    setBookings(data.bookings);
        
                }
        
            });
        fetch(
            "http://localhost/EventEase/backend/api/upcoming_events.php"
        )
            .then((res) => res.json())
            .then((data) => {
        
                if (data.success) {
        
                    setEvents(data.events);
        
                }
        
            });

        fetch(
            "http://localhost/EventEase/backend/api/organizer_dashboard.php"
        )
            .then((res) => res.json())
            .then((data) => {

                if (data.success) {

                    setStats(data);

                }

            })
            .catch((error) => {
                console.error(error);
            });

    }, []);

    return (

        <DashboardLayout>

            <div>

                <h1 className="
                    text-3xl
                    font-bold
                    mb-2
                ">
                    Organizer Dashboard
                </h1>

                <p className="
                    text-gray-500
                    mb-8
                ">
                    Welcome back! Here's what's happening with your events.
                </p>

                {/* Statistics Cards */}

                <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-4
                    gap-6
                    mb-10
                ">

                    {/* Total Events */}

                    <div className="
                        bg-gradient-to-r
                        from-purple-600
                        to-purple-800
                        text-white
                        p-6
                        rounded-2xl
                        shadow-xl
                        hover:scale-105
                        transition
                    ">

                        <div className="
                            flex
                            justify-between
                            items-center
                        ">

                            <div>

                                <p className="text-purple-100">
                                    Total Events
                                </p>

                                <h2 className="
                                    text-4xl
                                    font-bold
                                    mt-2
                                ">
                                   {stats.totalEvents}

                                </h2>

                            </div>

                            <FaCalendarAlt size={40} />

                        </div>

                    </div>

                    {/* Bookings */}

                    <div className="
                        bg-gradient-to-r
                        from-blue-500
                        to-blue-700
                        text-white
                        p-6
                        rounded-2xl
                        shadow-xl
                        hover:scale-105
                        transition
                    ">

                        <div className="
                            flex
                            justify-between
                            items-center
                        ">

                            <div>

                                <p className="text-blue-100">
                                    Total Bookings
                                </p>

                                <h2 className="
                                    text-4xl
                                    font-bold
                                    mt-2
                                ">
                         {stats.totalBookings}

                                </h2>

                            </div>

                            <FaTicketAlt size={40} />

                        </div>

                    </div>

                    {/* Revenue */}

                    <div className="
                        bg-gradient-to-r
                        from-green-500
                        to-green-700
                        text-white
                        p-6
                        rounded-2xl
                        shadow-xl
                        hover:scale-105
                        transition
                    ">

                        <div className="
                            flex
                            justify-between
                            items-center
                        ">

                            <div>

                                <p className="text-green-100">
                                    Revenue
                                </p>

                                <h2 className="
                                    text-3xl
                                    font-bold
                                    mt-2
                                ">
                                   {stats.totalRevenue}
                                </h2>

                            </div>

                            <FaMoneyBillWave size={40} />

                        </div>

                    </div>

                    {/* Active Events */}

                    <div className="
                        bg-gradient-to-r
                        from-yellow-500
                        to-orange-500
                        text-white
                        p-6
                        rounded-2xl
                        shadow-xl
                        hover:scale-105
                        transition
                    ">

                        <div className="
                            flex
                            justify-between
                            items-center
                        ">

                            <div>

                                <p className="text-yellow-100">
                                    Active Events
                                </p>

                                <h2 className="
                                    text-4xl
                                    font-bold
                                    mt-2
                                ">
                                 {stats.totalEvents}
                                </h2>

                            </div>

                            <FaStar size={40} />

                        </div>

                    </div>

                </div>
           

                {/* Quick Actions */}

                <div className="
                    bg-white
                    rounded-2xl
                    shadow-lg
                    p-6
                    mb-8
                ">

                    <h2 className="
                        text-xl
                        font-bold
                        mb-4
                    ">
                        Quick Actions
                    </h2>

                    <div className="
                        grid
                        grid-cols-2
                        md:grid-cols-4
                        gap-4
                    ">

                        <button className="
                            bg-purple-600
                            text-white
                            py-3
                            rounded-xl
                            hover:bg-purple-700
                            transition
                        ">
                            Create Event
                        </button>

                        <button className="
                            bg-blue-600
                            text-white
                            py-3
                            rounded-xl
                            hover:bg-blue-700
                            transition
                        ">
                            Manage Events
                        </button>

                        <button className="
                            bg-green-600
                            text-white
                            py-3
                            rounded-xl
                            hover:bg-green-700
                            transition
                        ">
                            View Bookings
                        </button>

                        <button className="
                            bg-orange-500
                            text-white
                            py-3
                            rounded-xl
                            hover:bg-orange-600
                            transition
                        ">
                            Reports
                        </button>

                    </div>

                </div>
                

                {/* Placeholder Section */}

                <div className="
                    bg-white
                    rounded-2xl
                    shadow-lg
                    p-6
                ">

                    <h2 className="
                        text-xl
                        font-bold
                        mb-4
                    ">
                        Upcoming Events
                    </h2>

                    <div className="space-y-4">
                  

{
    events.length > 0 ?

        events.map((event) => (

            <div
                key={event.id}
                className="
                    border
                    rounded-xl
                    p-4
                    hover:bg-gray-50
                    transition
                "
            >

                <h3 className="
                    text-lg
                    font-bold
                ">
                    {event.title}
                </h3>

                <p className="text-gray-500">
                    📍 {event.location}
                </p>

                <p className="text-gray-500">
                    📅 {event.event_date}
                </p>

            </div>
            

        ))

        :

        <p className="text-gray-500">
            No Upcoming Events
        </p>
}

</div>
<div className="
bg-white
rounded-2xl
shadow-lg
p-6
mt-8
">

<h2 className="
text-xl
font-bold
mb-4
">
Recent Bookings
</h2>

<div className="overflow-x-auto">

<table className="
w-full
border-collapse
">

<thead>

<tr className="
border-b
text-left
">

<th className="py-3">
Customer
</th>

<th className="py-3">
Event
</th>

<th className="py-3">
Booking Date
</th>

</tr>

</thead>

<tbody>

{
bookings.length > 0 ?

bookings.map((booking) => (

<tr
key={booking.id}
className="
border-b
hover:bg-gray-50
"
>

<td className="py-3">
{booking.full_name}
</td>

<td className="py-3">
{booking.title}
</td>

<td className="py-3">
{booking.booking_date}
</td>

</tr>

))

:

<tr>

<td
colSpan="3"
className="
py-4
text-center
text-gray-500
"
>
No Bookings Found
</td>

</tr>
}

</tbody>

</table>

</div>

</div>
                  

                </div>

            </div>

        </DashboardLayout>

    );
};

export default OrganizerDashboard;