<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../config/database.php";

$user_id = $_GET["user_id"] ?? 0;

if (!$user_id) {

    echo json_encode([
        "success" => false,
        "message" => "User ID Required"
    ]);

    exit();
}
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
$query = "

SELECT

    b.id,

    b.booking_date,

    b.ticket_quantity,

    b.total_amount,
    b.booking_status,

    p.payment_status,

    e.title AS event_title,

    u.full_name,

    u.email,

    u.phone

FROM bookings b

INNER JOIN events e
ON b.event_id = e.id

INNER JOIN users u
ON b.user_id = u.id

LEFT JOIN payments p
ON p.booking_id = b.id

WHERE e.organizer_id = '$organizer_id'

ORDER BY b.booking_date DESC

";
$result = mysqli_query($conn, $query);

if (!$result) {
    die(mysqli_error($conn));
}

$bookings = [];

while ($row = mysqli_fetch_assoc($result)) {

    $bookings[] = $row;

}

echo json_encode([

    "success" => true,

    "bookings" => $bookings

]);

?>
