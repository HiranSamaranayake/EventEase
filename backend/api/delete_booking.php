<?php

header("Content-Type: application/json");

require_once "../config/database.php";

$id = $_GET["id"] ?? 0;

if (!$id) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid booking ID."
    ]);
    exit;
}

/*
-----------------------------------------
Check Booking Status
-----------------------------------------
*/

$result = mysqli_query(
    $conn,
    "SELECT booking_status FROM bookings WHERE id='$id' LIMIT 1"
);

if (mysqli_num_rows($result) == 0) {

    echo json_encode([
        "success" => false,
        "message" => "Booking not found."
    ]);

    exit;
}

$booking = mysqli_fetch_assoc($result);

/*
-----------------------------------------
Prevent deleting confirmed bookings
-----------------------------------------
*/

if ($booking["booking_status"] == "Confirmed") {

    echo json_encode([
        "success" => false,
        "message" => "Confirmed bookings cannot be deleted."
    ]);

    exit;
}

/*
-----------------------------------------
Delete related payment
-----------------------------------------
*/

mysqli_query(
    $conn,
    "DELETE FROM payments WHERE booking_id='$id'"
);

/*
-----------------------------------------
Delete related ticket
-----------------------------------------
*/

mysqli_query(
    $conn,
    "DELETE FROM tickets WHERE booking_id='$id'"
);

/*
-----------------------------------------
Delete booking
-----------------------------------------
*/

mysqli_query(
    $conn,
    "DELETE FROM bookings WHERE id='$id'"
);

echo json_encode([
    "success" => true,
    "message" => "Booking deleted successfully."
]);