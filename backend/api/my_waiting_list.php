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

$userId = $_GET['user_id'] ?? 0;
$userId = intval($userId);

if ($userId <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Valid user_id is required",
        "waiting_list" => [],
        "waiting_event_ids" => []
    ]);
    exit;
}

// Auto-create waiting_list table if missing
$tableCheck = mysqli_query($conn, "SHOW TABLES LIKE 'waiting_list'");
if (!$tableCheck || mysqli_num_rows($tableCheck) == 0) {
    echo json_encode([
        "success" => true,
        "waiting_list" => [],
        "waiting_event_ids" => []
    ]);
    exit;
}

$query = "
SELECT 
    waiting_list.id AS wait_id,
    waiting_list.event_id,
    waiting_list.status AS wait_status,
    waiting_list.created_at AS joined_at,
    events.title,
    events.description,
    events.event_date,
    events.location,
    events.price,
    events.image,
    events.category,
    events.capacity,
    organizers.organization_name
FROM waiting_list
INNER JOIN events ON waiting_list.event_id = events.id
LEFT JOIN users ON events.organizer_id = users.id
LEFT JOIN organizers ON users.id = organizers.user_id
WHERE waiting_list.user_id = $userId
ORDER BY waiting_list.created_at DESC
";

$result = mysqli_query($conn, $query);

$waitingList = [];
$waitingEventIds = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $eventId = intval($row['event_id']);
        
        // Calculate user position in queue for this event
        $posSql = "SELECT COUNT(*) AS pos FROM waiting_list WHERE event_id = $eventId AND status = 'waiting' AND id <= " . intval($row['wait_id']);
        $posRes = mysqli_query($conn, $posSql);
        $posData = mysqli_fetch_assoc($posRes);
        $row['position'] = intval($posData['pos'] ?? 1);

        $waitingList[] = $row;
        $waitingEventIds[] = $eventId;
    }
}

echo json_encode([
    "success" => true,
    "waiting_list" => $waitingList,
    "waiting_event_ids" => array_values(array_unique($waitingEventIds))
]);
