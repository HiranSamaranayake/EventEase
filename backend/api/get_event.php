<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../config/database.php";

$eventId = $_GET["id"] ?? 0;

if (!$eventId) {

    echo json_encode([
        "success" => false,
        "message" => "Event ID is required"
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

WHERE id = '$eventId'

";

$result = mysqli_query($conn, $query);

if (mysqli_num_rows($result) == 0) {

    echo json_encode([
        "success" => false,
        "message" => "Event not found"
    ]);

    exit;

}

$event = mysqli_fetch_assoc($result);

echo json_encode([
    "success" => true,
    "event" => $event
]);

?>