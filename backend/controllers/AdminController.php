<?php

require_once __DIR__ . '/../models/Admin.php';

class AdminController
{
    private $admin;

    public function __construct($db)
    {
        $this->admin = new Admin($db);
    }

    public function getAllUsers()
    {
        return $this->admin->getAllUsers();
    }
    public function getAllEvents()
{
    return $this->admin->getAllEvents();
}
}