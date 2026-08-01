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
        "favorites" => [],
        "favorite_ids" => []
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

$query = "
SELECT 
    events.id,
    events.title,
    events.description,
    events.event_date,
    events.location,
    events.price,
    events.image,
    events.category,
    events.status,
    MAX(organizers.organization_name) AS organization_name,
    MAX(favorites.created_at) AS saved_at
FROM favorites
INNER JOIN events ON favorites.event_id = events.id
LEFT JOIN users ON events.organizer_id = users.id
LEFT JOIN organizers ON users.id = organizers.user_id
WHERE favorites.user_id = $userId
GROUP BY events.id
ORDER BY saved_at DESC
";

$result = mysqli_query($conn, $query);

$favorites = [];
$favoriteIds = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $favorites[] = $row;
        $favoriteIds[] = intval($row['id']);
    }
}

echo json_encode([
    "success" => true,
    "favorites" => $favorites,
    "favorite_ids" => array_values(array_unique($favoriteIds))
]);
