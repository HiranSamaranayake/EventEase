<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require_once "../config/database.php";


$data = json_decode(
    file_get_contents("php://input"),
    true
);


$id = $data["id"] ?? 0;


if(!$id){

    echo json_encode([
        "success"=>false,
        "message"=>"Booking ID missing"
    ]);

    exit;

}


/*
=========================
DELETE PAYMENTS FIRST
=========================
*/

$paymentQuery = "

DELETE FROM payments

WHERE booking_id='$id'

";


mysqli_query($conn,$paymentQuery);



/*
=========================
DELETE TICKETS
=========================
*/

$ticketQuery = "

DELETE FROM tickets

WHERE booking_id='$id'

";


mysqli_query($conn,$ticketQuery);



/*
=========================
DELETE BOOKING
=========================
*/

$bookingQuery = "

DELETE FROM bookings

WHERE id='$id'

";


$result = mysqli_query(
    $conn,
    $bookingQuery
);



if($result){

    echo json_encode([

        "success"=>true,

        "message"=>"Booking deleted successfully"

    ]);

}
else{

    echo json_encode([

        "success"=>false,

        "message"=>mysqli_error($conn)

    ]);

}


?>