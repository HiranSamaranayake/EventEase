<?php

class Admin
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getAllUsers()
    {
        $query = "SELECT id, name, email, role
                  FROM users
                  ORDER BY id DESC";

        $result = $this->conn->query($query);

        $users = [];

        while ($row = $result->fetch_assoc())
        {
            $users[] = $row;
        }

        return $users;
    }
    public function getAllEvents()
{
    $query = "SELECT
                events.id,
                events.title,
                events.event_date,
                events.location,
                users.name AS organizer_name
              FROM events
              INNER JOIN users
              ON events.organizer_id = users.id
              ORDER BY events.id DESC";

    $result = $this->conn->query($query);

    $events = [];

    while ($row = $result->fetch_assoc())
    {
        $events[] = $row;
    }

    return $events;
}
public function getAllBookings()
{
    $query = "SELECT
                bookings.id AS booking_id,
                users.name AS customer_name,
                events.title AS event_title,
                bookings.booking_date
              FROM bookings
              INNER JOIN users
                ON bookings.user_id = users.id
              INNER JOIN events
                ON bookings.event_id = events.id
              ORDER BY bookings.id DESC";

    $result = $this->conn->query($query);

    $bookings = [];

    while ($row = $result->fetch_assoc())
    {
        $bookings[] = $row;
    }

    return $bookings;
}
}