<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../config/database.php";

$query = "

SELECT
events.*,
users.full_name
FROM events
INNER JOIN organizers
ON events.organizer_id = organizers.id
INNER JOIN users
ON organizers.user_id = users.id
WHERE events.status = 'approved'
ORDER BY events.event_date DESC
";

$result = mysqli_query($conn, $query);

if (!$result) {

    echo json_encode([
        "success" => false,
        "message" => mysqli_error($conn)
    ]);

    exit;

}

$events = [];

while ($row = mysqli_fetch_assoc($result)) {

    $events[] = $row;

}

echo json_encode([

    "success" => true,

    "events" => $events

]);

?>