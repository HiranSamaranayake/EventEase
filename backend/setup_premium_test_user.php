<?php
require_once 'c:/xampp/htdocs/EventEase/backend/config/database.php';

mysqli_query($conn, "UPDATE users SET user_tier='premium' WHERE id=17 OR email='vip@example.com'");
$res = mysqli_query($conn, "SELECT id FROM users WHERE id=17");
if (!$res || mysqli_num_rows($res) == 0) {
    mysqli_query($conn, "INSERT INTO users (id, full_name, email, password, user_tier, role) VALUES (17, 'VIP Premium Customer', 'vip@example.com', 'dummy_hash', 'premium', 'customer')");
} else {
    mysqli_query($conn, "UPDATE users SET user_tier='premium' WHERE id=17");
}
echo "User 17 verified as Premium Tier in database.\n";
?>
