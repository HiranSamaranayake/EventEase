<?php

class User {

    private $conn;
    private $table = "users";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function register($name, $email, $password, $role)
    {
        $query = "INSERT INTO users (name, email, password, role)
                  VALUES (?, ?, ?, ?)";

        $stmt = $this->conn->prepare($query);

        $stmt->bind_param(
            "ssss",
            $name,
            $email,
            $password,
            $role
        );

        if ($stmt->execute()) {
            return true;
        } else {
            die("Database Error: " . $stmt->error);
        }
    }

}