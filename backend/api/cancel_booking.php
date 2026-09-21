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
$userId = $_POST['user_id'] ?? $input['user_id'] ?? $_GET['user_id'] ?? 0;

$bookingId = intval($bookingId);
$userId = intval($userId);

if ($bookingId <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Valid booking_id is required"
    ]);
    exit;
}

// Fetch booking details & event date
$checkQuery = "
SELECT b.id, b.user_id, b.event_id, b.payment_status, b.booking_status, e.event_date
FROM bookings b
LEFT JOIN events e ON b.event_id = e.id
WHERE b.id = $bookingId
";
$checkRes = mysqli_query($conn, $checkQuery);

if (!$checkRes || mysqli_num_rows($checkRes) == 0) {
    echo json_encode([
        "success" => false,
        "message" => "Booking not found"
    ]);
    exit;
}

$booking = mysqli_fetch_assoc($checkRes);

// Optional ownership check if user_id passed
if ($userId > 0 && intval($booking['user_id']) !== $userId) {
    echo json_encode([
        "success" => false,
        "message" => "Unauthorized to cancel this booking"
    ]);
    exit;
}

if ($booking['booking_status'] === 'Cancelled') {
    echo json_encode([
        "success" => false,
        "message" => "Booking is already cancelled"
    ]);
    exit;
}

// RESTRICTION: Ticket refund and cancellation is ONLY allowed BEFORE the event date
$eventDateStr = $booking['event_date'] ?? '';
if (!empty($eventDateStr)) {
    $eventTimestamp = strtotime($eventDateStr . ' 23:59:59');
    if ($eventTimestamp < time()) {
        echo json_encode([
            "success" => false,
            "message" => "🚫 Refund Closed: Ticket refund and cancellation is only permitted BEFORE the event date."
        ]);
        exit;
    }
}

$newPaymentStatus = 'Refunded';

// Update booking status
$updateBookingSql = "
UPDATE bookings 
SET booking_status = 'Cancelled', payment_status = '$newPaymentStatus' 
WHERE id = $bookingId
";

$updateRes = mysqli_query($conn, $updateBookingSql);

if ($updateRes) {
    // 1. Mark payments table as Refunded
    mysqli_query($conn, "UPDATE payments SET payment_status = 'Refunded' WHERE booking_id = $bookingId");

    // 2. Cancel tickets associated with this booking
    mysqli_query($conn, "UPDATE tickets SET status = 'cancelled' WHERE booking_id = $bookingId");

    // 3. RELEASE SEAT RESERVATIONS: Delete booked seats from event_booked_seats table so seats become available for other buyers!
    mysqli_query($conn, "DELETE FROM event_booked_seats WHERE booking_id = $bookingId");

    echo json_encode([
        "success" => true,
        "message" => "Ticket successfully cancelled and refunded! Your reserved seats have been released and made available for other buyers.",
        "booking_status" => "Cancelled",
        "payment_status" => $newPaymentStatus
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Failed to update booking status: " . mysqli_error($conn)
    ]);
}