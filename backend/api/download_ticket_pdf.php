<?php

ini_set('display_errors', 0);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../vendor/autoload.php";

use Dompdf\Dompdf;
use Dompdf\Options;

$booking_id = $_GET["booking_id"] ?? $_GET["id"] ?? 0;
$booking_id = intval($booking_id);

if (!$booking_id) {
    die("Booking ID missing");
}

// Query ticket and booking details
$sql = "
SELECT
    bookings.id AS booking_id,
    bookings.event_id,
    bookings.ticket_quantity,
    bookings.total_amount,
    bookings.booking_date,
    tickets.id AS ticket_id,
    tickets.ticket_code,
    tickets.qr_code,
    tickets.status,
    tickets.seat_number,
    events.title,
    events.event_date,
    events.location,
    users.full_name,
    users.email
FROM bookings
LEFT JOIN tickets ON bookings.id = tickets.booking_id
LEFT JOIN events ON bookings.event_id = events.id
LEFT JOIN users ON bookings.user_id = users.id
WHERE bookings.id = '$booking_id' OR tickets.id = '$booking_id'
ORDER BY tickets.id DESC
LIMIT 1
";

$result = mysqli_query($conn, $sql);

if (!$result || mysqli_num_rows($result) == 0) {
    die("Ticket not found for Booking ID #$booking_id");
}

$ticket = mysqli_fetch_assoc($result);

// Fetch reserved seat codes from event_booked_seats if present
$seatSql = "SELECT GROUP_CONCAT(seat_code SEPARATOR ', ') AS reserved_seats FROM event_booked_seats WHERE booking_id = '$booking_id' OR booking_id = '{$ticket['booking_id']}'";
$seatRes = mysqli_query($conn, $seatSql);
$reservedSeats = "";

if ($seatRes && $seatRow = mysqli_fetch_assoc($seatRes)) {
    $reservedSeats = $seatRow['reserved_seats'] ?? "";
}

$seatNumberDisplay = !empty($reservedSeats) 
    ? $reservedSeats 
    : (!empty($ticket['seat_number']) ? $ticket['seat_number'] : "General Admission");

$ticketCode = !empty($ticket["ticket_code"]) ? $ticket["ticket_code"] : "EVT-" . $ticket["booking_id"] . "-" . rand(1000, 9999);

// Handle Real Scannable QR Code Image
$qrImage = "";
if (!empty($ticket["qr_code"])) {
    $file = __DIR__ . "/../" . $ticket["qr_code"];
    if (file_exists($file)) {
        $type = pathinfo($file, PATHINFO_EXTENSION);
        $data = file_get_contents($file);
        $qrImage = "data:image/" . $type . ";base64," . base64_encode($data);
    }
}

// Fallback: Fetch QR Code from QR Code Generator API if local file missing
if (empty($qrImage)) {
    $qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" . urlencode($ticketCode);
    $ctx = stream_context_create(['http' => ['timeout' => 3]]);
    $qrData = @file_get_contents($qrUrl, false, $ctx);
    if ($qrData) {
        $qrImage = "data:image/png;base64," . base64_encode($qrData);
    }
}

