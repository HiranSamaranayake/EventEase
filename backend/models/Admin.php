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
}