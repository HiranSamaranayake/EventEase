<?php

header("Access-Control-Allow-Origin:*");
header("Content-Type:application/json");

require_once "../config/database.php";


$id = $_GET["id"] ?? 0;


if(!$id){

    echo json_encode([
        "success"=>false,
        "message"=>"Booking id missing"
    ]);

    exit;

}



$sql = "

UPDATE bookings

SET

payment_status='Paid',
booking_status='Confirmed'

WHERE id='$id'

";



$result = mysqli_query($conn,$sql);



if($result){


    echo json_encode([

        "success"=>true,

        "message"=>"Booking updated"

    ]);


}
else{


    echo json_encode([

        "success"=>false,

        "message"=>mysqli_error($conn)

    ]);


}


?>