<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "../config/database.php";

$booking_id = $_GET["booking_id"] ?? 0;


if(!$booking_id){

    echo json_encode([
        "success"=>false,
        "message"=>"Booking ID missing"
    ]);

    exit;

}



$query = "

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

ON bookings.id = tickets.booking_id


INNER JOIN events

ON bookings.event_id = events.id


INNER JOIN users

ON bookings.user_id = users.id


WHERE bookings.id='$booking_id'


LIMIT 1

";



$result = mysqli_query($conn,$query);



if(!$result){

    echo json_encode([
        "success"=>false,
        "message"=>mysqli_error($conn)
    ]);

    exit;

}



$data = mysqli_fetch_assoc($result);



if(!$data){

    echo json_encode([
        "success"=>false,
        "message"=>"Ticket not generated yet"
    ]);

    exit;

}



echo json_encode([

    "success"=>true,

    "ticket"=>$data

]);


?>