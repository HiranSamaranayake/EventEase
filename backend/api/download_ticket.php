<?php

require_once "../vendor/autoload.php";
require_once "../config/database.php";

use Dompdf\Dompdf;

$id = $_GET['id'] ?? 0;

$query = "
SELECT
tickets.id,
tickets.ticket_code,
tickets.qr_code,

events.title,
events.event_date,
events.location

FROM tickets

INNER JOIN bookings
ON tickets.booking_id = bookings.id

INNER JOIN events
ON bookings.event_id = events.id

WHERE tickets.id = $id
";

$result = mysqli_query($conn, $query);

$ticket = mysqli_fetch_assoc($result);

if (!$ticket) {

    die("Ticket Not Found");
}

$html = "

<h1 style='text-align:center;color:#6D28D9;'>
EVENTEASE
</h1>

<hr>

<h2>Ticket Information</h2>

<p><strong>Ticket Code:</strong> {$ticket['ticket_code']}</p>

<p><strong>Event:</strong> {$ticket['title']}</p>

<p><strong>Date:</strong> {$ticket['event_date']}</p>

<p><strong>Location:</strong> {$ticket['location']}</p>

<br>

<p style='text-align:center'>
Thank You For Booking With EventEase
</p>

";

$dompdf = new Dompdf();

$dompdf->loadHtml($html);

$dompdf->setPaper('A4', 'portrait');

$dompdf->render();

$dompdf->stream(
    "Ticket_{$ticket['ticket_code']}.pdf",
    ["Attachment" => true]
);
