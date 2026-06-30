<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../config/database.php";

$userId = $_GET["user_id"] ?? 0;
if (!$userId) {

    echo json_encode([
        "success" => false,
        "message" => "User ID is required"
    ]);

    exit;
}

$query = "

SELECT

    id,
    full_name,
    email,
    phone,
    role,
    created_at

FROM users

WHERE id = '$userId'

LIMIT 1

";

$result = mysqli_query($conn, $query);

if (mysqli_num_rows($result) > 0) {

    $user = mysqli_fetch_assoc($result);

    echo json_encode([
        "success" => true,
        "user" => $user
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "User not found"
    ]);

}
