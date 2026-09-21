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

$response = [
    "success" => true,
    "totalBookings" => 0,
    "upcomingEvents" => 0,
    "totalTickets" => 0,
    "totalSpent" => 0.00
];

if ($userId > 0) {
    // Total Bookings for this user
    $bookingQuery = "SELECT COUNT(*) AS total FROM bookings WHERE user_id = $userId AND (booking_status IS NULL OR booking_status != 'Cancelled')";
    $result = mysqli_query($conn, $bookingQuery);
    if ($result && $row = mysqli_fetch_assoc($result)) {
        $response["totalBookings"] = intval($row["total"]);
    }

    // Total Tickets for this user (sum of ticket_quantity in non-cancelled bookings)
    $ticketQuery = "SELECT COALESCE(SUM(ticket_quantity), 0) AS total FROM bookings WHERE user_id = $userId AND (booking_status IS NULL OR booking_status != 'Cancelled')";
    $result = mysqli_query($conn, $ticketQuery);
    if ($result && $row = mysqli_fetch_assoc($result)) {
        $response["totalTickets"] = intval($row["total"]);
    }

    // Upcoming Events booked by this user
    $eventQuery = "SELECT COUNT(DISTINCT b.event_id) AS total 
                   FROM bookings b 
                   JOIN events e ON b.event_id = e.id 
                   WHERE b.user_id = $userId 
                     AND (b.booking_status IS NULL OR b.booking_status != 'Cancelled') 
                     AND e.event_date >= CURDATE()";
    $result = mysqli_query($conn, $eventQuery);
    if ($result && $row = mysqli_fetch_assoc($result)) {
        $response["upcomingEvents"] = intval($row["total"]);
    }

    // Total Spent by this user
    $spentQuery = "SELECT COALESCE(SUM(total_amount), 0) AS total FROM bookings WHERE user_id = $userId AND (payment_status = 'Paid' OR payment_status = 'Completed')";
    $result = mysqli_query($conn, $spentQuery);
    if ($result && $row = mysqli_fetch_assoc($result)) {
        $response["totalSpent"] = floatval($row["total"]);
    }
}

echo json_encode($response);
