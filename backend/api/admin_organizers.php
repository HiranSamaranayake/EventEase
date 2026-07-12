<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json");


if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}


require_once "../config/database.php";

$sql = "

SELECT

id,
full_name,
email,
phone,
created_at

FROM users

WHERE role='organizer'

ORDER BY id DESC

";


$result = $conn->query($sql);


$organizers=[];


if($result){

while($row=$result->fetch_assoc()){

$organizers[]=$row;

}

}



echo json_encode([

"success"=>true,

"organizers"=>$organizers

]);


?>