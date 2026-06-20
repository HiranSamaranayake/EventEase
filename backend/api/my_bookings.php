<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../config/database.php";

$userId = 1; // temporary

$query = "
SELECT
    bookings.id,
    bookings.booking_date,
    events.title,
    events.event_date,
    events.location
FROM bookings

INNER JOIN events
ON bookings.event_id = events.id

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
