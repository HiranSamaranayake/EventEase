<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once "../config/database.php";

$id = $_GET['id'] ?? 0;
$id = intval($id);

if ($id <= 0) {
    echo json_encode(["success" => false, "message" => "Valid ticket ID or booking ID required"]);
    exit;
}

$query = "
SELECT
    tickets.id AS ticket_id,
    tickets.ticket_code,
    tickets.qr_code,
    tickets.seat_number,
    tickets.status AS ticket_status,
    bookings.id AS booking_id,
    bookings.ticket_quantity,
    bookings.total_amount,
    bookings.booking_date,
    bookings.booking_status,
    events.id AS event_id,
    events.title,
    events.event_date,
    events.location,
    users.full_name AS customer_name,
    users.email AS customer_email
FROM tickets
INNER JOIN bookings ON tickets.booking_id = bookings.id
INNER JOIN events ON bookings.event_id = events.id
INNER JOIN users ON bookings.user_id = users.id
WHERE tickets.id = $id OR bookings.id = $id
LIMIT 1
";

$result = mysqli_query($conn, $query);

if ($result && mysqli_num_rows($result) > 0) {
    $ticket = mysqli_fetch_assoc($result);
    $bookingId = intval($ticket['booking_id']);

    // Fetch seat codes from event_booked_seats
    $seatRes = mysqli_query($conn, "SELECT GROUP_CONCAT(seat_code SEPARATOR ', ') AS reserved_seats FROM event_booked_seats WHERE booking_id = $bookingId");
    if ($seatRes && $seatRow = mysqli_fetch_assoc($seatRes)) {
        if (!empty($seatRow['reserved_seats'])) {
            $ticket['seat_number'] = $seatRow['reserved_seats'];
        }
    }

    if (empty($ticket['seat_number'])) {
        $ticket['seat_number'] = "General Admission";
    }

    echo json_encode([
        "success" => true,
        "ticket" => $ticket
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Ticket details not found"
    ]);
}
