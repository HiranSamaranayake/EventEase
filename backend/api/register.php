<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../controllers/AuthController.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $data = json_decode(file_get_contents("php://input"), true);

    $name = $data['fullName'] ?? '';
    $email = $data['email'] ?? '';
    $phone = $data['phone'] ?? '';
    $password = $data['password'] ?? '';
    $role = $data['role'] ?? 'customer';

    if (
        empty($name) ||
        empty($email) ||
        empty($phone) ||
        empty($password)
    ) {
        echo json_encode([
            "success" => false,
            "message" => "All fields are required"
        ]);
        exit();
    }

    $auth = new AuthController($conn);

    $result = $auth->register(
        $name,
        $email,
        $phone,
        $password,
        $role
    );

    if ($result === true) {

        echo json_encode([
            "success" => true,
            "message" => "Registration Successful"
        ]);
    } elseif ($result === "EMAIL_EXISTS") {

        echo json_encode([
            "success" => false,
            "message" => "Email already exists"
        ]);
    } else {

        echo json_encode([
            "success" => false,
            "message" => "Registration Failed"
        ]);
    }
} else {

    echo json_encode([
        "success" => false,
        "message" => "POST method required"
    ]);
}
