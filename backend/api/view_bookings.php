<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../controllers/BookingController.php';

$user_id = $_GET['user_id'] ?? '';

if (empty($user_id))
{
    echo "User ID is required.";
    exit;
}

$booking = new BookingController($conn);

$result = $booking->getBookingsByUser($user_id);

header('Content-Type: application/json');

echo json_encode($result);