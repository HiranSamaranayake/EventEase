<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once "../config/database.php";

$id = (int)($_GET['id'] ?? 0);

if ($id <= 0) {
    echo json_encode(["success" => false, "message" => "Invalid Event ID"]);
    exit;
}

$query = "
SELECT 
    events.*,
    organizers.organization_name
FROM events
LEFT JOIN users ON events.organizer_id = users.id
LEFT JOIN organizers ON users.id = organizers.user_id
WHERE events.id = $id
LIMIT 1
";

$result = mysqli_query($conn, $query);

if ($result && mysqli_num_rows($result) > 0) {
    $event = mysqli_fetch_assoc($result);

    // Calculate total booked tickets for this event
    $bookedQuery = "SELECT SUM(ticket_quantity) AS total FROM bookings WHERE event_id = $id AND booking_status != 'Cancelled'";
    $bookedRes = mysqli_query($conn, $bookedQuery);
    $bookedData = mysqli_fetch_assoc($bookedRes);
    $totalBooked = intval($bookedData['total'] ?? 0);

    $capacity = intval($event['capacity'] ?? 0);
    $availableSeats = ($capacity > 0) ? max(0, $capacity - $totalBooked) : 999;
    $isSoldOut = ($capacity > 0 && $totalBooked >= $capacity);

    $event['total_booked'] = $totalBooked;
    $event['available_seats'] = $availableSeats;
    $event['is_sold_out'] = $isSoldOut;

    echo json_encode([
        "success" => true,
        "event" => $event
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Event not found"
    ]);
}
