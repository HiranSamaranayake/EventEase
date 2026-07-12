<?php

require_once "../vendor/autoload.php";
require_once "../config/database.php";

use Dompdf\Dompdf;

$id = $_GET["id"] ?? 0;

/*
-----------------------------------------
Get Ticket
-----------------------------------------
*/

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
LIMIT 1
";

$result = mysqli_query($conn, $query);

$ticket = mysqli_fetch_assoc($result);

if (!$ticket) {
    die("Ticket Not Found");
}

/*
-----------------------------------------
Convert QR Image to Base64
-----------------------------------------
*/

$qrFile = "../" . $ticket["qr_code"];

$qrImage = "";

if (file_exists($qrFile)) {

    $imageData = base64_encode(file_get_contents($qrFile));

    $qrImage = "data:image/png;base64," . $imageData;
}

/*
-----------------------------------------
Create HTML
-----------------------------------------
*/

$html = '

<div style="text-align:center;">

    <h1 style="color:#6D28D9;">
        EVENTEASE
    </h1>

    <h2>
        Event Ticket
    </h2>

</div>

<hr>

<p><strong>Ticket Code :</strong> ' . $ticket["ticket_code"] . '</p>

<p><strong>Event :</strong> ' . $ticket["title"] . '</p>

<p><strong>Date :</strong> ' . $ticket["event_date"] . '</p>

<p><strong>Location :</strong> ' . $ticket["location"] . '</p>

<br><br>

<h3 style="text-align:center;">
Scan this QR Code at the Entrance
</h3>

<div style="text-align:center;">';

if ($qrImage != "") {

    $html .= '
        <img
            src="' . $qrImage . '"
            width="180"
        >
    ';

} else {

    $html .= '
        <p style="color:red;">
            QR Code Not Found
        </p>
    ';

}

$html .= '

</div>

<br><br>

<p style="text-align:center;">
Thank you for booking with <strong>EventEase</strong>.
</p>

';

/*
-----------------------------------------
Generate PDF
-----------------------------------------
*/

$dompdf = new Dompdf();

$dompdf->loadHtml($html);

$dompdf->setPaper("A4", "portrait");

$dompdf->render();

$dompdf->stream(
    "Ticket_" . $ticket["ticket_code"] . ".pdf",
    [
        "Attachment" => true
    ]
);

?>