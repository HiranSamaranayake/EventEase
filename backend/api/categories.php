<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../config/database.php";

$query = "

SELECT
    category,
    COUNT(*) AS total_events

FROM events

WHERE category IS NOT NULL
AND category <> ''

GROUP BY category

ORDER BY total_events DESC

";

$result = mysqli_query($conn, $query);

$categories = [];

while ($row = mysqli_fetch_assoc($result)) {

    $categories[] = $row;

}

echo json_encode([
    "success" => true,
    "categories" => $categories
]);

?>