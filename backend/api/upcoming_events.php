<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once __DIR__ . '/../config/database.php';

$query = "
SELECT
    id,
    title,
    event_date,
    location
FROM events
WHERE event_date >= CURDATE()
ORDER BY event_date ASC
LIMIT 5
";

$result = mysqli_query($conn, $query);

$events = [];

while ($row = mysqli_fetch_assoc($result)) {

    $events[] = $row;
}

echo json_encode([
    "success" => true,
    "events" => $events
]);
