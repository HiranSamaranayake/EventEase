<?php

header("Access-Control-Allow-Origin:*");
header("Content-Type:application/json");

require_once "../config/database.php";


$user_id = $_GET["user_id"] ?? 0;


if(!$user_id){

    echo json_encode([
        "success"=>false,
        "message"=>"User id required"
    ]);

    exit;

}



$query = "

SELECT

bookings.id,
bookings.ticket_quantity,
bookings.total_amount,
bookings.payment_status,
bookings.booking_status,
bookings.booking_date,

events.title,
events.event_date,
events.location,
events.image


FROM bookings

INNER JOIN events

ON bookings.event_id = events.id


WHERE bookings.user_id='$user_id'
AND bookings.payment_status='Paid'
AND bookings.booking_status='Confirmed'

ORDER BY bookings.id DESC

";



$result=mysqli_query($conn,$query);



$bookings=[];


while($row=mysqli_fetch_assoc($result)){

    $bookings[]=$row;

}



echo json_encode([

    "success"=>true,

    "bookings"=>$bookings

]);


?>