<?php

require_once __DIR__ . '/../models/User.php';

class AuthController
{

    private $user;

    public function __construct($db)
    {
        $this->user = new User($db);
    }

    public function register($name, $email, $phone, $password, $role)
    {
        return $this->user->register(
            $name,
            $email,
            $phone,
            $password,
            $role
        );
    }


    public function login($email, $password)
    {
        return $this->user->login($email, $password);
    }
}
