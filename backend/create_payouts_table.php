<?php
require_once __DIR__ . "/config/database.php";

$sql = "CREATE TABLE IF NOT EXISTS `organizer_payouts` (
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
  PRIMARY KEY (`id`),
  KEY `organizer_id_idx` (`organizer_id`),
  KEY `event_id_idx` (`event_id`),
  KEY `status_idx` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;";

if (mysqli_query($conn, $sql)) {
    echo "Table 'organizer_payouts' created or already exists.\n";
    
    // Seed initial payout records if empty
    $check = mysqli_query($conn, "SELECT COUNT(*) as cnt FROM organizer_payouts");
    $row = mysqli_fetch_assoc($check);
    if ($row['cnt'] == 0) {
        $seeds = [
            [2, 16, 250000.00, 10.00, 25000.00, 225000.00, 'Bank of Ceylon', '8849201948', 'pending', NULL],
            [2, 17, 180000.00, 10.00, 18000.00, 162000.00, 'Commercial Bank', '1092837482', 'pending', NULL],
            [2, 6, 450000.00, 10.00, 45000.00, 405000.00, 'Hatton National Bank', '7728192847', 'transferred', 'Transfer processed via Sampath Pay.']
        ];

        foreach ($seeds as $s) {
            $org_id = $s[0];
            $ev_id = $s[1];
            $gross = $s[2];
            $crate = $s[3];
            $cfee = $s[4];
            $net = $s[5];
            $bank = mysqli_real_escape_string($conn, $s[6]);
            $acc = mysqli_real_escape_string($conn, $s[7]);
            $stat = mysqli_real_escape_string($conn, $s[8]);
            $notes = $s[9] ? "'" . mysqli_real_escape_string($conn, $s[9]) . "'" : "NULL";

            $conn->query("INSERT INTO organizer_payouts (organizer_id, event_id, gross_revenue, commission_rate, commission_fee, net_payout, bank_name, account_number, status, admin_notes) VALUES ($org_id, $ev_id, $gross, $crate, $cfee, $net, '$bank', '$acc', '$stat', $notes)");
        }
        echo "Seeded initial organizer revenue payout requests.\n";
    }
} else {
    echo "Error creating organizer_payouts table: " . mysqli_error($conn) . "\n";
}
?>
