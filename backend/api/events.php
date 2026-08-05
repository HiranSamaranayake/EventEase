<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once __DIR__ . "/../config/database.php";

$query = "

SELECT
events.*,
COALESCE(organizers.organization_name, users.full_name, 'Verified Organizer') AS full_name,
COALESCE(organizers.organization_name, users.full_name, 'Verified Organizer') AS organization_name
FROM events
LEFT JOIN users ON events.organizer_id = users.id
LEFT JOIN organizers ON users.id = organizers.user_id OR events.organizer_id = organizers.id
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