<?php

require_once __DIR__ . '/../config/database.php';

/**
 * Verify whether a customer currently holds an active, non-expired Premium subscription.
 * Automatically updates users.user_tier to 'verified' if subscription has expired.
 */
function isUserPremiumActive($conn, $user_id) {
    $user_id = intval($user_id);
    if ($user_id <= 0) return false;

    // Query active paid subscription that has not expired
    $sql = "SELECT id, subscription_start_date, subscription_expiry_date, status, payment_status
            FROM premium_subscriptions
            WHERE user_id = '$user_id'
              AND status = 'active'
              AND payment_status = 'Paid'
              AND subscription_expiry_date > NOW()
            ORDER BY id DESC
            LIMIT 1";

    $res = mysqli_query($conn, $sql);
    if ($res && mysqli_num_rows($res) > 0) {
        // Ensure users.user_tier is synced to premium
        @mysqli_query($conn, "UPDATE users SET user_tier = 'premium' WHERE id = '$user_id'");
        return true;
    }

    // If expired or no active subscription, sync users.user_tier to verified
    @mysqli_query($conn, "UPDATE users SET user_tier = 'verified' WHERE id = '$user_id' AND user_tier = 'premium'");
    // Also mark any past active subscriptions whose expiry date has passed as 'expired'
    @mysqli_query($conn, "UPDATE premium_subscriptions SET status = 'expired' WHERE user_id = '$user_id' AND status = 'active' AND subscription_expiry_date <= NOW()");

    return false;
}

/**
 * Fetch detailed subscription profile for a user
 */
function getUserSubscriptionDetails($conn, $user_id) {
    $user_id = intval($user_id);
    if ($user_id <= 0) return null;

    $is_active = isUserPremiumActive($conn, $user_id);

    $sql = "SELECT * FROM premium_subscriptions WHERE user_id = '$user_id' ORDER BY id DESC LIMIT 1";
    $res = mysqli_query($conn, $sql);
    $sub = ($res && mysqli_num_rows($res) > 0) ? mysqli_fetch_assoc($res) : null;

    if ($sub) {
        $expiryTimestamp = strtotime($sub['subscription_expiry_date']);
        $nowTimestamp = time();
        $daysRemaining = max(0, ceil(($expiryTimestamp - $nowTimestamp) / 86400));
        $sub['is_active'] = $is_active;
        $sub['days_remaining'] = $daysRemaining;
        return $sub;
    }

    return [
        'is_active' => false,
        'status' => 'inactive',
        'payment_status' => 'None',
        'subscription_start_date' => null,
        'subscription_expiry_date' => null,
        'days_remaining' => 0
    ];
}
?>
