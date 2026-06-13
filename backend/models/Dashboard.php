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
}