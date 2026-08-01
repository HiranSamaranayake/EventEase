<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../controllers/AdminController.php';

$admin = new AdminController($conn);

$result = $admin->getAdminSummary();

header('Content-Type: application/json');

echo json_encode($result);