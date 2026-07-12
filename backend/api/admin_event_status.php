<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");


require_once "../config/database.php";



$data = json_decode(
    file_get_contents("php://input"),
    true
);



if(
    !isset($data["id"]) ||
    !isset($data["status"])
){

    echo json_encode([

        "success"=>false,

        "message"=>"Invalid data"

    ]);

    exit;

}



$id = $data["id"];

$status = $data["status"];





$sql = "

UPDATE events

SET status = ?

WHERE id = ?

";




$stmt = $conn->prepare($sql);


$stmt->bind_param(

"si",

$status,

$id

);




if($stmt->execute()){


echo json_encode([

"success"=>true,

"message"=>"Event status updated"

]);


}

else{


echo json_encode([

"success"=>false,

"message"=>"Update failed"

]);


}



?>