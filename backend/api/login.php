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

    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    if (empty($email) || empty($password)) {

        echo json_encode([
            "success" => false,
            "message" => "Email and Password are required"
        ]);
        exit();
    }

    $auth = new AuthController($conn);

    $user = $auth->login(
        $email,
        $password
    );

    if ($user) {

        require_once __DIR__ . '/../config/jwt.php';


        $payload = [
            "id" => $user["id"],
            "email" => $user["email"],
            "role" => $user["role"],
            "iat" => time(),
            "exp" => time() + (60 * 60 * 24)
        ];

        $jwt = \Firebase\JWT\JWT::encode(
            $payload,
            $secret_key,
            'HS256'
        );

        echo json_encode([
            "success" => true,
            "token" => $jwt,
            "user" => $user
        ]);
    } else {

        echo json_encode([
            "success" => false,
            "message" => "Invalid Email or Password"
        ]);
    }
} else {

    echo json_encode([
        "success" => false,
        "message" => "POST method required"
    ]);
}
