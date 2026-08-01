<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "../config/database.php";

$booking_id = $_GET["booking_id"] ?? 0;
$booking_id = intval($booking_id);

if (!$booking_id) {
    echo json_encode([
        "success" => false,
        "message" => "Booking ID missing"
    ]);
    exit;
}

$query = "
SELECT
    bookings.id AS booking_id,
    bookings.ticket_quantity,
    bookings.total_amount,
    bookings.booking_date,
    tickets.ticket_code,
    tickets.qr_code,
    tickets.status,
    tickets.seat_number,
    events.title,
    events.event_date,
    events.location,
    users.full_name,
    users.email
FROM bookings
LEFT JOIN tickets ON bookings.id = tickets.booking_id
LEFT JOIN events ON bookings.event_id = events.id
LEFT JOIN users ON bookings.user_id = users.id
WHERE bookings.id = '$booking_id'
LIMIT 1
";

$result = mysqli_query($conn, $query);

if (!$result) {
    echo json_encode([
        "success" => false,
        "message" => mysqli_error($conn)
    ]);
    exit;
}

$data = mysqli_fetch_assoc($result);

if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "Ticket not found"
    ]);
    exit;
}

// Fetch reserved seat codes from event_booked_seats if present
$seatSql = "SELECT GROUP_CONCAT(seat_code SEPARATOR ', ') AS reserved_seats FROM event_booked_seats WHERE booking_id = '$booking_id'";
$seatRes = mysqli_query($conn, $seatSql);
$reservedSeats = "";

if ($seatRes && $seatRow = mysqli_fetch_assoc($seatRes)) {
    $reservedSeats = $seatRow['reserved_seats'] ?? "";
}

$data['seat_number'] = !empty($reservedSeats) 
    ? $reservedSeats 
    : (!empty($data['seat_number']) ? $data['seat_number'] : "General Admission");

echo json_encode([
    "success" => true,
    "ticket" => $data
]);