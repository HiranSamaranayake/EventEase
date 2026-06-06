<?php

class User {

    private $conn;
    private $table = "users";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function register($name, $email, $password, $role)
    {

    }

}