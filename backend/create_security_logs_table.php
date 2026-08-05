<?php
require_once __DIR__ . "/config/database.php";

$sql = "CREATE TABLE IF NOT EXISTS `security_logs` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) DEFAULT NULL,
  `event_type` ENUM('failed_login', 'unauthorized_access', 'suspicious_transaction', 'privilege_change', 'user_blocked', 'ticket_scan_anomaly', 'system_setting_update') NOT NULL DEFAULT 'failed_login',
  `ip_address` VARCHAR(45) NOT NULL DEFAULT '127.0.0.1',
  `user_agent` TEXT DEFAULT NULL,
  `risk_score` ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'low',
  `details` TEXT NOT NULL,
  `is_flagged` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id_idx` (`user_id`),
  KEY `risk_score_idx` (`risk_score`),
  KEY `event_type_idx` (`event_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;";

if (mysqli_query($conn, $sql)) {
    echo "Table 'security_logs' created or already exists.\n";
    
    // Seed initial audit log entries if table is empty
    $check = mysqli_query($conn, "SELECT COUNT(*) as cnt FROM security_logs");
    $row = mysqli_fetch_assoc($check);
    if ($row['cnt'] == 0) {
        $seeds = [
            [9, 'failed_login', '192.168.1.45', 'Mozilla/5.0 (Windows NT 10.0)', 'medium', '3 consecutive failed login attempts detected for customer account.', 0],
            [null, 'suspicious_transaction', '103.24.12.89', 'curl/7.68.0', 'high', 'Rapid booking attempt of 15 tickets within 2 seconds. Potential bot activity.', 1],
            [7, 'privilege_change', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0)', 'low', 'Admin role permissions updated for Support Staff user #7.', 0],
            [null, 'unauthorized_access', '185.220.101.5', 'Python-urllib/3.8', 'critical', 'Attempted unauthorized endpoint access to /api/admin_organizers.php without JWT.', 1],
            [2, 'ticket_scan_anomaly', '192.168.1.12', 'EventEase Scanner Android App', 'medium', 'Ticket EVT-118-4924 scanned twice within 30 seconds at Gate B.', 0]
        ];

        foreach ($seeds as $s) {
            $u_id = $s[0] === null ? "NULL" : $s[0];
            $e_type = mysqli_real_escape_string($conn, $s[1]);
            $ip = mysqli_real_escape_string($conn, $s[2]);
            $ua = mysqli_real_escape_string($conn, $s[3]);
            $risk = mysqli_real_escape_string($conn, $s[4]);
            $det = mysqli_real_escape_string($conn, $s[5]);
            $flag = $s[6];

            $conn->query("INSERT INTO security_logs (user_id, event_type, ip_address, user_agent, risk_score, details, is_flagged) VALUES ($u_id, '$e_type', '$ip', '$ua', '$risk', '$det', $flag)");
        }
        echo "Seeded initial security audit logs.\n";
    }
} else {
    echo "Error creating security_logs table: " . mysqli_error($conn) . "\n";
}
?>
