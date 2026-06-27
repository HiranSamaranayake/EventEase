<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require_once "../config/database.php";
require_once "../vendor/autoload.php";

use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;

$data = json_decode(file_get_contents("php://input"), true);

$userId = $data["user_id"] ?? 0;
$eventId = $data["event_id"] ?? 0;

if (!$userId || !$eventId) {

    echo json_encode([
        "success" => false,
        "message" => "Missing required fields"
    ]);

    exit;
}

$query = "
INSERT INTO bookings
(
    user_id,
    event_id,
    booking_date
)
VALUES
(
    '$userId',
    '$eventId',
    NOW()
)
";

$result = mysqli_query($conn, $query);

if ($result) {

    $bookingId = mysqli_insert_id($conn);

    $ticketCode =
        "TKT" .
        str_pad(
            $bookingId,
            5,
            "0",
            STR_PAD_LEFT
        );
    $qrCode = "uploads/qr/" . $ticketCode . ".png";

$qr = new QrCode($ticketCode);
$qr->setSize(300);
$qr->setMargin(10);

$writer = new PngWriter();

$result = $writer->write($qr);

$result->saveToFile(
    __DIR__ . "/../" . $qrCode
);
    $ticketQuery = "

INSERT INTO tickets
(
    booking_id,
    ticket_code,
    qr_code
)

VALUES
(
    '$bookingId',
    '$ticketCode',
    '$qrCode'
)

";

$ticketResult = mysqli_query(
    $conn,
    $ticketQuery
);

if ($ticketResult) {

    $ticketId = mysqli_insert_id($conn);

    echo json_encode([
        "success" => true,
        "booking_id" => $bookingId,
        "ticket_id" => $ticketId,
        "ticket_code" => $ticketCode
    ]);

} else {

    echo json_encode([
        "success" => false,
        "error" => mysqli_error($conn)
    ]);

}
}
