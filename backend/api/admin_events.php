<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../config/database.php";

$query = "

SELECT

events.id,
events.title,
events.event_date,
events.location,

users.full_name AS organizer

FROM events

INNER JOIN users
ON events.organizer_id = users.id

ORDER BY events.event_date DESC

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

?>