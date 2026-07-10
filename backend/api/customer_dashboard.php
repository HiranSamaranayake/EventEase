<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../config/database.php";

$userId = $_GET["user_id"] ?? 0;

$response = [
    "success" => true,
    "totalBookings" => 0,
    "upcomingEvents" => 0,
    "totalTickets" => 0
];

$bookingQuery = "
SELECT COUNT(*) AS total
FROM bookings
WHERE user_id = $userId
";

$result = mysqli_query($conn, $bookingQuery);
$row = mysqli_fetch_assoc($result);

$response["totalBookings"] = $row["total"];

$ticketQuery = "
SELECT COUNT(*) AS total
FROM tickets
";

$result = mysqli_query($conn, $ticketQuery);
$row = mysqli_fetch_assoc($result);

$response["totalTickets"] = $row["total"];

$eventQuery = "
SELECT COUNT(*) AS total
FROM events
WHERE event_date >= CURDATE()
";

$result = mysqli_query($conn, $eventQuery);
$row = mysqli_fetch_assoc($result);

$response["upcomingEvents"] = $row["total"];

echo json_encode($response);
