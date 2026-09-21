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

$raw = file_get_contents("php://input");
$input = json_decode($raw, true) ?? [];

$bookingId = $_POST['booking_id'] ?? $input['booking_id'] ?? $_GET['booking_id'] ?? 0;
$action = $_POST['action'] ?? $input['action'] ?? $_GET['action'] ?? 'approve';

$bookingId = intval($bookingId);

if ($bookingId <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Valid booking_id is required"
    ]);
    exit;
}

$newStatus = ($action === 'reject') ? 'Paid' : 'Refunded';

$updateSql = "
UPDATE bookings 
SET payment_status = '$newStatus' 
WHERE id = $bookingId
";

if (mysqli_query($conn, $updateSql)) {
    if ($action !== 'reject') {
        // If refunded, update payments table, cancel tickets, and release seat reservations
        mysqli_query($conn, "UPDATE payments SET payment_status = 'Refunded' WHERE booking_id = $bookingId");
        mysqli_query($conn, "UPDATE tickets SET status = 'cancelled' WHERE booking_id = $bookingId");
        mysqli_query($conn, "DELETE FROM event_booked_seats WHERE booking_id = $bookingId");
    }

    echo json_encode([
        "success" => true,
        "message" => ($action === 'reject') ? "Refund request rejected." : "Refund processed, approved, and ticket seats released successfully!",
        "payment_status" => $newStatus
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . mysqli_error($conn)
    ]);
}
