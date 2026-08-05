<?php
require_once __DIR__ . "/config/database.php";

$sql = "CREATE TABLE IF NOT EXISTS `complaints` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `event_id` INT(11) DEFAULT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `category` ENUM('booking_issue', 'payment_dispute', 'event_cancellation', 'organizer_conduct', 'technical_issue', 'other') NOT NULL DEFAULT 'booking_issue',
  `description` TEXT NOT NULL,
  `status` ENUM('open', 'in_progress', 'resolved', 'dismissed') NOT NULL DEFAULT 'open',
  `priority` ENUM('low', 'medium', 'high', 'urgent') NOT NULL DEFAULT 'medium',
  `admin_response` TEXT DEFAULT NULL,
  `resolved_by` INT(11) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id_idx` (`user_id`),
  KEY `event_id_idx` (`event_id`),
  KEY `status_idx` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;";

if (mysqli_query($conn, $sql)) {
    echo "Table 'complaints' created or already exists.\n";
} else {
    echo "Error creating table: " . mysqli_error($conn) . "\n";
}
?>
