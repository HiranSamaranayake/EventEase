<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once __DIR__ . "/../config/database.php";

$id = (int)($_GET['id'] ?? 0);

if ($id <= 0) {
    echo json_encode(["success" => false, "message" => "Invalid Event ID"]);
    exit;
}

$stmt = $conn->prepare("SELECT e.*, COALESCE(o.organization_name, u.full_name, 'Verified Organizer') AS organization_name FROM events e LEFT JOIN users u ON e.organizer_id = u.id LEFT JOIN organizers o ON u.id = o.user_id WHERE e.id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$res = $stmt->get_result();

if ($res && $res->num_rows > 0) {
    $event = $res->fetch_assoc();

    // Calculate total booked tickets for this event
    $bookedStmt = $conn->prepare("SELECT COALESCE(SUM(ticket_quantity), 0) AS total FROM bookings WHERE event_id = ? AND booking_status != 'Cancelled'");
    $bookedStmt->bind_param("i", $id);
    $bookedStmt->execute();
    $bookedRes = $bookedStmt->get_result()->fetch_assoc();
    $totalBooked = intval($bookedRes['total'] ?? 0);
    $bookedStmt->close();

    $capacity = intval($event['capacity'] ?? 0);
    $availableSeats = ($capacity > 0) ? max(0, $capacity - $totalBooked) : 500;
    $isSoldOut = ($capacity > 0 && $totalBooked >= $capacity);

    $event['total_booked'] = $totalBooked;
    $event['available_seats'] = $availableSeats;
    $event['is_sold_out'] = $isSoldOut;

    echo json_encode([
        "success" => true,
        "event" => $event
    ]);
} else {
    // Fallback if ID doesn't exist
    $fallbackRes = $conn->query("SELECT e.*, COALESCE(o.organization_name, u.full_name, 'Verified Organizer') AS organization_name FROM events e LEFT JOIN users u ON e.organizer_id = u.id LEFT JOIN organizers o ON u.id = o.user_id ORDER BY e.id DESC LIMIT 1");
    if ($fallbackRes && $fallbackRes->num_rows > 0) {
        $event = $fallbackRes->fetch_assoc();
        $event['available_seats'] = 500;
        $event['is_sold_out'] = false;
        echo json_encode(["success" => true, "event" => $event]);
    } else {
        echo json_encode(["success" => false, "message" => "Event not found"]);
    }
}
$stmt->close();
$conn->close();
?>
