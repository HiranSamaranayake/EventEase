<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once __DIR__ . "/../config/database.php";

$raw = file_get_contents("php://input");
$data = json_decode($raw, true) ?? [];

$user_id = intval($data['user_id'] ?? $_POST['user_id'] ?? 0);
$notification_id = intval($data['notification_id'] ?? $_POST['notification_id'] ?? 0);
$mark_all = !empty($data['mark_all']);

if ($user_id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Valid user_id is required"
    ]);
    exit;
}

if ($mark_all) {
    $sql = "UPDATE notifications SET is_read = 1 WHERE user_id = $user_id";
    mysqli_query($conn, $sql);
    echo json_encode([
        "success" => true,
        "message" => "All notifications marked as read"
    ]);
} else if ($notification_id > 0) {
    $sql = "UPDATE notifications SET is_read = 1 WHERE id = $notification_id AND user_id = $user_id";
    mysqli_query($conn, $sql);
    echo json_encode([
        "success" => true,
        "message" => "Notification marked as read"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Specify notification_id or set mark_all = true"
    ]);
}
