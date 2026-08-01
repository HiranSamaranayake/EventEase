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

$eventId = $_GET['event_id'] ?? 0;
$eventId = intval($eventId);

if ($eventId <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Valid event_id is required"
    ]);
    exit;
}

// Fetch event details
$eventQuery = "SELECT id, title, price, capacity FROM events WHERE id = $eventId LIMIT 1";
$eventRes = mysqli_query($conn, $eventQuery);

if (!$eventRes || mysqli_num_rows($eventRes) == 0) {
    echo json_encode([
        "success" => false,
        "message" => "Event not found"
    ]);
    exit;
}

$event = mysqli_fetch_assoc($eventRes);
$basePrice = floatval($event['price'] ?? 0);

// Auto-create event_booked_seats table if missing
$tableCheck = mysqli_query($conn, "SHOW TABLES LIKE 'event_booked_seats'");
if (!$tableCheck || mysqli_num_rows($tableCheck) == 0) {
    $createTable = "CREATE TABLE IF NOT EXISTS event_booked_seats (
        id INT(11) NOT NULL AUTO_INCREMENT,
        event_id INT(11) NOT NULL,
        booking_id INT(11) NULL,
        seat_code VARCHAR(50) NOT NULL,
        tier_name VARCHAR(50) NOT NULL,
        price DECIMAL(10,2) NOT NULL DEFAULT '0.00',
        user_id INT(11) NOT NULL,
        booked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY event_seat_unique (event_id, seat_code)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
    mysqli_query($conn, $createTable);
}

// Define Tiered Seat Pricing rules based on base price
$vipPrice = ($basePrice > 0) ? round($basePrice * 2.0, 2) : 5000.00;
$platinumPrice = ($basePrice > 0) ? round($basePrice * 1.5, 2) : 3500.00;
$goldPrice = ($basePrice > 0) ? round($basePrice * 1.2, 2) : 2500.00;
$standardPrice = ($basePrice > 0) ? $basePrice : 1500.00;

$tiers = [
    [
        "tier_key" => "VIP",
        "name" => "VIP Front Row",
        "price" => $vipPrice,
        "color" => "purple",
        "rows" => ["A", "B"]
    ],
    [
        "tier_key" => "PLATINUM",
        "name" => "Platinum Tier",
        "price" => $platinumPrice,
        "color" => "indigo",
        "rows" => ["C", "D"]
    ],
    [
        "tier_key" => "GOLD",
        "name" => "Gold Tier",
        "price" => $goldPrice,
        "color" => "amber",
        "rows" => ["E", "F"]
    ],
    [
        "tier_key" => "STANDARD",
        "name" => "Standard Tier",
        "price" => $standardPrice,
        "color" => "emerald",
        "rows" => ["G", "H"]
    ]
];

// Fetch booked seats for this event
$bookedQuery = "SELECT seat_code, tier_name, price FROM event_booked_seats WHERE event_id = $eventId";
$bookedRes = mysqli_query($conn, $bookedQuery);
$bookedSeats = [];

if ($bookedRes) {
    while ($bRow = mysqli_fetch_assoc($bookedRes)) {
        $bookedSeats[] = $bRow['seat_code'];
    }
}

echo json_encode([
    "success" => true,
    "event_id" => $eventId,
    "event_title" => $event['title'],
    "base_price" => $basePrice,
    "tiers" => $tiers,
    "booked_seats" => $bookedSeats
]);
