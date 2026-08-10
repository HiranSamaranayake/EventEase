<?php
require_once __DIR__ . '/config/database.php';

$sql = "CREATE TABLE IF NOT EXISTS `email_logs` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `booking_id` INT(11) DEFAULT NULL,
  `recipient_email` VARCHAR(255) NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `body_html` LONGTEXT NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'sent',
  `error_message` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id_idx` (`user_id`),
  KEY `booking_id_idx` (`booking_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;";

if (mysqli_query($conn, $sql)) {
    // Check if booking_id column exists
    $colCheck = mysqli_query($conn, "SHOW COLUMNS FROM email_logs LIKE 'booking_id'");
    if (!$colCheck || mysqli_num_rows($colCheck) == 0) {
        mysqli_query($conn, "ALTER TABLE email_logs ADD COLUMN booking_id INT(11) DEFAULT NULL AFTER user_id, ADD KEY (booking_id)");
    }
    // Check if error_message column exists
    $errCheck = mysqli_query($conn, "SHOW COLUMNS FROM email_logs LIKE 'error_message'");
    if (!$errCheck || mysqli_num_rows($errCheck) == 0) {
        mysqli_query($conn, "ALTER TABLE email_logs ADD COLUMN error_message TEXT DEFAULT NULL AFTER status");
    }
    echo "Table 'email_logs' verified successfully.\n";
} else {
    echo "Error creating email_logs table: " . mysqli_error($conn) . "\n";
}
?>
