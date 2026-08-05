<?php
require_once __DIR__ . "/config/database.php";

// Create database_backups table
$sql1 = "CREATE TABLE IF NOT EXISTS `database_backups` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `file_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `file_size` INT(11) NOT NULL DEFAULT 0,
  `tables_count` INT(11) NOT NULL DEFAULT 0,
  `created_by` INT(11) NOT NULL,
  `status` ENUM('completed', 'failed', 'restored') NOT NULL DEFAULT 'completed',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by_idx` (`created_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;";

if (mysqli_query($conn, $sql1)) {
    echo "Table 'database_backups' created or already exists.\n";
} else {
    echo "Error creating database_backups table: " . mysqli_error($conn) . "\n";
}

// Create system_settings table
$sql2 = "CREATE TABLE IF NOT EXISTS `system_settings` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `setting_key` VARCHAR(100) NOT NULL UNIQUE,
  `setting_value` TEXT NOT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;";

if (mysqli_query($conn, $sql2)) {
    echo "Table 'system_settings' created or already exists.\n";

    // Seed default settings if empty
    $defaults = [
        "maintenance_mode" => "false",
        "max_login_attempts" => "5",
        "session_timeout_mins" => "60",
        "enforce_tls" => "true",
        "auto_backup_frequency" => "daily",
        "system_version" => "v2.4.0"
    ];

    foreach ($defaults as $key => $val) {
        $k = mysqli_real_escape_string($conn, $key);
        $v = mysqli_real_escape_string($conn, $val);
        $conn->query("INSERT IGNORE INTO system_settings (setting_key, setting_value) VALUES ('$k', '$v')");
    }
    echo "Default system settings initialized.\n";
} else {
    echo "Error creating system_settings table: " . mysqli_error($conn) . "\n";
}

// Create backups directory if missing
$backup_dir = __DIR__ . "/../database/backups";
if (!file_exists($backup_dir)) {
    mkdir($backup_dir, 0777, true);
    echo "Created directory database/backups.\n";
}
?>
