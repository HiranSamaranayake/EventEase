<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../controllers/EventController.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST')
{
    $id = $_POST['id'] ?? '';
    $title = $_POST['title'] ?? '';
    $description = $_POST['description'] ?? '';
    $event_date = $_POST['event_date'] ?? '';
    $location = $_POST['location'] ?? '';
    $capacity = $_POST['capacity'] ?? '';

    if (empty($id))
    {
        echo "Event ID is required.";
        exit;
    }

    $event = new EventController($conn);

    $result = $event->updateEvent(
        $id,
        $title,
        $description,
        $event_date,
        $location,
        $capacity
    );

    if ($result)
    {
        echo "Event Updated Successfully";
    }
    else
    {
        echo "Event Update Failed";
    }
}
else
{
    echo "POST method required.";
}