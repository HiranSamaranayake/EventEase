<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once __DIR__ . '/../config/database.php';

// Get logged-in user id from URL
$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

if ($user_id == 0) {
    echo json_encode([
        "success" => false,
        "message" => "User ID is required"
    ]);
    exit();
}
// Find organizer ID using the logged-in user ID
$organizerQuery = mysqli_query(
    $conn,
    "SELECT id FROM organizers WHERE user_id = $user_id"
);

if (!$organizerQuery || mysqli_num_rows($organizerQuery) == 0) {
    echo json_encode([
        "success" => false,
        "message" => "Organizer not found"
    ]);
    exit();
}

$organizer = mysqli_fetch_assoc($organizerQuery);
$organizer_id = $organizer['id'];



$totalEvents = 0;
$totalBookings = 0;
$totalRevenue = 0;

$eventQuery = "
SELECT COUNT(*) AS total
FROM events
WHERE organizer_id = $organizer_id
";

$eventResult = mysqli_query($conn, $eventQuery);

if($eventResult){
    $totalEvents = mysqli_fetch_assoc($eventResult)['total'];
}

$bookingQuery = "
SELECT COUNT(*) AS total

FROM bookings b

JOIN events e
ON b.event_id = e.id

WHERE e.organizer_id = $organizer_id
";

$bookingResult = mysqli_query($conn, $bookingQuery);

if($bookingResult){
    $totalBookings = mysqli_fetch_assoc($bookingResult)['total'];
}

$revenueQuery = "

SELECT
SUM(p.amount) AS total

FROM payments p

JOIN bookings b
ON p.booking_id = b.id

JOIN events e
ON b.event_id = e.id

WHERE
e.organizer_id = $organizer_id
AND
p.payment_status='success'

";
$revenueResult = mysqli_query($conn, $revenueQuery);

if($revenueResult){
    $row = mysqli_fetch_assoc($revenueResult);
    $totalRevenue = $row['total'] ?? 0;
}

// =========================
// Recent Bookings
// =========================

$recentBookings = [];

$recentQuery = "
SELECT
    b.id,
    u.full_name AS customer,
    e.title AS event,
    b.total_amount AS amount,
    b.booking_date

FROM bookings b

JOIN users u
ON b.user_id = u.id

JOIN events e
ON b.event_id = e.id

WHERE e.organizer_id = $organizer_id

ORDER BY b.booking_date DESC

LIMIT 5
";

$result = mysqli_query($conn, $recentQuery);

if($result){

    while($row = mysqli_fetch_assoc($result)){

        $recentBookings[] = $row;

    }

}

$upcomingEvents = [];

$eventQuery = mysqli_query(
    $conn,
    "
    SELECT
        title,
        event_date
    FROM events
    WHERE organizer_id = $organizer_id
    ORDER BY event_date ASC
    LIMIT 5
    "
);

while($row = mysqli_fetch_assoc($eventQuery)){
    $upcomingEvents[] = [
        "title"=>$row["title"],
        "date"=>$row["event_date"]
    ];
}

$monthlyRevenue = [];

$revenueChartQuery = mysqli_query(
    $conn,
    "
    SELECT
        MONTH(payments.created_at) AS month,
        SUM(payments.amount) AS revenue
    FROM payments
    INNER JOIN bookings
        ON payments.booking_id = bookings.id
    INNER JOIN events
        ON bookings.event_id = events.id
    WHERE
        events.organizer_id = $organizer_id
        AND payments.payment_status='success'
    GROUP BY MONTH(payments.created_at)
    ORDER BY MONTH(payments.created_at)
    "
);

while($row = mysqli_fetch_assoc($revenueChartQuery)){

    $monthlyRevenue[] = [

        "month" => date("M", mktime(0,0,0,$row["month"],1)),

        "revenue" => (float)$row["revenue"]

    ];

}
// =========================
// Monthly Bookings Chart
// =========================

$monthlyBookings = [];

$bookingChartQuery = mysqli_query(
    $conn,
    "
    SELECT
        MONTH(b.booking_date) AS month,
        COUNT(*) AS bookings

    FROM bookings b

    INNER JOIN events e
        ON b.event_id = e.id

    WHERE e.organizer_id = $organizer_id

    GROUP BY MONTH(b.booking_date)

    ORDER BY MONTH(b.booking_date)
    "
);


if($bookingChartQuery){

    while($row = mysqli_fetch_assoc($bookingChartQuery)){

        $monthlyBookings[] = [

            "month" => date(
                "M",
                mktime(
                    0,
                    0,
                    0,
                    $row["month"],
                    1
                )
            ),

            "bookings" => (int)$row["bookings"]

        ];

    }

}
// =============================
// Notifications
// =============================

$notifications = [];

$notificationQuery = mysqli_query(
    $conn,
    "
    SELECT

        u.full_name,
        e.title,
        b.booking_date

    FROM bookings b

    INNER JOIN users u
        ON b.user_id = u.id

    INNER JOIN events e
        ON b.event_id = e.id

    WHERE e.organizer_id = $organizer_id

    ORDER BY b.booking_date DESC

    LIMIT 5
    "
);

if($notificationQuery){

    while($row = mysqli_fetch_assoc($notificationQuery)){

        $notifications[] = [

            "message" =>
                $row["full_name"] .
                " booked " .
                $row["title"],

            "date" =>
                $row["booking_date"]

        ];

    }

}

echo json_encode([
    "success" => true,

    "stats" => [
        "events" => (int)$totalEvents,
        "bookings" => (int)$totalBookings,
        "tickets" => (int)$totalBookings,
        "customers" => (int)$totalBookings,
        "views" => 1250,
        "revenue" => (float)$totalRevenue
    ],




   "recentBookings" => $recentBookings,

    "upcomingEvents" => $upcomingEvents,

    "monthlyRevenue" => $monthlyRevenue,

    "monthlyBookings" => $monthlyBookings,

    "notifications" => $notifications
]);