<?php
require_once __DIR__ . "/config/database.php";

$sql = "CREATE TABLE IF NOT EXISTS `promo_codes` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `event_id` INT(11) DEFAULT NULL,
  `organizer_id` INT(11) DEFAULT NULL,
  `code` VARCHAR(50) NOT NULL,
  `discount_type` ENUM('percentage', 'fixed') NOT NULL DEFAULT 'percentage',
  `discount_value` DECIMAL(10,2) NOT NULL,
  `min_order_amount` DECIMAL(10,2) DEFAULT 0.00,
  `max_uses` INT(11) DEFAULT 100,
  `used_count` INT(11) DEFAULT 0,
  `valid_from` DATETIME DEFAULT NULL,
  `valid_until` DATETIME DEFAULT NULL,
  `status` ENUM('active', 'inactive', 'expired') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code_unique` (`code`),
  KEY `event_id_idx` (`event_id`),
  KEY `organizer_id_idx` (`organizer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;";

if (mysqli_query($conn, $sql)) {
    echo "Table 'promo_codes' created or already exists.\n";
    
    // Seed initial promo codes if empty
    $check = mysqli_query($conn, "SELECT COUNT(*) as cnt FROM promo_codes");
    $row = mysqli_fetch_assoc($check);
    if ($row['cnt'] == 0) {
        $seeds = [
            [NULL, NULL, 'EVENT20', 'percentage', 20.00, 500.00, 100, 14, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 'active'],
            [6, 2, 'COLOMBO500', 'fixed', 500.00, 1000.00, 50, 8, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 'active'],
            [NULL, NULL, 'VIPPERK10', 'percentage', 10.00, 0.00, 500, 42, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 'active']
        ];

        foreach ($seeds as $s) {
            $ev_id = $s[0] !== null ? $s[0] : "NULL";
            $org_id = $s[1] !== null ? $s[1] : "NULL";
            $code = mysqli_real_escape_string($conn, $s[2]);
            $dtype = $s[3];
            $dval = $s[4];
            $min_ord = $s[5];
            $max_u = $s[6];
            $used_u = $s[7];
            $vf = $s[8];
            $vu = $s[9];
            $stat = $s[10];

            $conn->query("INSERT INTO promo_codes (event_id, organizer_id, code, discount_type, discount_value, min_order_amount, max_uses, used_count, valid_from, valid_until, status) VALUES ($ev_id, $org_id, '$code', '$dtype', $dval, $min_ord, $max_u, $used_u, '$vf', '$vu', '$stat')");
        }
        echo "Seeded initial promotional discount codes.\n";
    }
} else {
    echo "Error creating promo_codes table: " . mysqli_error($conn) . "\n";
}
?>
