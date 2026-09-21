<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/database.php';

$organizer_id = isset($_GET['organizer_id']) ? intval($_GET['organizer_id']) : (isset($_GET['user_id']) ? intval($_GET['user_id']) : 0);

if (!$organizer_id) {
    echo json_encode(["status" => "error", "message" => "Organizer ID required."]);
    exit;
}

// Auto-create complaints table if missing
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

// Query complaints for events organized by this organizer, plus general complaints
$query = "SELECT c.*, u.full_name as user_name, u.email as user_email, u.phone as user_phone, e.title as event_title, r.full_name as resolver_name
          FROM complaints c
          LEFT JOIN users u ON c.user_id = u.id
          LEFT JOIN events e ON c.event_id = e.id
          LEFT JOIN users r ON c.resolved_by = r.id
          WHERE e.organizer_id = ? OR (c.event_id IS NULL AND c.category IN ('organizer_conduct', 'booking_issue', 'other'))
          ORDER BY FIELD(c.status, 'open', 'in_progress', 'resolved', 'dismissed'), c.created_at DESC";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $organizer_id);
$stmt->execute();
$result = $stmt->get_result();

$complaints = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $complaints[] = $row;
    }
}

$stats = [
    "total" => count($complaints),
    "open" => 0,
    "in_progress" => 0,
    "resolved" => 0,
    "dismissed" => 0
];

foreach ($complaints as $c) {
    $st = $c['status'] ?? 'open';
    if (isset($stats[$st])) {
        $stats[$st]++;
    }
}

echo json_encode(["status" => "success", "stats" => $stats, "data" => $complaints]);
$stmt->close();
$conn->close();
?>
