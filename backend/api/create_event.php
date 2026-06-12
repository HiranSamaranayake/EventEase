<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../controllers/EventController.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST')
{
    $organizer_id = $_POST['organizer_id'] ?? '';
    $title = $_POST['title'] ?? '';
    $description = $_POST['description'] ?? '';
    $event_date = $_POST['event_date'] ?? '';
    $location = $_POST['location'] ?? '';
    $capacity = $_POST['capacity'] ?? '';

    if (
        empty($organizer_id) ||
        empty($title) ||
        empty($event_date)
    )
    {
        echo "Required fields are missing.";
        exit;
    }

    $event = new EventController($conn);

    $result = $event->createEvent(
        $organizer_id,
        $title,
        $description,
        $event_date,
        $location,
        $capacity
    );

    if ($result)
    {
        echo "Event Created Successfully";
    }
    else
    {
        echo "Event Creation Failed";
    }
}
else
{
    echo "POST method required.";
}