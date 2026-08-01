<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../config/database.php";

$userId = $_GET["user_id"] ?? 0;

$query = "
SELECT
    MONTHNAME(booking_date) AS month,
    COUNT(*) AS bookings

FROM bookings

WHERE user_id = '$userId'

GROUP BY MONTH(booking_date)

ORDER BY MONTH(booking_date)
";

$result = mysqli_query($conn, $query);

$chart = [];

while ($row = mysqli_fetch_assoc($result)) {

    $chart[] = $row;

}

echo json_encode([
    "success" => true,
    "chart" => $chart
]);