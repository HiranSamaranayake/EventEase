<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once "../config/database.php";

$input = json_decode(file_get_contents("php://input"), true);
$ticketCode = $_GET["ticket_code"] ?? $_POST["ticket_code"] ?? $input["ticket_code"] ?? "";

$ticketCode = trim($ticketCode);

if (empty($ticketCode)) {
    echo json_encode([
        "success" => false,
        "message" => "Ticket code is required"
    ]);
    exit;
}

$escapedCode = mysqli_real_escape_string($conn, $ticketCode);

$query = "
SELECT
    tickets.id,
    tickets.ticket_code,
    tickets.status,
    events.title AS event_title,
    events.event_date,
    events.location AS event_location,
    users.full_name AS customer_name,
    users.email AS customer_email,
    bookings.booking_date,
    bookings.ticket_quantity
FROM tickets
INNER JOIN bookings ON tickets.booking_id = bookings.id
INNER JOIN events ON bookings.event_id = events.id
INNER JOIN users ON bookings.user_id = users.id
WHERE tickets.ticket_code = '$escapedCode'
";

$result = mysqli_query($conn, $query);

if (!$result || mysqli_num_rows($result) == 0) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid Ticket Code"
    ]);
    exit;
}

$ticket = mysqli_fetch_assoc($result);

if ($ticket["status"] == "used") {
    echo json_encode([
        "success" => false,
        "message" => "Ticket Already Used",
        "ticket" => $ticket
    ]);
    exit;
}

// Update ticket status to used
$updateQuery = "
UPDATE tickets
SET status = 'used'
WHERE id = '{$ticket["id"]}'
";

mysqli_query($conn, $updateQuery);

$ticket["status"] = "used";

echo json_encode([
    "success" => true,
    "message" => "Valid Ticket - Entry Approved!",
    "ticket" => $ticket
]);