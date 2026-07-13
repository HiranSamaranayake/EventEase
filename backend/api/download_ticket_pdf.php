<?php

require_once "../config/database.php";
require_once "../vendor/autoload.php";

use Dompdf\Dompdf;
use Dompdf\Options;

$booking_id = $_GET["booking_id"] ?? 0;

if (!$booking_id) {
    die("Booking ID missing");
}

$sql = "

SELECT

bookings.id AS booking_id,
bookings.ticket_quantity,
bookings.total_amount,
bookings.booking_date,

tickets.ticket_code,
tickets.qr_code,
tickets.status,

events.title,
events.event_date,
events.location,

users.full_name,
users.email

FROM bookings

INNER JOIN tickets
ON bookings.id=tickets.booking_id

INNER JOIN events
ON bookings.event_id=events.id

INNER JOIN users
ON bookings.user_id=users.id

WHERE bookings.id='$booking_id'

LIMIT 1

";

$result = mysqli_query($conn,$sql);

if(!$result){
    die(mysqli_error($conn));
}

$ticket = mysqli_fetch_assoc($result);

if(!$ticket){
    die("Ticket not found");
}

$qrImage = "";

if(!empty($ticket["qr_code"])){

    $file = "../".$ticket["qr_code"];

    if(file_exists($file)){

        $type = pathinfo($file, PATHINFO_EXTENSION);

        $data = file_get_contents($file);

        $qrImage = "data:image/".$type.";base64,".base64_encode($data);

    }

}

$html = '

<html>

<head>

<style>

body{

font-family: DejaVu Sans;

padding:30px;

}

.container{

border:2px solid #6d28d9;

border-radius:15px;

padding:25px;

}

h1{

text-align:center;

color:#6d28d9;

}

table{

width:100%;

border-collapse:collapse;

margin-top:20px;

}

td{

padding:8px;

border-bottom:1px solid #ddd;

}

.qr{

text-align:center;

margin-top:30px;

}

img{

width:180px;

height:180px;

}

</style>

</head>

<body>

<div class="container">

<h1>Event Ticket</h1>

<table>

<tr><td><b>Event</b></td><td>'.$ticket["title"].'</td></tr>

<tr><td><b>Name</b></td><td>'.$ticket["full_name"].'</td></tr>

<tr><td><b>Email</b></td><td>'.$ticket["email"].'</td></tr>

<tr><td><b>Event Date</b></td><td>'.$ticket["event_date"].'</td></tr>

<tr><td><b>Location</b></td><td>'.$ticket["location"].'</td></tr>

<tr><td><b>Booking Date</b></td><td>'.$ticket["booking_date"].'</td></tr>

<tr><td><b>Tickets</b></td><td>'.$ticket["ticket_quantity"].'</td></tr>

<tr><td><b>Total Amount</b></td><td>Rs. '.$ticket["total_amount"].'</td></tr>

<tr><td><b>Ticket Code</b></td><td>'.$ticket["ticket_code"].'</td></tr>

<tr><td><b>Status</b></td><td>'.$ticket["status"].'</td></tr>

</table>

<div class="qr">';

if($qrImage!=""){

$html .= '<img src="'.$qrImage.'">';

}

$html .= '

</div>

</div>

</body>

</html>

';

$options = new Options();

$options->set("isRemoteEnabled", true);

$dompdf = new Dompdf($options);

$dompdf->loadHtml($html);

$dompdf->setPaper("A4","portrait");

$dompdf->render();

$dompdf->stream(

"Ticket-".$ticket["ticket_code"].".pdf",

[
"Attachment"=>true
]

);

exit;

?>