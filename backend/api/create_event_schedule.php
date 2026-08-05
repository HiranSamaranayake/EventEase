<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

$event_id = isset($data['event_id']) ? intval($data['event_id']) : 0;
$session_title = isset($data['session_title']) ? trim($data['session_title']) : '';
$start_time = isset($data['start_time']) ? trim($data['start_time']) : '';
$end_time = isset($data['end_time']) ? trim($data['end_time']) : '';
$hall_stage = isset($data['hall_stage']) ? trim($data['hall_stage']) : '';
$speaker_performer = isset($data['speaker_performer']) ? trim($data['speaker_performer']) : '';
$description = isset($data['description']) ? trim($data['description']) : '';
$status = isset($data['status']) ? trim($data['status']) : 'scheduled';

if (!$event_id || empty($session_title) || empty($start_time) || empty($end_time)) {
    echo json_encode(["status" => "error", "message" => "Event ID, Session Title, Start Time, and End Time are required."]);
    exit;
}

// Auto create table if missing
$conn->query("CREATE TABLE IF NOT EXISTS `event_schedules` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `event_id` INT(11) NOT NULL,
  `session_title` VARCHAR(255) NOT NULL,
  `start_time` DATETIME NOT NULL,
  `end_time` DATETIME NOT NULL,
  `hall_stage` VARCHAR(150) DEFAULT NULL,
  `speaker_performer` VARCHAR(255) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `status` ENUM('scheduled', 'live', 'completed', 'cancelled') NOT NULL DEFAULT 'scheduled',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

$stmt = $conn->prepare("INSERT INTO event_schedules (event_id, session_title, start_time, end_time, hall_stage, speaker_performer, description, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("isssssss", $event_id, $session_title, $start_time, $end_time, $hall_stage, $speaker_performer, $description, $status);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Schedule session created successfully.", "schedule_id" => $conn->insert_id]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to create schedule session: " . $conn->error]);
}
$stmt->close();
$conn->close();
?>
