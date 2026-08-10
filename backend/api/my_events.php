<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once "../config/database.php";

$user_id = intval($_GET["user_id"] ?? $_POST["user_id"] ?? 0);

if (!$user_id) {
    echo json_encode([
        "success" => true,
        "events" => []
    ]);
    exit;
}

// Find exact Organizer record for the authenticated user_id
$orgQuery = mysqli_query($conn, "SELECT id FROM organizers WHERE user_id='$user_id'");
if (!$orgQuery || mysqli_num_rows($orgQuery) == 0) {
    // Check if user_id is directly the organizer table id
    $orgQuery2 = mysqli_query($conn, "SELECT id FROM organizers WHERE id='$user_id'");
    if (!$orgQuery2 || mysqli_num_rows($orgQuery2) == 0) {
        echo json_encode([
            "success" => true,
            "events" => []
        ]);
        exit;
    }
    $organizer = mysqli_fetch_assoc($orgQuery2);
} else {
    $organizer = mysqli_fetch_assoc($orgQuery);
}

$organizer_id = intval($organizer["id"]);

// Strictly select ONLY events matching this organizer_id
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
    WHERE (events.organizer_id = '$organizer_id' OR events.organizer_id = '$user_id')
    ORDER BY events.id DESC
    "
);

$events = [];

if ($query) {
    while ($row = mysqli_fetch_assoc($query)) {
        $capacity = (int)$row["capacity"];
        $sold = (int)$row["tickets_sold"];

        $row["occupancy"] = $capacity > 0
            ? round(($sold / $capacity) * 100)
            : 0;

        $events[] = $row;
    }
}

echo json_encode([
    "success" => true,
    "events" => $events
]);
?>