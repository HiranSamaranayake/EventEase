<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once __DIR__ . '/../config/database.php';

$totalEvents = 0;
$totalBookings = 0;
$totalRevenue = 0;

$eventQuery = "SELECT COUNT(*) AS total FROM events";
$eventResult = mysqli_query($conn, $eventQuery);

if($eventResult){
    $totalEvents = mysqli_fetch_assoc($eventResult)['total'];
}

$bookingQuery = "SELECT COUNT(*) AS total FROM bookings";
$bookingResult = mysqli_query($conn, $bookingQuery);

if($bookingResult){
    $totalBookings = mysqli_fetch_assoc($bookingResult)['total'];
}

$revenueQuery = "
SELECT SUM(amount) AS total
FROM payments
WHERE payment_status='success'
";

$revenueResult = mysqli_query($conn, $revenueQuery);

if($revenueResult){
    $row = mysqli_fetch_assoc($revenueResult);
    $totalRevenue = $row['total'] ?? 0;
}

echo json_encode([
    "success" => true,
    "totalEvents" => $totalEvents,
    "totalBookings" => $totalBookings,
    "totalRevenue" => $totalRevenue
]);