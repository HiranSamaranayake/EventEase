<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $data["user_id"] ?? 0;
$event_id = $data["event_id"] ?? 0;
$ticket_quantity = $data["ticket_quantity"] ?? 1;

if (!$user_id || !$event_id) {

    echo json_encode([
        "success" => false,
        "message" => "Missing required fields"
    ]);

    exit();

}

/*
-----------------------------------------
Get Event
-----------------------------------------
*/

$eventQuery = mysqli_query(
    $conn,
    "SELECT price FROM events WHERE id='$event_id' LIMIT 1"
);

if (mysqli_num_rows($eventQuery) == 0) {

    echo json_encode([
        "success" => false,
        "message" => "Event not found"
    ]);

    exit();

}

$event = mysqli_fetch_assoc($eventQuery);

$total_amount =
    $event["price"] * $ticket_quantity;

/*
-----------------------------------------
Start Transaction
-----------------------------------------
*/

mysqli_begin_transaction($conn);

try {

    /*
    -----------------------------------------
    Create Booking
    -----------------------------------------
    */

    $bookingQuery = "

    INSERT INTO bookings
    (

        user_id,
        event_id,
        ticket_quantity,
        total_amount,
        booking_status

    )

    VALUES
    (

        '$user_id',
        '$event_id',
        '$ticket_quantity',
        '$total_amount',
        'Pending'

    )

    ";

    mysqli_query($conn, $bookingQuery);

    $booking_id = mysqli_insert_id($conn);

    /*
    -----------------------------------------
    Create Payment
    -----------------------------------------
    */

    $paymentQuery = "

    INSERT INTO payments
    (

        booking_id,
        amount,
        payment_status

    )

    VALUES
    (

        '$booking_id',
        '$total_amount',
        'Pending'

    )

    ";

    mysqli_query($conn, $paymentQuery);

    /*
    -----------------------------------------
    Commit
    -----------------------------------------
    */

    mysqli_commit($conn);

    echo json_encode([

        "success" => true,

        "booking_id" => $booking_id,

        "amount" => $total_amount

    ]);

} catch (Exception $e) {

    mysqli_rollback($conn);

    echo json_encode([

        "success" => false,

        "message" => $e->getMessage()

    ]);

}