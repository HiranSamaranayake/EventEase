<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../controllers/BookingController.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST')
{
    $booking_id = $_POST['booking_id'] ?? '';

    if (empty($booking_id))
    {
        echo "Booking ID is required.";
        exit;
    }

    $booking = new BookingController($conn);

    $result = $booking->cancelBooking($booking_id);

    if ($result)
    {
        echo "Booking Cancelled Successfully";
    }
    else
    {
        echo "Booking Cancellation Failed";
    }
}
else
{
    echo "POST method required.";
}