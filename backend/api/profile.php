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
require_once __DIR__ . "/../utils/user_subscription_helper.php";

$userId = intval($_GET["user_id"] ?? $_POST["user_id"] ?? 0);
if (!$userId) {
    echo json_encode([
        "success" => false,
        "message" => "User ID is required"
    ]);
    exit;
}

// Sync subscription status & user_tier
$isPremium = isUserPremiumActive($conn, $userId);
$subDetails = getUserSubscriptionDetails($conn, $userId);

$query = "
SELECT
    id,
    full_name,
    email,
    phone,
    role,
    user_tier,
    created_at
FROM users
WHERE id = '$userId'
LIMIT 1
";

$result = mysqli_query($conn, $query);

if ($result && mysqli_num_rows($result) > 0) {
    $user = mysqli_fetch_assoc($result);
    echo json_encode([
        "success" => true,
        "user" => $user,
        "subscription" => $subDetails
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "User not found"
    ]);
}
?>
