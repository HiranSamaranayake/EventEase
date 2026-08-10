<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

require_once '../config/database.php';
require_once '../utils/email_helper.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
$booking_id = intval($input['booking_id'] ?? ($_GET['booking_id'] ?? 0));

if ($booking_id <= 0) {
    echo json_encode(["success" => false, "message" => "Valid Booking ID is required."]);
    exit();
}

$res = sendBookingConfirmationEmail($conn, $booking_id);

if ($res) {
    echo json_encode([
        "success" => true,
        "message" => "Ticket confirmation email dispatched successfully for Booking #$booking_id!",
        "booking_id" => $booking_id
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Failed to find booking details for Booking #$booking_id."
    ]);
}
