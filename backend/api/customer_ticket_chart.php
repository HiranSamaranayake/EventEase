<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once __DIR__ . "/../config/database.php";

$userId = isset($_GET["user_id"]) ? intval($_GET["user_id"]) : 0;

$activeTickets = 0;
$usedTickets = 0;
$expiredTickets = 0;

if ($userId > 0) {
    // Active tickets (upcoming events)
    $activeQuery = "SELECT COALESCE(SUM(b.ticket_quantity), 0) AS total 
                    FROM bookings b 
                    JOIN events e ON b.event_id = e.id 
                    WHERE b.user_id = $userId 
                      AND (b.booking_status IS NULL OR b.booking_status != 'Cancelled') 
                      AND e.event_date >= CURDATE()";
    $res = mysqli_query($conn, $activeQuery);
    if ($res && $row = mysqli_fetch_assoc($res)) {
        $activeTickets = intval($row["total"]);
    }

    // Expired / Past event tickets
    $pastQuery = "SELECT COALESCE(SUM(b.ticket_quantity), 0) AS total 
                  FROM bookings b 
                  JOIN events e ON b.event_id = e.id 
                  WHERE b.user_id = $userId 
                    AND (b.booking_status IS NULL OR b.booking_status != 'Cancelled') 
                    AND e.event_date < CURDATE()";
    $res = mysqli_query($conn, $pastQuery);
    if ($res && $row = mysqli_fetch_assoc($res)) {
        $expiredTickets = intval($row["total"]);
    }
}

$chart = [
    ["name" => "Active", "value" => $activeTickets],
    ["name" => "Used", "value" => $usedTickets],
    ["name" => "Expired/Past", "value" => $expiredTickets]
];

echo json_encode([
    "success" => true,
    "chart" => $chart
]);