import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { Link } from "react-router-dom";


const CustomerDashboard = () => {

    const [stats, setStats] = useState({
        totalBookings: 0,
        upcomingEvents: 0,
        totalTickets: 0
    });
    const [bookings, setBookings] = useState([]);
    const [tickets, setTickets] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        fetch(
            `http://localhost/EventEase/backend/api/my_tickets.php?user_id=${user.id}`
        )
        .then(res => res.json())
        .then(data => {
        
            console.log("Tickets API:", data);
        
            if(data.success){
                setTickets(data.tickets);
            }
        
        })
        .catch(err => console.log(err));
           
     
        fetch(
            "http://localhost/EventEase/backend/api/my_bookings.php"
        )
            .then(res => res.json())
            .then(data => {
        
                if (data.success) {
        
                    setBookings(data.bookings);
        
                }
        
            });

        fetch(
            "http://localhost/EventEase/backend/api/customer_dashboard.php"
        )
            .then(res => res.json())
            .then(data => {

                if (data.success) {

                    setStats(data);

                }

            });

    }, []);
    

    return (

        <DashboardLayout>

            <h1 className="text-3xl font-bold mb-2">
                Customer Dashboard
            </h1>

            <p className="text-gray-500 mb-8">
                Manage your bookings and tickets.
            </p>
            <Link
    to="/booking-success"
    className="
        inline-block
        bg-green-600
        text-white
        px-4
        py-2
        rounded-xl
        mb-6
        hover:bg-green-700
    "
>
    Test Booking Success
</Link>

            <div className="
                grid
                md:grid-cols-3
                gap-6
            ">

                <div className="
                    bg-purple-600
                    text-white
                    p-6
                    rounded-2xl
                ">
                    <h3>Total Bookings</h3>

                    <h2 className="text-4xl font-bold mt-2">
                        {stats.totalBookings}
                    </h2>
                </div>

                <div className="
                    bg-blue-600
                    text-white
                    p-6
                    rounded-2xl
                ">
                    <h3>Upcoming Events</h3>

                    <h2 className="text-4xl font-bold mt-2">
                        {stats.upcomingEvents}
                    </h2>
                </div>

                <div className="
                    bg-green-600
                    text-white
                    p-6
                    rounded-2xl
                ">
                    <h3>My Tickets</h3>

                    <h2 className="text-4xl font-bold mt-2">
                        {stats.totalTickets}
                    </h2>
                </div>

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
My Bookings
</h2>

<div className="overflow-x-auto">

<table className="w-full">

<thead>

<tr className="border-b">

<th className="py-3 text-left">
Event
</th>

<th className="py-3 text-left">
Date
</th>

<th className="py-3 text-left">
Location
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
{booking.title}
</td>

<td className="py-3">
{booking.event_date}
</td>

<td className="py-3">
{booking.location}
</td>

</tr>

))

:

<tr>

<td
colSpan="3"
className="
text-center
py-4
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
My Tickets
</h2>

<div className="overflow-x-auto">

<table className="w-full">

<thead>

<tr className="border-b">

<th className="py-3 text-left">
Ticket Code
</th>

<th className="py-3 text-left">
Event
</th>

<th className="py-3 text-left">
Event Date
</th>

<th className="py-3 text-left">
QR Ticket
</th>

</tr>

</thead>

<tbody>

{
tickets.length > 0 ?

tickets.map((ticket) => (

<tr
key={ticket.id}
className="
border-b
hover:bg-gray-50
"
>

<td className="py-3">

<a
    href={`/ticket/${ticket.id}`}
    className="
        text-purple-600
        font-semibold
        hover:underline
    "
>
{ticket.ticket_code}
</a>

</td>

<td className="py-3">
{ticket.title}
</td>

<td className="py-3">
{ticket.event_date}
</td>

<td className="py-3">

<img
    src={`http://localhost/EventEase/backend/${ticket.qr_code}`}
    alt="QR"
    className="
        w-16
        h-16
        rounded
    "
/>

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
No Tickets Found
</td>

</tr>
}

</tbody>

</table>


</div>

</div>


        </DashboardLayout>

    );
};

export default CustomerDashboard;