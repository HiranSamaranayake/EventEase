<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);


header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}


// DATABASE CONNECTION
require_once __DIR__ . "/../config/database.php";



$response = [

    "success" => true,

    "users" => 0,

    "organizers" => 0,

    "events" => 0,

    "bookings" => 0,

    "tickets" => 0,

    "revenue" => 0,

    "monthly" => [],

    "recent_events" => [],

    "recent_bookings" => []

];





// TOTAL USERS

$result = $conn->query(
    "SELECT COUNT(*) AS total FROM users"
);

if($result){

    $row = $result->fetch_assoc();

    $response["users"] = $row["total"];

}





// TOTAL ORGANIZERS

$result = $conn->query(
    "SELECT COUNT(*) AS total FROM users WHERE role='organizer'"
);


if($result){

    $row = $result->fetch_assoc();

    $response["organizers"] = $row["total"];

}





// TOTAL EVENTS

$result = $conn->query(
    "SELECT COUNT(*) AS total FROM events"
);


if($result){

    $row = $result->fetch_assoc();

    $response["events"] = $row["total"];

}





// TOTAL BOOKINGS

$result = $conn->query(
    "SELECT COUNT(*) AS total FROM bookings"
);


if($result){

    $row = $result->fetch_assoc();

    $response["bookings"] = $row["total"];

}






// TOTAL REVENUE

$result = $conn->query(
    "SELECT SUM(amount) AS total FROM bookings"
);


if($result){

    $row = $result->fetch_assoc();

    $response["revenue"] = $row["total"] ?? 0;

}






// MONTHLY ANALYTICS

$result = $conn->query(

"
SELECT

MONTHNAME(created_at) AS month,

COUNT(*) AS bookings,

SUM(amount) AS revenue


FROM bookings


GROUP BY MONTH(created_at)


ORDER BY MONTH(created_at)

"

);



if($result){


while($row=$result->fetch_assoc()){


$response["monthly"][] = [

"month"=>$row["month"],

"bookings"=>(int)$row["bookings"],

"revenue"=>(int)$row["revenue"]

];


}


}







// RECENT EVENTS


$result = $conn->query(

"
SELECT

id,

title,

event_date,

location


FROM events


ORDER BY id DESC


LIMIT 5

"

);



if($result){


while($row=$result->fetch_assoc()){


$response["recent_events"][]=$row;


}


}








// RECENT BOOKINGS


$result = $conn->query(

"
SELECT

bookings.id,

events.title AS event,

users.full_name AS customer


FROM bookings


LEFT JOIN events

ON bookings.event_id = events.id


LEFT JOIN users

ON bookings.user_id = users.id


ORDER BY bookings.id DESC


LIMIT 5

"

);



if($result){


while($row=$result->fetch_assoc()){


$response["recent_bookings"][]=$row;


}


}






echo json_encode($response);


?>