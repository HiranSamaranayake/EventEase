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
public function getAllBookings()
{
    return $this->admin->getAllBookings();
}
public function getTotalUsers()
{
    return $this->admin->getTotalUsers();
}

public function getTotalEvents()
{
    return $this->admin->getTotalEvents();
}

public function getTotalBookings()
{
    return $this->admin->getTotalBookings();
}

public function getAdminSummary()
{
    $users = $this->getTotalUsers();

    $events = $this->getTotalEvents();

    $bookings = $this->getTotalBookings();

    return [
        "total_users" => $users['total_users'],
        "total_events" => $events['total_events'],
        "total_bookings" => $bookings['total_bookings']
    ];
}
}