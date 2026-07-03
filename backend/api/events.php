<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../config/database.php";

$query = "

SELECT
id,
title,
description,
event_date,
location,
price,
capacity,
image,
category
FROM events
ORDER BY event_date ASC

";

$result = mysqli_query($conn, $query);

if (!$result) {

    echo json_encode([
        "success" => false,
        "message" => mysqli_error($conn)
    ]);

    exit;

}

$events = [];

while ($row = mysqli_fetch_assoc($result)) {

    $events[] = $row;

}

echo json_encode([

    "success" => true,

    "events" => $events

]);

?>