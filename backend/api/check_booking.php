<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../config/database.php";

$id = $_GET["id"] ?? 0;

if (!$id) {

    echo json_encode([
        "success" => false,
        "message" => "Booking ID required"
    ]);

    exit();

}

$query = mysqli_query(
    $conn,
    "SELECT booking_status, payment_status
     FROM bookings
     WHERE id='$id'
     LIMIT 1"
);

if (mysqli_num_rows($query) == 0) {

    echo json_encode([
        "success" => false,
        "message" => "Booking not found"
    ]);

    exit();

}

$booking = mysqli_fetch_assoc($query);

echo json_encode([
    "success" => true,
    "booking_status" => $booking["booking_status"],
    "payment_status" => $booking["payment_status"]
]);