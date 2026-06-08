<?php

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