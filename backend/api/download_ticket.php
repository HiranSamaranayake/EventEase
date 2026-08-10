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

$raw_id = $_GET["booking_id"] ?? $_GET["id"] ?? $_GET["order_id"] ?? 0;
$raw_id = trim($raw_id);

$booking_id = 0;
$ticket_code_search = "";

if (is_numeric($raw_id)) {
    $booking_id = intval($raw_id);
} else if (!empty($raw_id)) {
    $ticket_code_search = mysqli_real_escape_string($conn, $raw_id);
    if (preg_match('/(\d+)/', $raw_id, $matches)) {
        $booking_id = intval($matches[1]);
    }
}

if (!$booking_id && empty($ticket_code_search)) {
    echo json_encode([
        "success" => false,
        "message" => "Booking ID missing"
    ]);
    exit;
}

$whereClause = [];
if ($booking_id > 0) {
    $whereClause[] = "bookings.id = '$booking_id'";
    $whereClause[] = "tickets.id = '$booking_id'";
    $whereClause[] = "tickets.booking_id = '$booking_id'";
}
if (!empty($ticket_code_search)) {
    $whereClause[] = "tickets.ticket_code = '$ticket_code_search'";
}

$query = "
SELECT
    bookings.id AS booking_id,
    bookings.user_id,
    bookings.event_id,
    bookings.ticket_quantity,
    bookings.total_amount,
    bookings.booking_date,
    tickets.id AS ticket_id,
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
WHERE " . implode(" OR ", $whereClause) . "
ORDER BY tickets.id DESC
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

$bId = $data['booking_id'];

// If ticket code is empty, generate and store it
if (empty($data['ticket_code'])) {
    $newTicketCode = "EVT-" . $bId . "-" . rand(1000, 9999);
    $data['ticket_code'] = $newTicketCode;
    
    // Check if tickets record exists
    if (empty($data['ticket_id'])) {
        $insTicket = "INSERT INTO tickets (booking_id, ticket_code, status) VALUES ('$bId', '$newTicketCode', 'paid')";
        mysqli_query($conn, $insTicket);
    } else {
        $updTicket = "UPDATE tickets SET ticket_code = '$newTicketCode' WHERE id = '{$data['ticket_id']}'";
        mysqli_query($conn, $updTicket);
    }
}

// Fetch reserved seat codes from event_booked_seats if present
$seatSql = "SELECT GROUP_CONCAT(seat_code SEPARATOR ', ') AS reserved_seats FROM event_booked_seats WHERE booking_id = '$bId'";
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