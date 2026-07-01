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

if (!$eventId) {

    echo json_encode([
        "success" => false,
        "message" => "Event ID is required"
    ]);

    exit;

}

$query = "

DELETE FROM events

WHERE id = '$eventId'

";

$result = mysqli_query(
    $conn,
    $query
);

if ($result) {

    echo json_encode([
        "success" => true,
        "message" => "Event deleted successfully"
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => mysqli_error($conn)
    ]);

}

?>