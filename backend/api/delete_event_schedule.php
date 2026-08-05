<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);
$schedule_id = isset($data['schedule_id']) ? intval($data['schedule_id']) : 0;

if (!$schedule_id) {
    echo json_encode(["status" => "error", "message" => "Schedule ID required."]);
    exit;
}

$stmt = $conn->prepare("DELETE FROM event_schedules WHERE id = ?");
$stmt->bind_param("i", $schedule_id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Schedule session deleted successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => "Delete failed: " . $conn->error]);
}
$stmt->close();
$conn->close();
?>