$html = '
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
@page {
    margin: 20px;
}
body {
    font-family: DejaVu Sans, Helvetica, Arial, sans-serif;
    color: #1e293b;
    background-color: #f8fafc;
    margin: 0;
    padding: 10px;
}
.ticket-wrapper {
    max-width: 750px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(109, 40, 217, 0.15);
    border: 1px solid #e2e8f0;
}
.ticket-header {
    background: linear-gradient(135deg, #2e1065 0%, #581c87 50%, #7e22ce 100%);
    color: #ffffff;
    padding: 24px 30px;
    position: relative;
}
.ticket-header table {
    width: 100%;
    border-collapse: collapse;
}
.logo-title {
    font-size: 22px;
    font-weight: 900;
    letter-spacing: 1px;
    color: #ffffff;
    text-transform: uppercase;
}
.logo-subtitle {
    font-size: 11px;
    color: #d8b4fe;
    margin-top: 3px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
}
.pass-type {
    text-align: right;
}
.vip-badge {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: #ffffff;
    font-size: 11px;
    font-weight: 800;
    padding: 6px 14px;
    border-radius: 20px;
    text-transform: uppercase;
    letter-spacing: 1px;
    display: inline-block;
    box-shadow: 0 4px 10px rgba(245, 158, 11, 0.3);
}
.ticket-body {
    padding: 25px 30px;
}
.event-banner {
    background: #f1f5f9;
    border-left: 5px solid #7e22ce;
    padding: 14px 18px;
    border-radius: 12px;
    margin-bottom: 22px;
}
.event-title {
    font-size: 18px;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 4px 0;
}
.event-meta {
    font-size: 12px;
    color: #64748b;
    margin: 0;
}
.details-table {
    width: 100%;
    border-collapse: collapse;
}
.details-table td {
    padding: 10px 8px;
    vertical-align: top;
}
.col-left {
    width: 62%;
    padding-right: 20px;
}
.col-right {
    width: 38%;
    text-align: center;
    border-left: 2px dashed #cbd5e1;
    padding-left: 20px;
}
.field-label {
    font-size: 10px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 3px;
}
.field-value {
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 12px;
}
.seat-box {
    background: #faf5ff;
    border: 1.5px solid #c084fc;
    color: #6b21a8;
    font-size: 15px;
    font-weight: 900;
    padding: 8px 14px;
    border-radius: 10px;
    display: inline-block;
    font-family: monospace;
}
.qr-container {
    background: #ffffff;
    padding: 10px;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    display: inline-block;
    margin-top: 5px;
}
.qr-container img {
    width: 150px;
    height: 150px;
    display: block;
}
.ticket-code {
    font-family: monospace;
    font-size: 13px;
    font-weight: 800;
    color: #6b21a8;
    margin-top: 8px;
    letter-spacing: 1px;
}
.ticket-footer {
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;
    padding: 14px 30px;
    font-size: 10px;
    color: #94a3b8;
    text-align: center;
}
</style>
</head>
<body>

<div class="ticket-wrapper">
    <!-- Header -->
    <div class="ticket-header">
        <table>
            <tr>
                <td>
                    <div class="logo-title">EventEase</div>
                    <div class="logo-subtitle">Official Entry Pass</div>
                </td>
                <td class="pass-type">
                    <span class="vip-badge">Verified Pass</span>
                </td>
            </tr>
        </table>
    </div>

    <!-- Main Content Body -->
    <div class="ticket-body">
        <!-- Event Name Banner -->
        <div class="event-banner">
            <h2 class="event-title">'.$ticket["title"].'</h2>
            <p class="event-meta">📅 '.$ticket["event_date"].' &bull; 📍 '.$ticket["location"].'</p>
        </div>

        <table class="details-table">
            <tr>
                <!-- Left Details Column -->
                <td class="col-left">
                    <div class="field-label">Attendee Name</div>
                    <div class="field-value">'.$ticket["full_name"].'</div>

                    <div class="field-label">Attendee Email</div>
                    <div class="field-value">'.$ticket["email"].'</div>

                    <div class="field-label">Reserved Seat Number(s)</div>
                    <div class="field-value">
                        <span class="seat-box">'.$seatNumberDisplay.'</span>
                    </div>

                    <table style="width: 100%; margin-top: 10px;">
                        <tr>
                            <td style="padding:0;">
                                <div class="field-label">Booking Reference</div>
                                <div class="field-value">#'.$ticket["booking_id"].'</div>
                            </td>
                            <td style="padding:0;">
                                <div class="field-label">Ticket Quantity</div>
                                <div class="field-value">'.$ticket["ticket_quantity"].' Ticket(s)</div>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:0;">
                                <div class="field-label">Total Amount Paid</div>
                                <div class="field-value" style="color: #059669; font-size: 15px;">LKR '.number_format(floatval($ticket["total_amount"]), 2).'</div>
                            </td>
                            <td style="padding:0;">
                                <div class="field-label">Status</div>
                                <div class="field-value" style="color: #0284c7;">'.strtoupper($ticket["status"] ?? 'VALID').'</div>
                            </td>
                        </tr>
                    </table>
                </td>

                <!-- Right QR Code Column -->
                <td class="col-right">
                    <div class="field-label" style="margin-bottom: 8px;">Scan at Entrance</div>
                    <div class="qr-container">';
if (!empty($qrImage)) {
    $html .= '<img src="'.$qrImage.'">';
}
$html .= '
                    </div>
                    <div class="ticket-code">'.$ticketCode.'</div>
                    <div style="font-size: 9px; color: #94a3b8; margin-top: 6px;">Valid for single gate entry</div>
                </td>
            </tr>
        </table>
    </div>

    <!-- Footer Security Notice -->
    <div class="ticket-footer">
        EventEase Digital Pass &bull; Generated on '.date('Y-m-d H:i:s').' &bull; Keep ticket barcode confidential
    </div>
</div>

</body>
</html>
';

$options = new Options();
$options->set("isRemoteEnabled", true);

$dompdf = new Dompdf($options);
$dompdf->loadHtml($html);
$dompdf->setPaper("A4", "portrait");
$dompdf->render();

$dompdf->stream(
    "Ticket-" . $ticketCode . ".pdf",
    ["Attachment" => true]
);

exit;