<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../config/database.php";

$ticketCode = $_GET["ticket_code"] ?? "";

if (empty($ticketCode)) {

    echo json_encode([
        "success" => false,
        "message" => "Ticket code is required"
    ]);

    exit;
}

$query = "
SELECT
    tickets.id,
    tickets.ticket_code,
    tickets.status,
    events.title,
    events.event_date,
    users.full_name

FROM tickets

INNER JOIN bookings
ON tickets.booking_id = bookings.id

INNER JOIN events
ON bookings.event_id = events.id

INNER JOIN users
ON bookings.user_id = users.id

WHERE tickets.ticket_code = '$ticketCode'
";

$result = mysqli_query($conn, $query);

if (mysqli_num_rows($result) == 0) {

    echo json_encode([
        "success" => false,
        "message" => "Invalid Ticket"
    ]);

    exit;
}

$ticket = mysqli_fetch_assoc($result);

echo json_encode([
    "success" => true,
    "ticket" => $ticket
]);