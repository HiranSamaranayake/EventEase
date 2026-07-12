<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

require_once "../config/database.php";


$sql="

SELECT

bookings.id,

users.full_name AS customer,

users.email,

events.title AS event,

events.event_date,

events.location,

bookings.booking_date


FROM bookings


LEFT JOIN users

ON bookings.user_id = users.id


LEFT JOIN events

ON bookings.event_id = events.id


ORDER BY bookings.id DESC


";



$result=$conn->query($sql);



$bookings=[];



if($result){


while($row=$result->fetch_assoc()){


$bookings[]=$row;


}


}



echo json_encode([

"success"=>true,

"bookings"=>$bookings

]);


?>