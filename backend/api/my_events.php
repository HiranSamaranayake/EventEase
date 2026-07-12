<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../config/database.php";

$user_id = $_GET["user_id"] ?? 0;

if (!$user_id) {

    echo json_encode([
        "success" => false,
        "message" => "User ID missing"
    ]);

    exit;
}

/*
-----------------------------------------
Find Organizer ID
-----------------------------------------
*/

$orgQuery = mysqli_query(
    $conn,
    "SELECT id FROM organizers WHERE user_id='$user_id'"
);

if (mysqli_num_rows($orgQuery) == 0) {

    echo json_encode([
        "success" => false,
        "message" => "Organizer not found"
    ]);

    exit;
}

$organizer = mysqli_fetch_assoc($orgQuery);

$organizer_id = $organizer["id"];

/*
-----------------------------------------
Load Organizer Events
-----------------------------------------
*/

$query = mysqli_query(
    $conn,
    "
    SELECT
        events.*,

        COALESCE(
            (
                SELECT SUM(ticket_quantity)
                FROM bookings
                WHERE bookings.event_id = events.id
            ),
            0
        ) AS tickets_sold,

        COALESCE(
            (
                SELECT SUM(total_amount)
                FROM bookings
                WHERE bookings.event_id = events.id
                AND payment_status='Paid'
            ),
            0
        ) AS revenue

    FROM events

    WHERE organizer_id='$organizer_id'

    ORDER BY id DESC
    "
);

$events = [];

while ($row = mysqli_fetch_assoc($query)) {

    $capacity = (int)$row["capacity"];
    $sold = (int)$row["tickets_sold"];

    $row["occupancy"] = $capacity > 0
        ? round(($sold / $capacity) * 100)
        : 0;

    $row["status"] =
        strtotime($row["event_date"]) >= time()
        ? "Upcoming"
        : "Completed";

    $events[] = $row;
}

echo json_encode([
    "success" => true,
    "events" => $events
]);

?>