<?php

ini_set('display_errors', 0);
error_reporting(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../vendor/autoload.php";

use Dompdf\Dompdf;
use Dompdf\Options;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;

// Parse parameter flexible format (booking_id, id, order_id)
$raw_id = $_GET["booking_id"] ?? $_GET["id"] ?? $_GET["order_id"] ?? 0;
$raw_id = trim($raw_id);

$booking_id = 0;
$ticket_code_search = "";

if (is_numeric($raw_id)) {
    $booking_id = intval($raw_id);
} else if (!empty($raw_id)) {
    $ticket_code_search = mysqli_real_escape_string($conn, $raw_id);
    if (preg_match('/(\d+)/', $raw_id, $matches)) {
        $booking_id = intval($matches[1]);
    }
}

if (!$booking_id && empty($ticket_code_search)) {
    http_response_code(400);
    header("Content-Type: application/json");
    echo json_encode([
        "success" => false,
        "message" => "Booking ID or Ticket Reference Code is missing"
    ]);
    exit;
}

$whereClause = [];
if ($booking_id > 0) {
    $whereClause[] = "bookings.id = '$booking_id'";
    $whereClause[] = "tickets.id = '$booking_id'";
    $whereClause[] = "tickets.booking_id = '$booking_id'";
}
if (!empty($ticket_code_search)) {
    $whereClause[] = "tickets.ticket_code = '$ticket_code_search'";
}

$sql = "
SELECT
    bookings.id AS booking_id,
    bookings.user_id,
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
WHERE " . implode(" OR ", $whereClause) . "
ORDER BY tickets.id DESC
LIMIT 1
";

$result = mysqli_query($conn, $sql);

if (!$result || mysqli_num_rows($result) == 0) {
    http_response_code(404);
    header("Content-Type: application/json");
    echo json_encode([
        "success" => false,
        "message" => "Ticket details not found for the specified booking."
    ]);
    exit;
}

$ticket = mysqli_fetch_assoc($result);
$bId = $ticket['booking_id'];

// If ticket code is empty, generate and persist it
if (empty($ticket["ticket_code"])) {
    $ticketCode = "EVT-" . $bId . "-" . rand(1000, 9999);
    $ticket["ticket_code"] = $ticketCode;
    
    if (empty($ticket['ticket_id'])) {
        $ins = "INSERT INTO tickets (booking_id, ticket_code, status) VALUES ('$bId', '$ticketCode', 'paid')";
        mysqli_query($conn, $ins);
    } else {
        $upd = "UPDATE tickets SET ticket_code = '$ticketCode' WHERE id = '{$ticket['ticket_id']}'";
        mysqli_query($conn, $upd);
    }
} else {
    $ticketCode = $ticket["ticket_code"];
}

// Fetch reserved seat codes from event_booked_seats if present
$seatSql = "SELECT GROUP_CONCAT(seat_code SEPARATOR ', ') AS reserved_seats FROM event_booked_seats WHERE booking_id = '$bId'";
$seatRes = mysqli_query($conn, $seatSql);
$reservedSeats = "";

if ($seatRes && $seatRow = mysqli_fetch_assoc($seatRes)) {
    $reservedSeats = $seatRow['reserved_seats'] ?? "";
}

$seatNumberDisplay = !empty($reservedSeats) 
    ? $reservedSeats 
    : (!empty($ticket['seat_number']) ? $ticket['seat_number'] : "General Admission");

// Generate scannable QR Code as base64 Data URI using Endroid QR Code
$qrImage = "";
try {
    $qrCodeObj = QrCode::create($ticketCode)
        ->setSize(200)
        ->setMargin(5);
    $writer = new PngWriter();
    $qrResult = $writer->write($qrCodeObj);
    $qrImage = $qrResult->getDataUri();
} catch (Throwable $e) {
    // Fallback: Check local uploaded QR image or external API
    if (!empty($ticket["qr_code"])) {
        $file = __DIR__ . "/../" . $ticket["qr_code"];
        if (file_exists($file)) {
            $type = pathinfo($file, PATHINFO_EXTENSION);
            $data = file_get_contents($file);
            $qrImage = "data:image/" . $type . ";base64," . base64_encode($data);
        }
    }
    if (empty($qrImage)) {
        $qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" . urlencode($ticketCode);
        $ctx = stream_context_create(['http' => ['timeout' => 3]]);
        $qrData = @file_get_contents($qrUrl, false, $ctx);
        if ($qrData) {
            $qrImage = "data:image/png;base64," . base64_encode($qrData);
        }
    }
}

$eventTitle = htmlspecialchars($ticket["title"] ?? "Event Pass");
$eventDate = htmlspecialchars($ticket["event_date"] ?? "N/A");
$eventLocation = htmlspecialchars($ticket["location"] ?? "Main Venue");
$fullName = htmlspecialchars($ticket["full_name"] ?? "Valued Customer");
$email = htmlspecialchars($ticket["email"] ?? "N/A");
$ticketQty = intval($ticket["ticket_quantity"] ?? 1);
$totalAmount = number_format(floatval($ticket["total_amount"] ?? 0), 2);
$ticketStatus = strtoupper($ticket["status"] ?? 'VALID');

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
    font-family: Helvetica, Arial, sans-serif;
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
    background: #2e1065;
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
    background: #d97706;
    color: #ffffff;
    font-size: 11px;
    font-weight: 800;
    padding: 6px 14px;
    border-radius: 20px;
    text-transform: uppercase;
    letter-spacing: 1px;
    display: inline-block;
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
            <h2 class="event-title">'.$eventTitle.'</h2>
            <p class="event-meta"><strong>Date:</strong> '.$eventDate.' &nbsp;&bull;&nbsp; <strong>Location:</strong> '.$eventLocation.'</p>
        </div>

        <table class="details-table">
            <tr>
                <!-- Left Details Column -->
                <td class="col-left">
                    <div class="field-label">Attendee Name</div>
                    <div class="field-value">'.$fullName.'</div>

                    <div class="field-label">Attendee Email</div>
                    <div class="field-value">'.$email.'</div>

                    <div class="field-label">Reserved Seat Number(s)</div>
                    <div class="field-value">
                        <span class="seat-box">'.$seatNumberDisplay.'</span>
                    </div>

                    <table style="width: 100%; margin-top: 10px;">
                        <tr>
                            <td style="padding:0;">
                                <div class="field-label">Booking Reference</div>
                                <div class="field-value">#'.$bId.'</div>
                            </td>
                            <td style="padding:0;">
                                <div class="field-label">Ticket Quantity</div>
                                <div class="field-value">'.$ticketQty.' Ticket(s)</div>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:0;">
                                <div class="field-label">Total Amount Paid</div>
                                <div class="field-value" style="color: #059669; font-size: 15px;">LKR '.$totalAmount.'</div>
                            </td>
                            <td style="padding:0;">
                                <div class="field-label">Status</div>
                                <div class="field-value" style="color: #0284c7;">'.$ticketStatus.'</div>
                            </td>
                        </tr>
                    </table>
                </td>

                <!-- Right QR Code Column -->
                <td class="col-right">
                    <div class="field-label" style="margin-bottom: 8px;">Scan at Entrance</div>
                    <div class="qr-container">';
if (!empty($qrImage)) {
    $html .= '<img src="'.$qrImage.'" width="150" height="150">';
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
$options->set("isHtml5ParserEnabled", true);

$dompdf = new Dompdf($options);
$dompdf->loadHtml($html);
$dompdf->setPaper("A4", "portrait");
$dompdf->render();

$pdfStream = $dompdf->output();

// Clear any existing output buffers to prevent corruption of PDF binary stream
while (ob_get_level() > 0) {
    ob_end_clean();
}

header("Content-Type: application/pdf");
header("Content-Disposition: attachment; filename=\"Ticket-" . $ticketCode . ".pdf\"");
header("Content-Length: " . strlen($pdfStream));
header("Cache-Control: private, max-age=0, must-revalidate");
header("Pragma: public");

echo $pdfStream;
exit;