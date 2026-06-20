<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../config/database.php";

$userId = 1; // temporary

$query = "
SELECT
    tickets.id,
    tickets.ticket_code,
    tickets.qr_code,

    events.title,
    events.event_date,
    events.location

FROM tickets

INNER JOIN bookings
ON tickets.booking_id = bookings.id

INNER JOIN events
ON bookings.event_id = events.id

WHERE bookings.user_id = $userId
";

$result = mysqli_query($conn, $query);

if (!$result) {
    die(mysqli_error($conn));
}

$tickets = [];

while ($row = mysqli_fetch_assoc($result)) {

    $tickets[] = $row;
}

echo json_encode([
    "success" => true,
    "tickets" => $tickets
]);
