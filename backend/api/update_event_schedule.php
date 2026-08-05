<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

$schedule_id = isset($data['schedule_id']) ? intval($data['schedule_id']) : 0;
$session_title = isset($data['session_title']) ? trim($data['session_title']) : '';
$start_time = isset($data['start_time']) ? trim($data['start_time']) : '';
$end_time = isset($data['end_time']) ? trim($data['end_time']) : '';
$hall_stage = isset($data['hall_stage']) ? trim($data['hall_stage']) : '';
$speaker_performer = isset($data['speaker_performer']) ? trim($data['speaker_performer']) : '';
$description = isset($data['description']) ? trim($data['description']) : '';
$status = isset($data['status']) ? trim($data['status']) : 'scheduled';

if (!$schedule_id || empty($session_title)) {
    echo json_encode(["status" => "error", "message" => "Schedule ID and Session Title required."]);
    exit;
}

$stmt = $conn->prepare("UPDATE event_schedules SET session_title = ?, start_time = ?, end_time = ?, hall_stage = ?, speaker_performer = ?, description = ?, status = ? WHERE id = ?");
$stmt->bind_param("sssssssi", $session_title, $start_time, $end_time, $hall_stage, $speaker_performer, $description, $status, $schedule_id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Schedule session updated successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => "Update failed: " . $conn->error]);
}
$stmt->close();
$conn->close();
?>
