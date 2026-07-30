<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once "../config/database.php";

$raw = file_get_contents("php://input");
$input = json_decode($raw, true) ?? [];

$userId = $_POST['user_id'] ?? $input['user_id'] ?? $_GET['user_id'] ?? 0;
$eventId = $_POST['event_id'] ?? $input['event_id'] ?? $_GET['event_id'] ?? 0;

$userId = intval($userId);
$eventId = intval($eventId);

if ($userId <= 0 || $eventId <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Valid user_id ($userId) and event_id ($eventId) are required"
    ]);
    exit;
}

// Auto-create favorites table if missing
$tableCheck = mysqli_query($conn, "SHOW TABLES LIKE 'favorites'");
if (!$tableCheck || mysqli_num_rows($tableCheck) == 0) {
    $createTable = "CREATE TABLE IF NOT EXISTS favorites (
        id INT(11) NOT NULL AUTO_INCREMENT,
        user_id INT(11) NOT NULL,
        event_id INT(11) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY user_event (user_id, event_id),
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
    mysqli_query($conn, $createTable);
}

// Check if already favorited
$checkSql = "SELECT id FROM favorites WHERE user_id = $userId AND event_id = $eventId";
$checkRes = mysqli_query($conn, $checkSql);

if ($checkRes && mysqli_num_rows($checkRes) > 0) {
    // Already favorited -> delete matching entries
    $deleteSql = "DELETE FROM favorites WHERE user_id = $userId AND event_id = $eventId";
    mysqli_query($conn, $deleteSql);

    echo json_encode([
        "success" => true,
        "is_favorite" => false,
        "event_id" => $eventId,
        "message" => "Removed from saved events"
    ]);
} else {
    // Not favorited -> add it using INSERT IGNORE
    $insertSql = "INSERT IGNORE INTO favorites (user_id, event_id) VALUES ($userId, $eventId)";
    if (mysqli_query($conn, $insertSql)) {
        echo json_encode([
            "success" => true,
            "is_favorite" => true,
            "event_id" => $eventId,
            "message" => "Saved to your favorites!"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Failed to save favorite: " . mysqli_error($conn)
        ]);
    }
}
