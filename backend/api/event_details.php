<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../config/database.php";

$id = (int)($_GET['id'] ?? 0);

$query = "
SELECT *
FROM events
WHERE id = $id
";

$result = mysqli_query($conn, $query);

if (mysqli_num_rows($result) > 0) {

    echo json_encode([
        "success" => true,
        "event" => mysqli_fetch_assoc($result)
    ]);
} else {

    echo json_encode([
        "success" => false
    ]);
}
