<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once __DIR__ . "/../config/database.php";

$raw = file_get_contents("php://input");
$data = json_decode($raw, true) ?? [];

$user_id = intval($data["user_id"] ?? $_POST['user_id'] ?? 0);
$event_id = intval($data["event_id"] ?? $_POST['event_id'] ?? 0);
$ticket_quantity = intval($data["ticket_quantity"] ?? $_POST['ticket_quantity'] ?? 1);
$selected_seats = $data["selected_seats"] ?? [];

if (!$user_id || !$event_id) {
    echo json_encode([
        "success" => false,
        "message" => "Missing required fields: user_id and event_id"
    ]);
    exit();
}

// Get Event details
$eventQuery = mysqli_query($conn, "SELECT price, title FROM events WHERE id='$event_id' LIMIT 1");
if (!$eventQuery || mysqli_num_rows($eventQuery) == 0) {
    echo json_encode([
        "success" => false,
        "message" => "Event not found"
    ]);
    exit();
}

$event = mysqli_fetch_assoc($eventQuery);
$basePrice = floatval($event["price"]);

// Calculate total amount
$total_amount = 0;
if (!empty($selected_seats) && is_array($selected_seats)) {
    $ticket_quantity = count($selected_seats);
    foreach ($selected_seats as $s) {
        $total_amount += floatval($s['price'] ?? $basePrice);
    }
} else {
    $total_amount = $basePrice * $ticket_quantity;
}

// Auto-create event_booked_seats table if missing
$tableCheck = mysqli_query($conn, "SHOW TABLES LIKE 'event_booked_seats'");
if (!$tableCheck || mysqli_num_rows($tableCheck) == 0) {
    $createTable = "CREATE TABLE IF NOT EXISTS event_booked_seats (
        id INT(11) NOT NULL AUTO_INCREMENT,
        event_id INT(11) NOT NULL,
        booking_id INT(11) NULL,
        seat_code VARCHAR(50) NOT NULL,
        tier_name VARCHAR(50) NOT NULL,
        price DECIMAL(10,2) NOT NULL DEFAULT '0.00',
        user_id INT(11) NOT NULL,
        booked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY event_seat_unique (event_id, seat_code)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
    mysqli_query($conn, $createTable);
}

mysqli_begin_transaction($conn);

try {
    // 1. Create Booking
    $bookingQuery = "
    INSERT INTO bookings (user_id, event_id, ticket_quantity, total_amount, booking_status, payment_status)
    VALUES ('$user_id', '$event_id', '$ticket_quantity', '$total_amount', 'Confirmed', 'Paid')
    ";
    mysqli_query($conn, $bookingQuery);
    $booking_id = mysqli_insert_id($conn);

    // 2. Create Payment
    $paymentQuery = "
    INSERT INTO payments (booking_id, amount, payment_status)
    VALUES ('$booking_id', '$total_amount', 'Paid')
    ";
    mysqli_query($conn, $paymentQuery);

    // 3. Lock Selected Seats atomically
    $seatCodesList = [];
    if (!empty($selected_seats) && is_array($selected_seats)) {
        foreach ($selected_seats as $s) {
            $seatCode = mysqli_real_escape_string($conn, $s['seat_code']);
            $tierName = mysqli_real_escape_string($conn, $s['tier_name'] ?? 'Standard');
            $seatPrice = floatval($s['price'] ?? $basePrice);

            $seatSql = "
            INSERT INTO event_booked_seats (event_id, booking_id, seat_code, tier_name, price, user_id)
            VALUES ('$event_id', '$booking_id', '$seatCode', '$tierName', '$seatPrice', '$user_id')
            ";
            $res = mysqli_query($conn, $seatSql);
            if (!$res) {
                throw new Exception("Seat '$seatCode' is already booked by another customer!");
            }
            $seatCodesList[] = $seatCode;
        }
    }

    // 4. Generate Ticket
    $ticketCode = "EVT-" . $event_id . "-" . rand(1000, 9999);
    $seatsJoined = !empty($seatCodesList) ? implode(", ", $seatCodesList) : "GEN-ADMISSION";
    $ticketQuery = "
    INSERT INTO tickets (booking_id, ticket_code, seat_number, status)
    VALUES ('$booking_id', '$ticketCode', '$seatsJoined', 'unused')
    ";
    mysqli_query($conn, $ticketQuery);

    mysqli_commit($conn);

    echo json_encode([
        "success" => true,
        "booking_id" => $booking_id,
        "ticket_code" => $ticketCode,
        "amount" => $total_amount,
        "seats" => $seatsJoined,
        "message" => "Booking & seat reservation confirmed successfully!"
    ]);

} catch (Exception $e) {
    mysqli_rollback($conn);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}