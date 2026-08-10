<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: text/plain");

require_once __DIR__ . "/../config/database.php";

$subscription_id = $_POST["order_id"] ?? $_GET["order_id"] ?? "";
$status_code = $_POST["status_code"] ?? $_GET["status_code"] ?? "";
$payment_id = $_POST["payment_id"] ?? $_GET["payment_id"] ?? ("PAY-" . rand(10000, 99999));

if (empty($subscription_id)) {
    exit("Subscription ID missing");
}

$subEscaped = mysqli_real_escape_string($conn, $subscription_id);

if ($status_code == "2" || $status_code == "200") {
    // Payment Successful
    $updateSql = "UPDATE premium_subscriptions 
                  SET status = 'active',
                      payment_status = 'Paid',
                      payment_id = '$payment_id',
                      subscription_start_date = NOW(),
                      subscription_expiry_date = DATE_ADD(NOW(), INTERVAL 1 MONTH)
                  WHERE subscription_id = '$subEscaped'";

    if (mysqli_query($conn, $updateSql)) {
        // Fetch user_id and upgrade user_tier in users table
        $subRes = mysqli_query($conn, "SELECT user_id FROM premium_subscriptions WHERE subscription_id = '$subEscaped' LIMIT 1");
        if ($subRes && $subRow = mysqli_fetch_assoc($subRes)) {
            $uId = $subRow['user_id'];
            mysqli_query($conn, "UPDATE users SET user_tier = 'premium' WHERE id = '$uId'");
        }
        echo "Subscription payment verified and activated successfully.";
    } else {
        echo "Failed to update subscription: " . mysqli_error($conn);
    }
} else {
    // Payment Failed
    mysqli_query($conn, "UPDATE premium_subscriptions SET status = 'cancelled', payment_status = 'Failed' WHERE subscription_id = '$subEscaped'");
    echo "Subscription payment failed.";
}
?>
