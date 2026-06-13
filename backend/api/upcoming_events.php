<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../controllers/DashboardController.php';

$organizer_id = $_GET['organizer_id'] ?? '';

if (empty($organizer_id))
{
    echo "Organizer ID is required.";
    exit;
}

$dashboard = new DashboardController($conn);

$result = $dashboard->getUpcomingEvents($organizer_id);

header('Content-Type: application/json');

echo json_encode($result);