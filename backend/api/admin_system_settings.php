<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/database.php';

// Auto create system_settings table if missing
$conn->query("CREATE TABLE IF NOT EXISTS `system_settings` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `setting_key` VARCHAR(100) NOT NULL UNIQUE,
  `setting_value` TEXT NOT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $res = $conn->query("SELECT setting_key, setting_value FROM system_settings");
    $settings = [];
    if ($res) {
        while ($row = $res->fetch_assoc()) {
            $settings[$row['setting_key']] = $row['setting_value'];
        }
    }

    // Default fallback values if missing
    $defaults = [
        "maintenance_mode" => "false",
        "max_login_attempts" => "5",
        "session_timeout_mins" => "60",
        "enforce_tls" => "true",
        "auto_backup_frequency" => "daily",
        "system_version" => "v2.4.0"
    ];

    foreach ($defaults as $k => $v) {
        if (!isset($settings[$k])) {
            $settings[$k] = $v;
        }
    }

    echo json_encode(["status" => "success", "data" => $settings]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!is_array($data)) {
        echo json_encode(["status" => "error", "message" => "Invalid payload."]);
        exit;
    }

    foreach ($data as $key => $val) {
        $k = mysqli_real_escape_string($conn, $key);
        $v = mysqli_real_escape_string($conn, is_bool($val) ? ($val ? 'true' : 'false') : strval($val));
        
        $conn->query("INSERT INTO system_settings (setting_key, setting_value) VALUES ('$k', '$v') ON DUPLICATE KEY UPDATE setting_value = '$v'");
    }

    // Log security policy change
    $conn->query("INSERT INTO security_logs (user_id, event_type, risk_score, details) VALUES (7, 'system_setting_update', 'medium', 'Super Admin updated system governance and security policies.')");

    echo json_encode(["status" => "success", "message" => "System settings and security policies updated successfully."]);
}

$conn->close();
?>
