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

// Fetch booking details
$checkQuery = "SELECT id, user_id, payment_status, booking_status FROM bookings WHERE id = $bookingId";
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

// Determine new payment status
$newPaymentStatus = ($booking['payment_status'] === 'Paid') ? 'Refund Requested' : 'Cancelled';

// Update booking status
$updateBookingSql = "
UPDATE bookings 
SET booking_status = 'Cancelled', payment_status = '$newPaymentStatus' 
WHERE id = $bookingId
";

$updateRes = mysqli_query($conn, $updateBookingSql);

if ($updateRes) {
    // Also cancel tickets associated with this booking
    mysqli_query($conn, "UPDATE tickets SET status = 'used' WHERE booking_id = $bookingId");

    echo json_encode([
        "success" => true,
        "message" => ($newPaymentStatus === 'Refund Requested') 
            ? "Booking cancelled. Refund request submitted to Financial Admin!" 
            : "Booking cancelled successfully.",
        "booking_status" => "Cancelled",
        "payment_status" => $newPaymentStatus
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Failed to update booking status: " . mysqli_error($conn)
    ]);
}