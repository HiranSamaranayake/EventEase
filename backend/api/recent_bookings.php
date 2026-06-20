<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once __DIR__ . '/../config/database.php';

$query = "
SELECT
    bookings.id,
    bookings.booking_date,
    users.full_name,
    events.title
FROM bookings
INNER JOIN users
ON bookings.user_id = users.id

INNER JOIN events
ON bookings.event_id = events.id

ORDER BY bookings.booking_date DESC

LIMIT 5
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