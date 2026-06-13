<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../controllers/EventController.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST')
{
    $id = $_POST['id'] ?? '';

    if (empty($id))
    {
        echo "Event ID is required.";
        exit;
    }

    $event = new EventController($conn);

    $result = $event->deleteEvent($id);

    if ($result)
    {
        echo "Event Deleted Successfully";
    }
    else
    {
        echo "Event Deletion Failed";
    }
}
else
{
    echo "POST method required.";
}