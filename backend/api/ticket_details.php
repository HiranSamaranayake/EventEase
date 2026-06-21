<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "../config/database.php";

$id = $_GET['id'] ?? 0;

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
WHERE tickets.id = $id
";

$result = mysqli_query($conn, $query);

if ($result && mysqli_num_rows($result) > 0) {

    echo json_encode([
        "success" => true,
        "ticket" => mysqli_fetch_assoc($result)
    ]);
} else {

    echo json_encode([
        "success" => false
    ]);
}
