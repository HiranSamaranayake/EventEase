<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once "../config/database.php";

$userId = $_GET['user_id'] ?? 0;
$userId = intval($userId);

// Find categories user likes based on bookings & favorites
$userCategories = [];
if ($userId > 0) {
    $catQuery = "
        SELECT category FROM events WHERE id IN (
            SELECT event_id FROM bookings WHERE user_id = $userId
            UNION
            SELECT event_id FROM favorites WHERE user_id = $userId
        ) AND category IS NOT NULL AND category != ''
    ";
    $catRes = mysqli_query($conn, $catQuery);
    if ($catRes) {
        while ($row = mysqli_fetch_assoc($catRes)) {
            $userCategories[] = mysqli_real_escape_string($conn, $row['category']);
        }
    }
}

$userCategories = array_unique($userCategories);

$whereClause = "WHERE status = 'approved' AND event_date >= CURDATE()";
if ($userId > 0) {
    // Exclude events user already booked
    $whereClause .= " AND id NOT IN (SELECT event_id FROM bookings WHERE user_id = $userId)";
}

$orderBy = "ORDER BY ";
if (!empty($userCategories)) {
    $catList = "'" . implode("','", $userCategories) . "'";
    $orderBy .= "CASE WHEN category IN ($catList) THEN 0 ELSE 1 END, ";
}
$orderBy .= "created_at DESC LIMIT 6";

$recommendQuery = "
SELECT 
    events.id,
    events.title,
    events.description,
    events.event_date,
    events.location,
    events.price,
    events.image,
    events.category,
    organizers.organization_name
FROM events
LEFT JOIN users ON events.organizer_id = users.id
LEFT JOIN organizers ON users.id = organizers.user_id
$whereClause
$orderBy
";

$res = mysqli_query($conn, $recommendQuery);

$recommendations = [];
if ($res) {
    while ($row = mysqli_fetch_assoc($res)) {
        $recommendations[] = $row;
    }
}

echo json_encode([
    "success" => true,
    "recommendations" => $recommendations,
    "user_preferred_categories" => array_values($userCategories)
]);
