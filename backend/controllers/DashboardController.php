<?php

require_once __DIR__ . '/../models/Dashboard.php';

class DashboardController
{
    private $dashboard;

    public function __construct($db)
    {
        $this->dashboard = new Dashboard($db);
    }

    public function getTotalEvents($organizer_id)
    {
        return $this->dashboard->getTotalEvents($organizer_id);
    }
    public function getTotalBookings($organizer_id)
{
    return $this->dashboard->getTotalBookings($organizer_id);
}
public function getUpcomingEvents($organizer_id)
{
    return $this->dashboard->getUpcomingEvents($organizer_id);
}
}