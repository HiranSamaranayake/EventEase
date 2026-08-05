<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/database.php';

// Auto create table if missing
$conn->query("CREATE TABLE IF NOT EXISTS `security_logs` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) DEFAULT NULL,
  `event_type` ENUM('failed_login', 'unauthorized_access', 'suspicious_transaction', 'privilege_change', 'user_blocked', 'ticket_scan_anomaly', 'system_setting_update') NOT NULL DEFAULT 'failed_login',
  `ip_address` VARCHAR(45) NOT NULL DEFAULT '127.0.0.1',
  `user_agent` TEXT DEFAULT NULL,
  `risk_score` ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'low',
  `details` TEXT NOT NULL,
  `is_flagged` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

$risk_filter = isset($_GET['risk']) ? trim($_GET['risk']) : '';
$type_filter = isset($_GET['type']) ? trim($_GET['type']) : '';
$flagged_only = isset($_GET['flagged']) ? intval($_GET['flagged']) : 0;

$where = [];
if (!empty($risk_filter) && $risk_filter !== 'all') {
    $where[] = "s.risk_score = '" . mysqli_real_escape_string($conn, $risk_filter) . "'";
}
if (!empty($type_filter) && $type_filter !== 'all') {
    $where[] = "s.event_type = '" . mysqli_real_escape_string($conn, $type_filter) . "'";
}
if ($flagged_only === 1) {
    $where[] = "s.is_flagged = 1";
}

$where_sql = count($where) > 0 ? " WHERE " . implode(" AND ", $where) : "";

$query = "SELECT s.*, u.full_name as user_name, u.email as user_email, u.role as user_role 
          FROM security_logs s 
          LEFT JOIN users u ON s.user_id = u.id 
          $where_sql 
          ORDER BY s.created_at DESC LIMIT 100";

$result = $conn->query($query);

$logs = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $logs[] = $row;
    }
}

// Compute threat stats summary
$stats = [
    "total_logs" => 0,
    "critical" => 0,
    "high" => 0,
    "medium" => 0,
    "low" => 0,
    "flagged" => 0
];

$all_res = $conn->query("SELECT risk_score, is_flagged FROM security_logs");
if ($all_res) {
    while ($r = $all_res->fetch_assoc()) {
        $stats['total_logs']++;
        if (isset($stats[$r['risk_score']])) {
            $stats[$r['risk_score']]++;
        }
        if ($r['is_flagged'] == 1) {
            $stats['flagged']++;
        }
    }
}

echo json_encode(["status" => "success", "stats" => $stats, "data" => $logs]);
$conn->close();
?>
