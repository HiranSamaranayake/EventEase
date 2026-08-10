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

$userId = intval($data["user_id"] ?? $_POST["user_id"] ?? $_GET["user_id"] ?? 0);
$amount = 1500.00;

if ($userId <= 0) {
    echo json_encode(["success" => false, "message" => "Valid user_id is required."]);
    exit();
}

$userRes = mysqli_query($conn, "SELECT full_name, email, phone FROM users WHERE id = '$userId' LIMIT 1");
if (!$userRes || mysqli_num_rows($userRes) == 0) {
    echo json_encode(["success" => false, "message" => "User profile not found."]);
    exit();
}
$user = mysqli_fetch_assoc($userRes);

// Generate unique subscription ID
$subscriptionId = "SUB-PREM-" . $userId . "-" . time();

// Insert pending subscription row
$insertSql = "INSERT INTO premium_subscriptions 
              (user_id, subscription_id, amount, subscription_start_date, subscription_expiry_date, status, payment_status)
              VALUES 
              ('$userId', '$subscriptionId', '$amount', NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH), 'pending', 'Pending')";

if (!mysqli_query($conn, $insertSql)) {
    echo json_encode(["success" => false, "message" => "Failed to initiate subscription: " . mysqli_error($conn)]);
    exit();
}

$config = require __DIR__ . "/../config/payhere.php";

$merchantId = $config["merchant_id"] ?? "1236845";
$merchantSecret = $config["merchant_secret"] ?? "MTE5MzAwMTQ3MDMxODg0NTAyMzg3NTUwOTE1NTQxNzEzNTE3NTg4";
$currency = "LKR";

$formattedAmount = number_format($amount, 2, '.', '');
$hash = strtoupper(
    md5(
        $merchantId . 
        $subscriptionId . 
        $formattedAmount . 
        $currency . 
        strtoupper(md5($merchantSecret))
    )
);

$fullNameParts = explode(" ", trim($user['full_name'] ?? 'Valued Customer'), 2);
$firstName = !empty($fullNameParts[0]) ? $fullNameParts[0] : "Valued";
$lastName = !empty($fullNameParts[1]) ? $fullNameParts[1] : "Customer";
$userEmail = !empty($user['email']) ? $user['email'] : "customer@example.com";
$userPhone = !empty($user['phone']) ? $user['phone'] : "0771234567";

echo json_encode([
    "success" => true,
    "subscription_id" => $subscriptionId,
    "payhere_data" => [
        "sandbox" => true,
        "merchant_id" => $merchantId,
        "return_url" => "http://localhost:5173/profile?sub_success=true&sub_id=" . $subscriptionId,
        "cancel_url" => "http://localhost:5173/profile?sub_cancel=true",
        "notify_url" => "http://localhost/EventEase/backend/api/payhere_subscription_notify.php",
        "order_id" => $subscriptionId,
        "items" => "EventEase Premium 1-Month Membership Subscription",
        "currency" => $currency,
        "amount" => $formattedAmount,
        "first_name" => $firstName,
        "last_name" => $lastName,
        "email" => $userEmail,
        "phone" => $userPhone,
        "address" => "Colombo",
        "city" => "Colombo",
        "country" => "Sri Lanka",
        "hash" => $hash
    ]
]);
?>
