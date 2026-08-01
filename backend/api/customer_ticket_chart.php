<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../config/database.php";

$userId = $_GET["user_id"] ?? 0;

/*
For now:

All tickets = Active
Used = 0
Expired = 0

Later we'll implement QR scanning and ticket validation,
then these values will become dynamic.
*/

$query = "
SELECT COUNT(*) AS total
FROM tickets

INNER JOIN bookings
ON tickets.booking_id = bookings.id

WHERE bookings.user_id = '$userId'
";

$result = mysqli_query($conn, $query);

$row = mysqli_fetch_assoc($result);

$total = (int)$row["total"];

$chart = [

    [
        "name" => "Active",
        "value" => $total
    ],

    [
        "name" => "Used",
        "value" => 0
    ],

    [
        "name" => "Expired",
        "value" => 0
    ]

];

echo json_encode([
    "success" => true,
    "chart" => $chart
]);