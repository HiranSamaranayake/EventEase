<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../config/database.php";

$query = "

SELECT

events.*,

users.full_name AS organizer

FROM events

INNER JOIN organizers
ON events.organizer_id = organizers.id

INNER JOIN users
ON organizers.user_id = users.id

ORDER BY events.created_at DESC

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