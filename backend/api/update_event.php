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

$eventId = $data["event_id"] ?? 0;
$title = $data["title"] ?? "";
$description = $data["description"] ?? "";
$eventDate = $data["event_date"] ?? "";
$location = $data["location"] ?? "";

if (
    !$eventId ||
    empty($title) ||
    empty($description) ||
    empty($eventDate) ||
    empty($location)
) {

    echo json_encode([
        "success" => false,
        "message" => "Missing required fields"
    ]);

    exit;

}

$query = "

UPDATE events

SET

title = '$title',

description = '$description',

event_date = '$eventDate',

location = '$location'

WHERE id = '$eventId'

";

$result = mysqli_query(
    $conn,
    $query
);

if ($result) {

    echo json_encode([
        "success" => true,
        "message" => "Event updated successfully"
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => mysqli_error($conn)
    ]);

}

?>