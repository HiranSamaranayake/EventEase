<?php

require_once "cors.php";

require_once "../config/database.php";


$response = [

    "total"=>0,
    "revenue"=>0,
    "pending"=>0,
    "confirmed"=>0,
    "cancelled"=>0

];




// TOTAL BOOKINGS

$q = $conn->query(
"SELECT COUNT(*) AS total FROM bookings"
);


if($q){

    $response["total"] =
    $q->fetch_assoc()["total"];

}





// REVENUE

$q = $conn->query(
"SELECT SUM(amount) AS total FROM bookings"
);


if($q){

    $response["revenue"] =
    $q->fetch_assoc()["total"] ?? 0;

}






// PENDING

$q = $conn->query(
"SELECT COUNT(*) AS total 
FROM bookings 
WHERE booking_status='pending'"
);


if($q){

    $response["pending"] =
    $q->fetch_assoc()["total"];

}







// CONFIRMED

$q = $conn->query(
"SELECT COUNT(*) AS total 
FROM bookings 
WHERE booking_status='confirmed'"
);


if($q){

    $response["confirmed"] =
    $q->fetch_assoc()["total"];

}







// CANCELLED

$q = $conn->query(
"SELECT COUNT(*) AS total 
FROM bookings 
WHERE booking_status='cancelled'"
);


if($q){

    $response["cancelled"] =
    $q->fetch_assoc()["total"];

}





echo json_encode([

"success"=>true,

"stats"=>$response

]);


?>