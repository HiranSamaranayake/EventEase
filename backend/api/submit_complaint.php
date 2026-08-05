<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

$user_id = isset($data['user_id']) ? intval($data['user_id']) : 0;
$subject = isset($data['subject']) ? trim($data['subject']) : '';
$category = isset($data['category']) ? trim($data['category']) : 'booking_issue';
$description = isset($data['description']) ? trim($data['description']) : '';
$event_id = (isset($data['event_id']) && !empty($data['event_id'])) ? intval($data['event_id']) : null;
$priority = isset($data['priority']) ? trim($data['priority']) : 'medium';

if (!$user_id || empty($subject) || empty($description)) {
    echo json_encode(["status" => "error", "message" => "User ID, Subject, and Description are required."]);
    exit;
}

// Auto create table if missing
$conn->query("CREATE TABLE IF NOT EXISTS `complaints` (
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

$stmt = $conn->prepare("INSERT INTO complaints (user_id, event_id, subject, category, description, priority, status) VALUES (?, ?, ?, ?, ?, ?, 'open')");
$stmt->bind_param("iissss", $user_id, $event_id, $subject, $category, $description, $priority);

if ($stmt->execute()) {
    $complaint_id = $conn->insert_id;
    echo json_encode(["status" => "success", "message" => "Support ticket submitted successfully.", "complaint_id" => $complaint_id]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to submit ticket: " . $conn->error]);
}
$stmt->close();
$conn->close();
?>
