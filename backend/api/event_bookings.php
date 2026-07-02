<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../config/database.php";

$eventId = $_GET["event_id"] ?? 0;

if (!$eventId) {

    echo json_encode([
        "success" => false,
        "message" => "Event ID is required"
    ]);

    exit;

}

$query = "

SELECT

bookings.id,
bookings.booking_date,

users.full_name,
users.email,

tickets.ticket_code,
tickets.status

FROM bookings

INNER JOIN users
ON bookings.user_id = users.id

INNER JOIN tickets
ON tickets.booking_id = bookings.id

WHERE bookings.event_id = '$eventId'

ORDER BY bookings.booking_date DESC

";

$result = mysqli_query($conn, $query);
if (!$result) {
    die(mysqli_error($conn));
}

$bookings = [];

while ($row = mysqli_fetch_assoc($result)) {

    $bookings[] = $row;

}

echo json_encode([

    "success" => true,
    "bookings" => $bookings

]);

?>