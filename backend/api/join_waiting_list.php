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
$action = $_POST['action'] ?? $input['action'] ?? $_GET['action'] ?? 'join';

$userId = intval($userId);
$eventId = intval($eventId);

if ($userId <= 0 || $eventId <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Valid user_id ($userId) and event_id ($eventId) are required"
    ]);
    exit;
}

// Auto-create waiting_list table if missing
$tableCheck = mysqli_query($conn, "SHOW TABLES LIKE 'waiting_list'");
if (!$tableCheck || mysqli_num_rows($tableCheck) == 0) {
    $createTable = "CREATE TABLE IF NOT EXISTS waiting_list (
        id INT(11) NOT NULL AUTO_INCREMENT,
        user_id INT(11) NOT NULL,
        event_id INT(11) NOT NULL,
        priority_level INT(11) DEFAULT 0,
        status ENUM('waiting', 'notified', 'cancelled') DEFAULT 'waiting',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY user_event_wait (user_id, event_id),
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
    mysqli_query($conn, $createTable);
}

// Ensure priority_level column exists
$pCheck = mysqli_query($conn, "SHOW COLUMNS FROM waiting_list LIKE 'priority_level'");
if (!$pCheck || mysqli_num_rows($pCheck) == 0) {
    @mysqli_query($conn, "ALTER TABLE waiting_list ADD COLUMN priority_level INT(11) DEFAULT 0 AFTER event_id");
}

require_once __DIR__ . "/../utils/user_subscription_helper.php";

// Fetch customer active subscription status
$isPremiumActive = isUserPremiumActive($conn, $userId);
$priorityLevel = $isPremiumActive ? 10 : 0;

if ($action === 'leave') {
    $deleteSql = "DELETE FROM waiting_list WHERE user_id = $userId AND event_id = $eventId";
    mysqli_query($conn, $deleteSql);

    echo json_encode([
        "success" => true,
        "is_waiting" => false,
        "message" => "You have left the waiting list."
    ]);
    exit;
}

// Check if already in waiting list
$checkSql = "SELECT id, status FROM waiting_list WHERE user_id = $userId AND event_id = $eventId";
$checkRes = mysqli_query($conn, $checkSql);

if ($checkRes && mysqli_num_rows($checkRes) > 0) {
    // Calculate priority position (ordered by priority_level DESC, id ASC)
    $posSql = "SELECT COUNT(*) AS pos FROM waiting_list 
               WHERE event_id = $eventId AND status = 'waiting' 
               AND (priority_level > $priorityLevel OR (priority_level = $priorityLevel AND id <= (SELECT id FROM waiting_list WHERE user_id = $userId AND event_id = $eventId LIMIT 1)))";
    $posRes = mysqli_query($conn, $posSql);
    $posData = mysqli_fetch_assoc($posRes);
    $position = max(1, intval($posData['pos'] ?? 1));

    echo json_encode([
        "success" => true,
        "is_waiting" => true,
        "position" => $position,
        "priority_pass" => ($userTier === 'premium'),
        "message" => ($userTier === 'premium') 
            ? "⭐ Premium Priority Pass Active! You hold Priority Rank #$position in line." 
            : "You are in line at Position #$position for this event."
    ]);
    exit;
}

// Add user to waiting list with priority_level
$insertSql = "INSERT INTO waiting_list (user_id, event_id, priority_level, status) VALUES ($userId, $eventId, $priorityLevel, 'waiting')";

if (mysqli_query($conn, $insertSql)) {
    $posSql = "SELECT COUNT(*) AS pos FROM waiting_list 
               WHERE event_id = $eventId AND status = 'waiting' 
               AND (priority_level > $priorityLevel OR (priority_level = $priorityLevel AND id <= (SELECT id FROM waiting_list WHERE user_id = $userId AND event_id = $eventId LIMIT 1)))";
    $posRes = mysqli_query($conn, $posSql);
    $posData = mysqli_fetch_assoc($posRes);
    $position = max(1, intval($posData['pos'] ?? 1));

    echo json_encode([
        "success" => true,
        "is_waiting" => true,
        "position" => $position,
        "priority_pass" => ($userTier === 'premium'),
        "message" => ($userTier === 'premium')
            ? "⭐ Joined waiting list with Premium Priority Pass! You are Priority Rank #$position."
            : "Successfully joined waiting list! You are Position #$position in line."
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Failed to join waiting list: " . mysqli_error($conn)
    ]);
}
