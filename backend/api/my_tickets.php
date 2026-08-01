<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once "../config/database.php";

$userId = $_GET['user_id'] ?? 0;

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
