<?php

require_once __DIR__ . '/../models/Booking.php';

class BookingController
{
    private $booking;

    public function __construct($db)
    {
        $this->booking = new Booking($db);
    }

    public function bookEvent($user_id, $event_id)
    {
        return $this->booking->bookEvent(
            $user_id,
            $event_id
        );
    }
    public function getBookingsByUser($user_id)
{
    return $this->booking->getBookingsByUser($user_id);
}
public function cancelBooking($booking_id)
{
    return $this->booking->cancelBooking($booking_id);
}
}