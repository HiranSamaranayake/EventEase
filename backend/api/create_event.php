<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require_once "../config/database.php";

$data = json_decode(
    file_get_contents("php://input"),
    true
);

$title = $data["title"] ?? "";
$description = $data["description"] ?? "";
$eventDate = $data["event_date"] ?? "";
$location = $data["location"] ?? "";
$organizerId = $data["organizer_id"] ?? 0;

if (
    empty($title) ||
    empty($description) ||
    empty($eventDate) ||
    empty($location) ||
    !$organizerId
) {

    echo json_encode([
        "success" => false,
        "message" => "Missing required fields"
    ]);

    exit;

}

$query = "

INSERT INTO events
(
    title,
    description,
    event_date,
    location,
    organizer_id
)

VALUES
(
    '$title',
    '$description',
    '$eventDate',
    '$location',
    '$organizerId'
)

";

$result = mysqli_query(
    $conn,
    $query
);

if ($result) {

    echo json_encode([
        "success" => true,
        "message" => "Event created successfully"
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => mysqli_error($conn)
    ]);

}

?>