<?php


header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';
require_once '../controllers/AuthController.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST')
{
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    $auth = new AuthController($conn);

    $user = $auth->login(
        $email,
        $password
    );

    if ($user)
    {
        echo "Login Successful";
    }
    else
    {
        echo "Invalid Credentials";
    }
}
else
{
    echo "POST method required.";
}