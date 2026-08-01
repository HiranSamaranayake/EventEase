<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

/*
-----------------------------------------
Handle Preflight Request
-----------------------------------------
*/

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {

    http_response_code(200);
    exit();

}

require_once "../config/database.php";

$config = require "../config/payhere.php";

/*
-----------------------------------------
Read JSON
-----------------------------------------
*/

$data = json_decode(file_get_contents("php://input"), true);

$booking_id = $data["booking_id"] ?? 0;

if (!$booking_id) {

    echo json_encode([
        "success" => false,
        "message" => "Booking ID is required"
    ]);

    exit();

}

/*
-----------------------------------------
Get Booking Details
-----------------------------------------
*/

$query = "

SELECT

b.id,
b.total_amount,

u.full_name,
u.email,
u.phone,

e.title

FROM bookings b

INNER JOIN users u
ON b.user_id = u.id

INNER JOIN events e
ON b.event_id = e.id

WHERE b.id='$booking_id'

LIMIT 1

";

$result = mysqli_query($conn, $query);

if (!$result) {

    echo json_encode([
        "success" => false,
        "message" => mysqli_error($conn)
    ]);

    exit();

}

if (mysqli_num_rows($result) == 0) {

    echo json_encode([
        "success" => false,
        "message" => "Booking not found"
    ]);

    exit();

}

$booking = mysqli_fetch_assoc($result);

/*
-----------------------------------------
PayHere Configuration
-----------------------------------------
*/

$merchant_id = $config["merchant_id"];
$merchant_secret = $config["merchant_secret"];

$order_id = $booking["id"];

$amount = number_format(
    $booking["total_amount"],
    2,
    ".",
    ""
);

$currency = "LKR";

/*
-----------------------------------------
Generate PayHere Hash
-----------------------------------------
*/

$hash = strtoupper(

    md5(

        $merchant_id .

        $order_id .

        $amount .

        $currency .

        strtoupper(md5($merchant_secret))

    )

);

/*
-----------------------------------------
Return Payment Object
-----------------------------------------
*/

echo json_encode([

    "success" => true,

    "sandbox" => true,

    "merchant_id" => $merchant_id,

    "return_url" => "http://localhost:5173/payment-success",

    "cancel_url" => "http://localhost:5173/payment-cancel",

"notify_url" => "https://trivial-cosponsor-climatic.ngrok-free.dev/EventEase/backend/api/payhere_notify.php",

    "order_id" => $order_id,

    "items" => $booking["title"],

    "amount" => $amount,

    "currency" => $currency,

    "first_name" => $booking["full_name"],

    "last_name" => "",

    "email" => $booking["email"],

    "phone" => $booking["phone"],

    "address" => "EventEase",

    "city" => "Colombo",

    "country" => "Sri Lanka",

    "hash" => $hash

]);