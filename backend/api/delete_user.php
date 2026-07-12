<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require_once "../config/database.php";


$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"] ?? 0;


if (!$id) {

    echo json_encode([
        "success" => false,
        "message" => "User ID is required"
    ]);

    exit;
}


/*
Delete tickets connected to user's bookings
*/

$deleteTickets = "

DELETE FROM tickets

WHERE booking_id IN

(
    SELECT id 
    FROM bookings
    WHERE user_id='$id'
)

";


mysqli_query($conn, $deleteTickets);



/*
Delete bookings
*/

$deleteBookings = "

DELETE FROM bookings

WHERE user_id='$id'

";


mysqli_query($conn, $deleteBookings);



/*
Delete organizer profile if exists
*/

$deleteOrganizer = "

DELETE FROM organizers

WHERE user_id='$id'

";


mysqli_query($conn, $deleteOrganizer);



/*
Delete user
*/

$deleteUser = "

DELETE FROM users

WHERE id='$id'

";


if(mysqli_query($conn, $deleteUser)){


    echo json_encode([

        "success"=>true,

        "message"=>"User deleted successfully"

    ]);


}else{


    echo json_encode([

        "success"=>false,

        "message"=>mysqli_error($conn)

    ]);

}


?>