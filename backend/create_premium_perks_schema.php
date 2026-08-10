<?php
require_once __DIR__ . '/config/database.php';

echo "=== Updating Premium Perks & Subscriptions Database Schema ===\n";

// 1. Check users.user_tier
$checkUserTier = mysqli_query($conn, "SHOW COLUMNS FROM users LIKE 'user_tier'");
if (!$checkUserTier || mysqli_num_rows($checkUserTier) == 0) {
    mysqli_query($conn, "ALTER TABLE users ADD COLUMN user_tier VARCHAR(20) DEFAULT 'verified'");
    echo "Added user_tier column to users table.\n";
}

// 2. Check events.early_access_hours
$checkEarlyAccess = mysqli_query($conn, "SHOW COLUMNS FROM events LIKE 'early_access_hours'");
if (!$checkEarlyAccess || mysqli_num_rows($checkEarlyAccess) == 0) {
    mysqli_query($conn, "ALTER TABLE events ADD COLUMN early_access_hours INT(11) DEFAULT 24");
    echo "Added early_access_hours column to events table.\n";
}

// 3. Check events.is_exclusive
$checkExclusive = mysqli_query($conn, "SHOW COLUMNS FROM events LIKE 'is_exclusive'");
if (!$checkExclusive || mysqli_num_rows($checkExclusive) == 0) {
    mysqli_query($conn, "ALTER TABLE events ADD COLUMN is_exclusive TINYINT(1) DEFAULT 0");
    echo "Added is_exclusive column to events table.\n";
}

// 4. Check events.premium_booking_open_date
$checkPremDate = mysqli_query($conn, "SHOW COLUMNS FROM events LIKE 'premium_booking_open_date'");
if (!$checkPremDate || mysqli_num_rows($checkPremDate) == 0) {
    mysqli_query($conn, "ALTER TABLE events ADD COLUMN premium_booking_open_date DATETIME NULL AFTER event_date");
    echo "Added premium_booking_open_date column to events table.\n";
}

// 5. Check events.normal_booking_open_date
$checkNormDate = mysqli_query($conn, "SHOW COLUMNS FROM events LIKE 'normal_booking_open_date'");
if (!$checkNormDate || mysqli_num_rows($checkNormDate) == 0) {
    mysqli_query($conn, "ALTER TABLE events ADD COLUMN normal_booking_open_date DATETIME NULL AFTER premium_booking_open_date");
    echo "Added normal_booking_open_date column to events table.\n";
}

// Populate missing dates on existing events
mysqli_query($conn, "UPDATE events SET premium_booking_open_date = DATE_SUB(event_date, INTERVAL 7 DAY) WHERE premium_booking_open_date IS NULL");
mysqli_query($conn, "UPDATE events SET normal_booking_open_date = DATE_SUB(event_date, INTERVAL 6 DAY) WHERE normal_booking_open_date IS NULL");

// 6. Create premium_subscriptions table
$subTableSql = "CREATE TABLE IF NOT EXISTS premium_subscriptions (
    id INT(11) NOT NULL AUTO_INCREMENT,
    user_id INT(11) NOT NULL,
    subscription_id VARCHAR(100) NOT NULL UNIQUE,
    payment_id VARCHAR(100) DEFAULT NULL,
    amount DECIMAL(10,2) NOT NULL DEFAULT '1500.00',
    subscription_start_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    subscription_expiry_date DATETIME NOT NULL,
    status ENUM('active', 'expired', 'cancelled', 'pending') NOT NULL DEFAULT 'pending',
    payment_status ENUM('Pending', 'Paid', 'Failed') NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY user_id_idx (user_id),
    KEY status_idx (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

if (mysqli_query($conn, $subTableSql)) {
    echo "Table 'premium_subscriptions' verified successfully.\n";
} else {
    echo "Error creating premium_subscriptions table: " . mysqli_error($conn) . "\n";
}

echo "Database schema update complete.\n";
?>
