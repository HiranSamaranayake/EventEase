<?php

require_once "cors.php";

require_once "../config/database.php";


$data=json_decode(file_get_contents("php://input"),true);



$id=$data["id"];



$sql="

SELECT

bookings.*,

users.full_name,

users.email,

events.title,

events.location,

events.event_date


FROM bookings


LEFT JOIN users

ON bookings.user_id=users.id


LEFT JOIN events

ON bookings.event_id=events.id


WHERE bookings.id='$id'


";



$result=$conn->query($sql);



if($result && $result->num_rows>0){


echo json_encode([

"success"=>true,

"booking"=>$result->fetch_assoc()

]);


}

else{


echo json_encode([

"success"=>false,

"message"=>"Booking not found"

]);


}


?>