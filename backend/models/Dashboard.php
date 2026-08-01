<?php

class Dashboard
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getTotalEvents($organizer_id)
    {
        $query = "SELECT COUNT(*) AS total_events
                  FROM events
                  WHERE organizer_id = ?";

        $stmt = $this->conn->prepare($query);

        $stmt->bind_param("i", $organizer_id);

        $stmt->execute();

        $result = $stmt->get_result();

        return $result->fetch_assoc();
    }
    public function getTotalBookings($organizer_id)
{
    $query = "SELECT COUNT(bookings.id) AS total_bookings
              FROM bookings
              INNER JOIN events
              ON bookings.event_id = events.id
              WHERE events.organizer_id = ?";

    $stmt = $this->conn->prepare($query);

    $stmt->bind_param("i", $organizer_id);

    $stmt->execute();

    $result = $stmt->get_result();

    return $result->fetch_assoc();
}
public function getUpcomingEvents($organizer_id)
{
    $query = "SELECT COUNT(*) AS upcoming_events
              FROM events
              WHERE organizer_id = ?
              AND event_date >= CURDATE()";

    $stmt = $this->conn->prepare($query);

    $stmt->bind_param("i", $organizer_id);

    $stmt->execute();

    $result = $stmt->get_result();

    return $result->fetch_assoc();
}
}