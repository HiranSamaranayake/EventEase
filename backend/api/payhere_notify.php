<?php

file_put_contents(
    "notify_log.txt",
    "\n\n====================\n" .
    date("Y-m-d H:i:s") .
    "\nREQUEST METHOD: " . $_SERVER["REQUEST_METHOD"] .
    "\nRAW INPUT:\n" . file_get_contents("php://input") .
    "\nPOST:\n" . print_r($_POST, true) .
    "\nGET:\n" . print_r($_GET, true),
    FILE_APPEND
);

header("Content-Type: text/plain");


header("Content-Type: text/plain");

require_once "../config/database.php";
require_once "../config/payhere.php";
require_once "../vendor/autoload.php";

use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;

$config = require "../config/payhere.php";
/*
-----------------------------------------
Debug Log
-----------------------------------------
*/

file_put_contents(
    __DIR__ . "/notify_log.txt",
    date("Y-m-d H:i:s") . "\n" .
    print_r($_POST, true) . "\n\n",
    FILE_APPEND
);

/*
-----------------------------------------
Receive PayHere POST Data
-----------------------------------------
*/

$merchant_id = $_POST["merchant_id"] ?? "";

$order_id = $_POST["order_id"] ?? "";

$payhere_amount = $_POST["payhere_amount"] ?? "";

$payhere_currency = $_POST["payhere_currency"] ?? "";

$status_code = $_POST["status_code"] ?? "";

$md5sig = $_POST["md5sig"] ?? "";

$payment_id = $_POST["payment_id"] ?? "";

file_put_contents(
    "notify_log.txt",
    "\n\n-----------------------------\n" .
    print_r($_POST, true),
    FILE_APPEND
);



/*
-----------------------------------------
Verify PayHere Signature
-----------------------------------------
*/

$local_md5sig = strtoupper(
    md5(

        $merchant_id .

        $order_id .

        strtoupper(md5($config["merchant_secret"])) .

        $payhere_amount .

        $payhere_currency .

        $status_code

    )
);

// TEMPORARILY DISABLE SIGNATURE CHECK
/*
if ($local_md5sig != $md5sig) {

    http_response_code(400);

    exit("Invalid Signature");

}
*

/*
-----------------------------------------
Only Continue If Payment Success
-----------------------------------------
*/

if ($status_code != "2") {

    exit("Payment Not Completed");

}

/*
-----------------------------------------
Update Payment Record
-----------------------------------------
*/

mysqli_query(
    $conn,
    "
    UPDATE payments
    SET

        payment_status='success',
        transaction_id='$payment_id'

    WHERE booking_id='$order_id'
    "
);

/*
-----------------------------------------
Update Booking
-----------------------------------------
*/

mysqli_query(
    $conn,
    "
    UPDATE bookings
    SET

        booking_status='Confirmed',
        payment_status='Paid'

    WHERE id='$order_id'
    "
);

/*
-----------------------------------------
Get Booking Details
-----------------------------------------
*/

$bookingQuery = mysqli_query(
    $conn,
    "
    SELECT *
    FROM bookings
    WHERE id='$order_id'
    LIMIT 1
    "
);

$booking = mysqli_fetch_assoc($bookingQuery);

/*
-----------------------------------------
Generate Ticket Code
-----------------------------------------
*/

$ticketCode =
    "TKT" .
    str_pad(
        $order_id,
        5,
        "0",
        STR_PAD_LEFT
    );

$qrPath = "uploads/qr/" . $ticketCode . ".png";

/*
-----------------------------------------
Generate QR Code
-----------------------------------------
*/

$qr = new QrCode($ticketCode);

$qr->setSize(300);

$qr->setMargin(10);

$writer = new PngWriter();

$result = $writer->write($qr);

$result->saveToFile(
    __DIR__ . "/../" . $qrPath
);

/*
-----------------------------------------
Create Ticket
-----------------------------------------
*/

mysqli_query(
    $conn,
    "
    INSERT INTO tickets
    (
        booking_id,
        ticket_code,
        qr_code,
        status
    )
    VALUES
    (
        '$order_id',
        '$ticketCode',
        '$qrPath',
        'unused'
    )
    "
);

/*
-----------------------------------------
Save QR Path
-----------------------------------------
*/

mysqli_query(
    $conn,
    "
    UPDATE bookings
    SET qr_code='$qrPath'
    WHERE id='$order_id'
    "
);

/*
-----------------------------------------
Finished
-----------------------------------------
*/

echo "OK";
