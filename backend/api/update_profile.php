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

$userId = $data["user_id"] ?? 0;

$fullName = trim(
    $data["full_name"] ?? ""
);

$phone = trim(
    $data["phone"] ?? ""
);

if (
    !$userId ||
    empty($fullName)
) {

    echo json_encode([
        "success" => false,
        "message" => "Missing required fields"
    ]);

    exit;
}

$query = "

UPDATE users

SET

full_name = '$fullName',

phone = '$phone'

WHERE id = '$userId'

";

$result = mysqli_query(
    $conn,
    $query
);

if ($result) {

    echo json_encode([
        "success" => true,
        "message" => "Profile updated successfully"
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => mysqli_error($conn)
    ]);

}