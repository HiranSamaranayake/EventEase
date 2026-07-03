<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require_once "../config/database.php";

$title = $_POST["title"] ?? "";
$description = $_POST["description"] ?? "";
$eventDate = $_POST["event_date"] ?? "";
$location = $_POST["location"] ?? "";
$price = $_POST["price"] ?? 0;
$capacity = $_POST["capacity"] ?? 0;
$category = $_POST["category"] ?? "General";
$organizerId = $_POST["organizer_id"] ?? 0;

$imageName = "";

if (isset($_FILES["image"])) {

    $imageName = time() . "_" . basename($_FILES["image"]["name"]);

    $target = "../uploads/" . $imageName;

    move_uploaded_file($_FILES["image"]["tmp_name"], $target);

}

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
    image,
    category,
    event_date,
    location,
    capacity,
    price,
    organizer_id
)

VALUES
(
    '$title',
    '$description',
    '$imageName',
    '$category',
    '$eventDate',
    '$location',
    '$capacity',
    '$price',
    '$organizerId'
)

";

$result = mysqli_query($conn, $query);

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
