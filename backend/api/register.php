<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../controllers/AuthController.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $role = $_POST['role'] ?? 'customer';

    if (
        empty($name) ||
        empty($email) ||
        empty($password)
    ) {
        echo "All fields are required.";
        exit;
    }

    $auth = new AuthController($conn);

    $result = $auth->register(
        $name,
        $email,
        $password,
        $role
    );

    if ($result === true) {

        echo "Registration Successful";

    } elseif ($result === "EMAIL_EXISTS") {

        echo "Email already exists.";

    } else {

        echo "Registration Failed";
    }

} else {

    echo "POST method required.";
}