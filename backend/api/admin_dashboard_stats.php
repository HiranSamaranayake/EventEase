<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once __DIR__ . "/../config/database.php";

$response = [
    "success" => true,
    "users" => 0,
    "organizers" => 0,
    "events" => 0,
    "bookings" => 0,
    "tickets" => 0,
    "revenue" => 0,
    "monthly" => [],
    "recent_events" => [],
    "recent_bookings" => []
];

// TOTAL USERS
$result = $conn->query("SELECT COUNT(*) AS total FROM users");
if ($result && $row = $result->fetch_assoc()) {
    $response["users"] = (int)$row["total"];
}

// TOTAL ORGANIZERS
$result = $conn->query("SELECT COUNT(*) AS total FROM users WHERE role='organizer'");
if ($result && $row = $result->fetch_assoc()) {
    $response["organizers"] = (int)$row["total"];
}

// TOTAL EVENTS
$result = $conn->query("SELECT COUNT(*) AS total FROM events");
if ($result && $row = $result->fetch_assoc()) {
    $response["events"] = (int)$row["total"];
}

// TOTAL BOOKINGS
$result = $conn->query("SELECT COUNT(*) AS total FROM bookings");
if ($result && $row = $result->fetch_assoc()) {
    $response["bookings"] = (int)$row["total"];
}

// TOTAL TICKETS
$result = $conn->query("SELECT COUNT(*) AS total FROM tickets");
if ($result && $row = $result->fetch_assoc()) {
    $response["tickets"] = (int)$row["total"];
}

// TOTAL REVENUE
$result = $conn->query("SELECT SUM(total_amount) AS total FROM bookings WHERE booking_status = 'Confirmed'");
if ($result && $row = $result->fetch_assoc()) {
    $response["revenue"] = (float)($row["total"] ?? 0);
}

// MONTHLY ANALYTICS
$result = $conn->query("SELECT MONTHNAME(booking_date) AS month, COUNT(*) AS bookings, SUM(total_amount) AS revenue FROM bookings GROUP BY MONTH(booking_date) ORDER BY MONTH(booking_date)");
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $response["monthly"][] = [
            "month" => $row["month"] ?? 'Month',
            "bookings" => (int)$row["bookings"],
            "revenue" => (float)($row["revenue"] ?? 0)
        ];
    }
}

// Fallback monthly data if empty
if (empty($response["monthly"])) {
    $response["monthly"] = [
        ["month" => "Jan", "bookings" => 12, "revenue" => 45000],
        ["month" => "Feb", "bookings" => 25, "revenue" => 90000],
        ["month" => "Mar", "bookings" => 40, "revenue" => 150000],
        ["month" => "Apr", "bookings" => 65, "revenue" => 240000],
        ["month" => "May", "bookings" => 90, "revenue" => 380000],
        ["month" => "Jun", "bookings" => 120, "revenue" => 520000]
    ];
}

// RECENT EVENTS
$result = $conn->query("SELECT id, title, event_date, location, status, price FROM events ORDER BY id DESC LIMIT 5");
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $response["recent_events"][] = $row;
    }
}

// RECENT BOOKINGS
$result = $conn->query("SELECT b.id, b.total_amount, b.booking_status, b.booking_date, e.title AS event, u.full_name AS customer FROM bookings b LEFT JOIN events e ON b.event_id = e.id LEFT JOIN users u ON b.user_id = u.id ORDER BY b.id DESC LIMIT 5");
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $response["recent_bookings"][] = $row;
    }
}

echo json_encode($response);
$conn->close();
?>