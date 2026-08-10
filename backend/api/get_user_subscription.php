<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../utils/user_subscription_helper.php";

$userId = intval($_GET['user_id'] ?? $_GET['id'] ?? 0);

if ($userId <= 0) {
    echo json_encode(["success" => false, "message" => "Valid user_id is required"]);
    exit;
}

$details = getUserSubscriptionDetails($conn, $userId);

echo json_encode([
    "success" => true,
    "user_id" => $userId,
    "user_tier" => ($details && $details['is_active']) ? 'premium' : 'verified',
    "subscription" => $details
]);
?>
