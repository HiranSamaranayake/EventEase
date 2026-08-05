<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/database.php';

$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

if (!$user_id) {
    echo json_encode(["status" => "error", "message" => "User ID required."]);
    exit;
}

$query = "SELECT c.*, e.title as event_title 
          FROM complaints c 
          LEFT JOIN events e ON c.event_id = e.id 
          WHERE c.user_id = ? 
          ORDER BY c.created_at DESC";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$complaints = [];
while ($row = $result->fetch_assoc()) {
    $complaints[] = $row;
}

echo json_encode(["status" => "success", "data" => $complaints]);
$stmt->close();
$conn->close();
?>
