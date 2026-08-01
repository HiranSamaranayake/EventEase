<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../config/database.php";

$user_id = $_GET["user_id"] ?? 0;

if (!$user_id) {
    echo json_encode([
        "success" => false,
        "message" => "User ID required"
    ]);
    exit();
}

/*
------------------------------------
Find Organizer ID
------------------------------------
*/

$organizerQuery = mysqli_query(
    $conn,
    "SELECT id FROM organizers WHERE user_id='$user_id'"
);

if (mysqli_num_rows($organizerQuery) == 0) {

    echo json_encode([
        "success" => false,
        "message" => "Organizer not found"
    ]);

    exit();
}

$organizer = mysqli_fetch_assoc($organizerQuery);

$organizer_id = $organizer["id"];

/*
------------------------------------
Monthly Revenue
------------------------------------
*/

$monthlyRevenue = [];

$revenueQuery = mysqli_query($conn, "

SELECT

MONTH(event_date) month,

SUM(payments.amount) revenue

FROM events

LEFT JOIN bookings
ON bookings.event_id = events.id

LEFT JOIN payments
ON payments.booking_id = bookings.id

WHERE events.organizer_id='$organizer_id'

GROUP BY MONTH(event_date)

ORDER BY MONTH(event_date)

");

while($row=mysqli_fetch_assoc($revenueQuery)){

    $monthlyRevenue[]=[
        "month"=>$row["month"],
        "revenue"=>(float)$row["revenue"]
    ];

}

/*
------------------------------------
Monthly Bookings
------------------------------------
*/

$monthlyBookings=[];

$bookingQuery=mysqli_query($conn,"

SELECT

MONTH(events.event_date) month,

COUNT(bookings.id) bookings

FROM events

LEFT JOIN bookings

ON bookings.event_id=events.id

WHERE events.organizer_id='$organizer_id'

GROUP BY MONTH(events.event_date)

ORDER BY MONTH(events.event_date)

");

while($row=mysqli_fetch_assoc($bookingQuery)){

    $monthlyBookings[]=[

        "month"=>$row["month"],

        "bookings"=>(int)$row["bookings"]

    ];

}

echo json_encode([

    "success"=>true,

    "monthlyRevenue"=>$monthlyRevenue,

    "monthlyBookings"=>$monthlyBookings

]);