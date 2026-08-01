<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../config/database.php";


$id = $_GET["id"] ?? 0;


if(!$id){

echo json_encode([

"success"=>false,

"message"=>"Booking ID required"

]);

exit;

}



$sql="

SELECT

id,
booking_status,
payment_status,
booking_date

FROM bookings

WHERE id='$id'

LIMIT 1

";


$result=mysqli_query($conn,$sql);



if(mysqli_num_rows($result)==0){


echo json_encode([

"success"=>false,

"message"=>"Booking not found"

]);


exit;

}



$data=mysqli_fetch_assoc($result);



echo json_encode([

"success"=>true,

"booking_id"=>$data["id"],

"booking_status"=>$data["booking_status"],

"payment_status"=>$data["payment_status"],

"booking_date"=>$data["booking_date"]


]);


?>