<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../controllers/AuthController.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    if (
        empty($name) ||
        empty($email) ||
        empty($password)
    ) {
        echo "All fields are required.";
        exit;
    }

    $auth = new AuthController($conn);

    if ($auth->register(
        $name,
        $email,
        $password
    )) {

        echo "Registration Successful";

    } else {

        echo "Registration Failed";
    }

} else {

    echo "POST method required.";
}