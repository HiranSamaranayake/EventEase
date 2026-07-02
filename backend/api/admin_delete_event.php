<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"] ?? 0;

if (!$id) {
    echo json_encode([
        "success" => false,
        "message" => "Event ID is required."
    ]);
    exit;
}

/*
|--------------------------------------------------------------------------
| Check if the event has any bookings
|--------------------------------------------------------------------------
*/

$checkQuery = "
SELECT COUNT(*) AS total
FROM bookings
WHERE event_id = '$id'
";

$checkResult = mysqli_query($conn, $checkQuery);

$row = mysqli_fetch_assoc($checkResult);

if ($row["total"] > 0) {

    echo json_encode([
        "success" => false,
        "message" => "This event cannot be deleted because it already has bookings."
    ]);

    exit;
}

/*
|--------------------------------------------------------------------------
| Safe to delete
|--------------------------------------------------------------------------
*/

$deleteQuery = "
DELETE FROM events
WHERE id = '$id'
";

if (mysqli_query($conn, $deleteQuery)) {

    echo json_encode([
        "success" => true
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => mysqli_error($conn)
    ]);

}