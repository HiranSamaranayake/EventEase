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

// Ensure user_tier column exists
$colCheck = mysqli_query($conn, "SHOW COLUMNS FROM users LIKE 'user_tier'");
if (!$colCheck || mysqli_num_rows($colCheck) == 0) {
    mysqli_query($conn, "ALTER TABLE users ADD COLUMN user_tier VARCHAR(20) DEFAULT 'verified'");
}

$raw = file_get_contents("php://input");
$data = json_decode($raw, true) ?? [];

$userId = intval($data["user_id"] ?? $_POST["user_id"] ?? 0);
$tier = trim($data["user_tier"] ?? $_POST["user_tier"] ?? "premium");

if (!$userId) {
    echo json_encode([
        "success" => false,
        "message" => "User ID is required"
    ]);
    exit;
}

$validTiers = ['verified', 'premium'];
if (!in_array($tier, $validTiers)) {
    $tier = 'premium';
}

$query = "UPDATE users SET user_tier = '$tier' WHERE id = '$userId'";
$result = mysqli_query($conn, $query);

if ($result) {
    if ($tier === 'verified') {
        @mysqli_query($conn, "UPDATE premium_subscriptions SET status = 'cancelled' WHERE user_id = '$userId'");
    }
    echo json_encode([
        "success" => true,
        "message" => "User membership successfully upgraded to " . ucfirst($tier) . " Customer!",
        "user_tier" => $tier
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => mysqli_error($conn)
    ]);
}
