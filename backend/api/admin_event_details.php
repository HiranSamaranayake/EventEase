<?php


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");


include "../config/db.php";



$data=json_decode(
file_get_contents("php://input"),
true
);



if(!isset($data["id"])){


echo json_encode([

"success"=>false,

"message"=>"Event ID required"

]);


exit;

}




$id=$data["id"];





$sql="

SELECT

events.*,

users.full_name AS organizer_name,

users.email AS organizer_email


FROM events


LEFT JOIN users

ON events.organizer_id = users.id


WHERE events.id = ?

";





$stmt=$conn->prepare($sql);


$stmt->bind_param(
"i",
$id
);



$stmt->execute();



$result=$stmt->get_result();



if($row=$result->fetch_assoc()){



echo json_encode([

"success"=>true,

"event"=>$row

]);



}

else{


echo json_encode([

"success"=>false,

"message"=>"Event not found"

]);


}



?>