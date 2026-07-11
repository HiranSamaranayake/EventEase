<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../config/database.php";

$user_id = $_GET["organizer_id"] ?? 0;

if(!$user_id){

    echo json_encode([
        "success"=>false,
        "message"=>"User ID Required"
    ]);

    exit();

}

/*
-------------------------------------
Find Organizer ID
-------------------------------------
*/

$organizerQuery = mysqli_query(
    $conn,
    "SELECT id FROM organizers WHERE user_id='$user_id'"
);

if(mysqli_num_rows($organizerQuery)==0){

    echo json_encode([
        "success"=>false,
        "message"=>"Organizer not found"
    ]);

    exit();

}

$organizer = mysqli_fetch_assoc($organizerQuery);

$organizer_id = $organizer["id"];

/*
-------------------------------------
Get Events
-------------------------------------
*/

$query = "

SELECT

e.*,

COUNT(b.id) AS bookings,

COALESCE(
SUM(b.total_amount),
0
) AS revenue

FROM events e

LEFT JOIN bookings b

ON e.id=b.event_id

WHERE e.organizer_id='$organizer_id'

GROUP BY e.id

ORDER BY e.event_date ASC

";

$result = mysqli_query($conn,$query);

$events=[];

while($row=mysqli_fetch_assoc($result)){

    $capacity=(int)$row["capacity"];

    $sold=(int)$row["bookings"];

    $occupancy=0;

    if($capacity>0){

        $occupancy=round(
            ($sold/$capacity)*100
        );

    }

    if(strtotime($row["event_date"])>time()){

        $status="Upcoming";

    }

    else{

        $status="Completed";

    }

    $row["tickets_sold"]=$sold;

    $row["occupancy"]=$occupancy;

    $row["status"]=$status;

    $events[]=$row;

}

echo json_encode([

    "success"=>true,

    "events"=>$events

]);

?>