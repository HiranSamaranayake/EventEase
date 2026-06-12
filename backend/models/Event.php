<?php

class Event
{
    private $conn;
    private $table = "events";

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function createEvent(
        $organizer_id,
        $title,
        $description,
        $event_date,
        $location,
        $capacity
    )
    {
        $query = "INSERT INTO events
                  (organizer_id, title, description, event_date, location, capacity)
                  VALUES (?, ?, ?, ?, ?, ?)";

        $stmt = $this->conn->prepare($query);

        $stmt->bind_param(
            "issssi",
            $organizer_id,
            $title,
            $description,
            $event_date,
            $location,
            $capacity
        );

        return $stmt->execute();
    }
}