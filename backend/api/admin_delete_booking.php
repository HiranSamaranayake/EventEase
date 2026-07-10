<?php

require_once "cors.php";

require_once "../config/database.php";



$data=json_decode(file_get_contents("php://input"),true);


$id=$data["id"];



$stmt=$conn->prepare(

"DELETE FROM bookings WHERE id=?"

);



$stmt->bind_param(

"i",

$id

);



if($stmt->execute()){


echo json_encode([

"success"=>true,

"message"=>"Booking deleted"

]);


}

else{


echo json_encode([

"success"=>false,

"message"=>"Delete failed"

]);


}


?>