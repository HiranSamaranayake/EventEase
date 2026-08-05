<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = isset($data['id']) ? intval($data['id']) : 0;

if (!$id) {
    echo json_encode(["status" => "error", "message" => "Valid Announcement ID required."]);
    exit;
}

$stmt = $conn->prepare("DELETE FROM event_announcements WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Announcement deleted."]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to delete: " . $conn->error]);
}
$stmt->close();
$conn->close();
?>
