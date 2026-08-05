<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/database.php';

// Auto create table if missing
$conn->query("CREATE TABLE IF NOT EXISTS `database_backups` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `file_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `file_size` INT(11) NOT NULL DEFAULT 0,
  `tables_count` INT(11) NOT NULL DEFAULT 0,
  `created_by` INT(11) NOT NULL,
  `status` ENUM('completed', 'failed', 'restored') NOT NULL DEFAULT 'completed',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

$query = "SELECT b.*, u.full_name as creator_name, u.email as creator_email 
          FROM database_backups b 
          LEFT JOIN users u ON b.created_by = u.id 
          ORDER BY b.created_at DESC";

$result = $conn->query($query);

$backups = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $backups[] = $row;
    }
}

echo json_encode(["status" => "success", "data" => $backups]);
$conn->close();
?>
