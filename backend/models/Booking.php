<?php

class Booking
{
    private $conn;
    private $table = "bookings";

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function bookEvent($user_id, $event_id)
    {
        $query = "INSERT INTO bookings (user_id, event_id)
                  VALUES (?, ?)";

        $stmt = $this->conn->prepare($query);

        $stmt->bind_param(
            "ii",
            $user_id,
            $event_id
        );

        return $stmt->execute();
    }
    public function getBookingsByUser($user_id)
{
    $query = "SELECT
                bookings.id AS booking_id,
                events.title,
                events.event_date,
                events.location
              FROM bookings
              INNER JOIN events
              ON bookings.event_id = events.id
              WHERE bookings.user_id = ?";

    $stmt = $this->conn->prepare($query);

    $stmt->bind_param("i", $user_id);

    $stmt->execute();

    $result = $stmt->get_result();

    $bookings = [];

    while ($row = $result->fetch_assoc())
    {
        $bookings[] = $row;
    }

    return $bookings;
}
}