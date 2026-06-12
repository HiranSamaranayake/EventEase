<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../controllers/EventController.php';

$event = new EventController($conn);

$events = $event->getEvents();

header('Content-Type: application/json');

echo json_encode($events);