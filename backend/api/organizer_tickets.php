<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../config/database.php";

$user_id = $_GET["organizer_id"] ?? 0;



if (!$user_id) {

    echo json_encode([
        "success" => false,
        "message" => "Organizer ID Required"
    ]);

    exit();
}

/*
-----------------------------------------
Find Organizer ID
-----------------------------------------
*/

$organizerQuery = mysqli_query(
    $conn,
    "SELECT id FROM organizers WHERE user_id='$user_id'"
);

if (mysqli_num_rows($organizerQuery) == 0) {

    echo json_encode([
        "success" => false,
        "message" => "Organizer not found"
    ]);

    exit();
}

$organizer = mysqli_fetch_assoc($organizerQuery);

$organizer_id = $organizer["id"];

/*
-----------------------------------------
Get Tickets
-----------------------------------------
*/

$query = "

SELECT

t.id,
t.ticket_code,
t.qr_code,
t.status,

b.ticket_quantity,
b.booking_date,

u.full_name,
u.email,

e.title AS event_title,
e.event_date

FROM tickets t

INNER JOIN bookings b
ON t.booking_id = b.id

INNER JOIN users u
ON b.user_id = u.id

INNER JOIN events e
ON b.event_id = e.id

WHERE e.organizer_id = '$organizer_id'

ORDER BY b.booking_date DESC

";

$result = mysqli_query($conn, $query);

$tickets = [];

while ($row = mysqli_fetch_assoc($result)) {

    $tickets[] = $row;

}

echo json_encode([
    "success" => true,
    "tickets" => $tickets
]);

?>