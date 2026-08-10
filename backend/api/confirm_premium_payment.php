<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../utils/user_subscription_helper.php";

$raw = file_get_contents("php://input");
$data = json_decode($raw, true) ?? [];

$subscription_id = trim($data["subscription_id"] ?? $_POST["subscription_id"] ?? $_GET["subscription_id"] ?? "");
$user_id = intval($data["user_id"] ?? $_POST["user_id"] ?? $_GET["user_id"] ?? 0);

if (empty($subscription_id) && $user_id <= 0) {
    echo json_encode(["success" => false, "message" => "Subscription ID or User ID is required."]);
    exit();
}

if (empty($subscription_id) && $user_id > 0) {
    $sRes = mysqli_query($conn, "SELECT subscription_id FROM premium_subscriptions WHERE user_id = '$user_id' ORDER BY id DESC LIMIT 1");
    if ($sRes && $sRow = mysqli_fetch_assoc($sRes)) {
        $subscription_id = $sRow['subscription_id'];
    } else {
        $subscription_id = "SUB-PREM-" . $user_id . "-" . time();
        mysqli_query($conn, "INSERT INTO premium_subscriptions (user_id, subscription_id, amount, subscription_start_date, subscription_expiry_date, status, payment_status) VALUES ('$user_id', '$subscription_id', 1500.00, NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH), 'active', 'Paid')");
    }
}

if (!empty($subscription_id)) {
    $subEscaped = mysqli_real_escape_string($conn, $subscription_id);
    $payId = "PAY-SUB-" . rand(10000, 99999);
    
    mysqli_query($conn, "UPDATE premium_subscriptions 
                         SET status = 'active',
                             payment_status = 'Paid',
                             payment_id = '$payId',
                             subscription_start_date = NOW(),
                             subscription_expiry_date = DATE_ADD(NOW(), INTERVAL 1 MONTH)
                         WHERE subscription_id = '$subEscaped'");

    $getU = mysqli_query($conn, "SELECT user_id FROM premium_subscriptions WHERE subscription_id = '$subEscaped' LIMIT 1");
    if ($getU && $r = mysqli_fetch_assoc($getU)) {
        $user_id = intval($r['user_id']);
        mysqli_query($conn, "UPDATE users SET user_tier = 'premium' WHERE id = '$user_id'");
    }
}

$details = getUserSubscriptionDetails($conn, $user_id);

echo json_encode([
    "success" => true,
    "message" => "Premium VIP Monthly Subscription is active!",
    "subscription" => $details
]);
?>
