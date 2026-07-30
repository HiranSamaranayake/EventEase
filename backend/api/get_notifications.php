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

$user_id = $_GET['user_id'] ?? 0;
$user_id = intval($user_id);

if ($user_id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Valid user_id is required"
    ]);
    exit;
}

// Auto-create notifications table if missing
$tableCheck = mysqli_query($conn, "SHOW TABLES LIKE 'notifications'");
if (!$tableCheck || mysqli_num_rows($tableCheck) == 0) {
    $createTable = "CREATE TABLE IF NOT EXISTS notifications (
        id INT(11) NOT NULL AUTO_INCREMENT,
        user_id INT(11) NOT NULL,
        type VARCHAR(50) NOT NULL DEFAULT 'info',
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        link VARCHAR(255) NULL,
        is_read TINYINT(1) NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY user_id_idx (user_id),
        KEY is_read_idx (is_read)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
    mysqli_query($conn, $createTable);
}

// Check existing notifications count
$countCheck = mysqli_query($conn, "SELECT COUNT(*) FROM notifications WHERE user_id = $user_id");
$totalCount = mysqli_fetch_row($countCheck)[0] ?? 0;

// Seed initial notifications if none exist
if ($totalCount == 0) {
    $sampleNotes = [
        [
            "type" => "booking",
            "title" => "🎟️ Ticket Booking Confirmed!",
            "message" => "Your ticket reservation for 'Summer Music Festival 2026' has been confirmed. Seat: VIP-A1.",
            "link" => "/my-bookings"
        ],
        [
            "type" => "waiting_list",
            "title" => "🎉 Waiting List Priority Alert!",
            "message" => "A ticket slot opened up for 'Tech Innovators Summit'. Click to claim your priority ticket.",
            "link" => "/waiting-list"
        ],
        [
            "type" => "verification",
            "title" => "🛡️ Organizer Account Status Update",
            "message" => "Your organizer business registration document has been reviewed and verified.",
            "link" => "/organizer/verify"
        ]
    ];

    foreach ($sampleNotes as $n) {
        $t = mysqli_real_escape_string($conn, $n['type']);
        $title = mysqli_real_escape_string($conn, $n['title']);
        $msg = mysqli_real_escape_string($conn, $n['message']);
        $lnk = mysqli_real_escape_string($conn, $n['link']);
        mysqli_query($conn, "INSERT INTO notifications (user_id, type, title, message, link, is_read) VALUES ($user_id, '$t', '$title', '$msg', '$lnk', 0)");
    }
}

// Fetch notifications
$query = "SELECT id, type, title, message, link, is_read, created_at FROM notifications WHERE user_id = $user_id ORDER BY id DESC LIMIT 20";
$result = mysqli_query($conn, $query);
$notifications = [];
$unread_count = 0;

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        if (intval($row['is_read']) === 0) {
            $unread_count++;
        }
        $notifications[] = $row;
    }
}

echo json_encode([
    "success" => true,
    "user_id" => $user_id,
    "unread_count" => $unread_count,
    "total" => count($notifications),
    "notifications" => $notifications
]);
