<?php

header("Access-Control-Allow-Origin: http://localhost:5177");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");


if ($_SERVER['REQUEST_METHOD'] == "OPTIONS") {
    exit;
}


require_once "../config/database.php";


$data = json_decode(file_get_contents("php://input"), true);


$id = $data["id"] ?? 0;


if (!$id) {

    echo json_encode([
        "success"=>false,
        "message"=>"Booking ID required"
    ]);

    exit;

}


// Delete tickets first
$ticketDelete = "
DELETE FROM tickets 
WHERE booking_id='$id'
";

mysqli_query($conn,$ticketDelete);


// Delete booking
$delete = "
DELETE FROM bookings
WHERE id='$id'
";


if(mysqli_query($conn,$delete)){


    echo json_encode([
        "success"=>true,
        "message"=>"Booking deleted"
    ]);


}else{


    echo json_encode([
        "success"=>false,
        "message"=>mysqli_error($conn)
    ]);


}

?>