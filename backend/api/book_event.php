<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../controllers/BookingController.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST')
{
    $user_id = $_POST['user_id'] ?? '';
    $event_id = $_POST['event_id'] ?? '';

    if (
        empty($user_id) ||
        empty($event_id)
    )
    {
        echo "User ID and Event ID are required.";
        exit;
    }

    $booking = new BookingController($conn);

    $result = $booking->bookEvent(
        $user_id,
        $event_id
    );

    if ($result)
    {
        echo "Booking Successful";
    }
    else
    {
        echo "Booking Failed";
    }
}
else
{
    echo "POST method required.";
}