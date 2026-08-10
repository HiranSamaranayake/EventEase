<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    http_response_code(200);
    exit();
}

require_once "../config/database.php";
require_once "../vendor/autoload.php";

use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;

$data = json_decode(file_get_contents("php://input"), true);

$booking_id = intval($data["booking_id"] ?? 0);

if (!$booking_id) {

    echo json_encode([
        "success" => false,
        "message" => "Booking ID required"
    ]);

    exit();
}

/*
---------------------------------------------------
Update Booking
---------------------------------------------------
*/

$update = mysqli_query($conn, "
    UPDATE bookings
    SET
        payment_status='Paid',
        booking_status='Confirmed'
    WHERE id='$booking_id'
");

if (!$update) {

    echo json_encode([
        "success" => false,
        "message" => mysqli_error($conn)
    ]);

    exit();
}

/*
---------------------------------------------------
Check Existing Ticket
---------------------------------------------------
*/

$check = mysqli_query(
    $conn,
    "SELECT id FROM tickets WHERE booking_id='$booking_id' LIMIT 1"
);

if (mysqli_num_rows($check) == 0) {

    /*
    ---------------------------------------------------
    Generate Ticket Code
    ---------------------------------------------------
    */

    $ticket_code = "EVT-" . $booking_id . "-" . rand(1000, 9999);

    /*
    ---------------------------------------------------
    Generate QR Code
    ---------------------------------------------------
    */

    $qrText =
        "EventEase Ticket\n\n" .
        "Booking ID : " . $booking_id . "\n" .
        "Ticket Code : " . $ticket_code;

    $qrCode = new QrCode($qrText);

    $qrCode->setSize(300);
    $qrCode->setMargin(10);

    $writer = new PngWriter();

    $result = $writer->write($qrCode);

    /*
    ---------------------------------------------------
    Save QR Image
    ---------------------------------------------------
    */

    $folder = "../uploads/qr/";

    if (!file_exists($folder)) {
        mkdir($folder, 0777, true);
    }

    $fileName = "ticket_" . $booking_id . ".png";

    $result->saveToFile($folder . $fileName);

    $qrPath = "uploads/qr/" . $fileName;

    /*
    ---------------------------------------------------
    Insert Ticket
    ---------------------------------------------------
    */

    $insert = mysqli_query($conn, "
        INSERT INTO tickets
        (
            booking_id,
            ticket_code,
            qr_code,
            status
        )
        VALUES
        (
            '$booking_id',
            '$ticket_code',
            '$qrPath',
            'unused'
        )
    ");

    if (!$insert) {

        echo json_encode([
            "success" => false,
            "message" => mysqli_error($conn)
        ]);

        exit();
    }
}

/*
---------------------------------------------------
Send Automated Email Confirmation & Ticket Log
---------------------------------------------------
*/
require_once __DIR__ . "/../utils/email_helper.php";
sendBookingConfirmationEmail($conn, $booking_id);

/*
---------------------------------------------------
Success
---------------------------------------------------
*/

echo json_encode([
    "success" => true,
    "message" => "Payment confirmed, ticket generated, and email sent successfully."
]);

?>