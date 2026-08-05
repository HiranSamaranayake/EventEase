<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/database.php';

// Auto create table if missing
$conn->query("CREATE TABLE IF NOT EXISTS `organizer_payouts` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `organizer_id` INT(11) NOT NULL,
  `event_id` INT(11) DEFAULT NULL,
  `gross_revenue` DECIMAL(10,2) NOT NULL,
  `commission_rate` DECIMAL(5,2) DEFAULT 10.00,
  `commission_fee` DECIMAL(10,2) NOT NULL,
  `net_payout` DECIMAL(10,2) NOT NULL,
  `bank_name` VARCHAR(100) DEFAULT NULL,
  `account_number` VARCHAR(50) DEFAULT NULL,
  `status` ENUM('pending', 'approved', 'rejected', 'transferred') NOT NULL DEFAULT 'pending',
  `admin_notes` TEXT DEFAULT NULL,
  `processed_by` INT(11) DEFAULT NULL,
  `requested_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `processed_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

$stats = [
    "gross_revenue" => 0.00,
    "platform_commission" => 0.00,
    "pending_payouts" => 0.00,
    "settled_payouts" => 0.00,
    "pending_count" => 0,
    "settled_count" => 0
];

// Gross revenue & Commission calculation from bookings
$res1 = $conn->query("SELECT SUM(total_amount) AS gross FROM bookings WHERE booking_status = 'Confirmed'");
if ($res1 && $row = $res1->fetch_assoc()) {
    $stats["gross_revenue"] = floatval($row["gross"] ?? 0.00);
}

// Commission fee is 10% of gross
$stats["platform_commission"] = round($stats["gross_revenue"] * 0.10, 2);

// Pending payouts total
$res2 = $conn->query("SELECT SUM(net_payout) AS pending_total, COUNT(*) as cnt FROM organizer_payouts WHERE status = 'pending'");
if ($res2 && $row = $res2->fetch_assoc()) {
    $stats["pending_payouts"] = floatval($row["pending_total"] ?? 0.00);
    $stats["pending_count"] = intval($row["cnt"] ?? 0);
}

// Settled payouts total
$res3 = $conn->query("SELECT SUM(net_payout) AS settled_total, COUNT(*) as cnt FROM organizer_payouts WHERE status IN ('approved', 'transferred')");
if ($res3 && $row = $res3->fetch_assoc()) {
    $stats["settled_payouts"] = floatval($row["settled_total"] ?? 0.00);
    $stats["settled_count"] = intval($row["cnt"] ?? 0);
}

echo json_encode(["status" => "success", "stats" => $stats]);
$conn->close();
?>
