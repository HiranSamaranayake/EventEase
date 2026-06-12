<?php

class User {

    private $conn;
    private $table = "users";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function register($name, $email, $password, $role)
    {
        $password = password_hash(
            $password,
            PASSWORD_DEFAULT
        );
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
    public function login($email, $password)
    {
        $query = "SELECT * FROM users WHERE email = ?";
    
        $stmt = $this->conn->prepare($query);
    
        $stmt->bind_param("s", $email);
    
        $stmt->execute();
    
        $result = $stmt->get_result();
    
        if ($result->num_rows > 0)
        {
            $user = $result->fetch_assoc();
    
            if (password_verify($password, $user['password']))
            {
                return $user;
            }
        }
    
        return false;
    }
}