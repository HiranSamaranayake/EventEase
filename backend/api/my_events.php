<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../config/database.php";

$organizerId = $_GET["organizer_id"] ?? 0;

if (!$organizerId) {

    echo json_encode([
        "success" => false,
        "message" => "Organizer ID is required"
    ]);

    exit;

}

$query = "

SELECT
    id,
    title,
    description,
    event_date,
    location

FROM events

WHERE organizer_id = '$organizerId'

ORDER BY event_date ASC

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