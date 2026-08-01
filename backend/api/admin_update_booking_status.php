<?php

require_once "cors.php";

require_once "../config/database.php";


$data=json_decode(file_get_contents("php://input"),true);



$id=$data["id"];

$status=$data["status"];



$stmt=$conn->prepare(

"UPDATE bookings 
SET booking_status=? 
WHERE id=?"

);



$stmt->bind_param(

"si",

$status,

$id

);



if($stmt->execute()){



echo json_encode([

"success"=>true,

"message"=>"Status updated"

]);



}

else{


echo json_encode([

"success"=>false,

"message"=>"Update failed"

]);


}


?>