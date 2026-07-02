<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../config/database.php";

$query = "

SELECT
    id,
    full_name,
    email,
    phone,
    role,
    created_at

FROM users

ORDER BY created_at DESC

";

$result = mysqli_query($conn, $query);

$users = [];

while ($row = mysqli_fetch_assoc($result)) {
    $users[] = $row;
}

echo json_encode([
    "success" => true,
    "users" => $users
]);

?>