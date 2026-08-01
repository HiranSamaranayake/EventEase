<?php
require_once __DIR__ . '/config/database.php';

header("Content-Type: application/json");

// Create support_tickets table
$sqlTickets = "CREATE TABLE IF NOT EXISTS `support_tickets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ticket_number` varchar(50) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) DEFAULT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `category` enum('Event Issue', 'Payment & Refund Dispute', 'Ticket Download Problem', 'Account / Verification', 'General Inquiry') NOT NULL DEFAULT 'General Inquiry',
  `subject` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `priority` enum('Low', 'Medium', 'High', 'Urgent') DEFAULT 'Medium',
  `status` enum('Open', 'In Progress', 'Resolved', 'Closed') DEFAULT 'Open',
  `assigned_to` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ticket_number` (`ticket_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";

// Create support_ticket_replies table
$sqlReplies = "CREATE TABLE IF NOT EXISTS `support_ticket_replies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ticket_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";

$tRes = $conn->query($sqlTickets);
$rRes = $conn->query($sqlReplies);

if ($tRes && $rRes) {
    echo json_encode(["status" => "success", "message" => "Support tables setup successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => "Database error: " . $conn->error]);
}

$conn->close();
?>
