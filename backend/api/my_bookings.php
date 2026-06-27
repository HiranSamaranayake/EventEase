<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../config/database.php";

$userId = $_GET["user_id"] ?? 0;

if (!$userId) {

    echo json_encode([
        "success" => false,
        "message" => "User ID required"
    ]);

    exit;
}

$query = "
SELECT
    bookings.id,
    bookings.booking_date,

    events.title,
    events.event_date,
    events.location,

    tickets.id AS ticket_id,
    tickets.ticket_code,
    tickets.status
FROM bookings

INNER JOIN events
ON bookings.event_id = events.id

INNER JOIN tickets
ON bookings.id = tickets.booking_id

WHERE bookings.user_id = $userId

ORDER BY bookings.booking_date DESC
";

$result = mysqli_query($conn, $query);

$bookings = [];

while ($row = mysqli_fetch_assoc($result)) {

    $bookings[] = $row;
}

echo json_encode([
    "success" => true,
    "bookings" => $bookings
]);
