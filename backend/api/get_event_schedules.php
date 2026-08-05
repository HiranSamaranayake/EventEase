<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/database.php';

$event_id = isset($_GET['event_id']) ? intval($_GET['event_id']) : 0;

if (!$event_id) {
    echo json_encode(["status" => "error", "message" => "Event ID required."]);
    exit;
}

$query = "SELECT s.*, e.title as event_title 
          FROM event_schedules s 
          LEFT JOIN events e ON s.event_id = e.id 
          WHERE s.event_id = ? 
          ORDER BY s.start_time ASC";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $event_id);
$stmt->execute();
$result = $stmt->get_result();

$schedules = [];
while ($row = $result->fetch_assoc()) {
    $schedules[] = $row;
}

echo json_encode(["status" => "success", "data" => $schedules]);
$stmt->close();
$conn->close();
?>
