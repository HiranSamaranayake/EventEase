<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

$user_id = (isset($data['user_id']) && !empty($data['user_id'])) ? intval($data['user_id']) : null;
$event_type = isset($data['event_type']) ? trim($data['event_type']) : 'failed_login';
$ip_address = isset($data['ip_address']) ? trim($data['ip_address']) : ($_SERVER['REMOTE_ADDR'] ?? '127.0.0.1');
$user_agent = isset($data['user_agent']) ? trim($data['user_agent']) : ($_SERVER['HTTP_USER_AGENT'] ?? '');
$risk_score = isset($data['risk_score']) ? trim($data['risk_score']) : 'low';
$details = isset($data['details']) ? trim($data['details']) : 'Security event recorded.';
$is_flagged = isset($data['is_flagged']) ? intval($data['is_flagged']) : 0;

$stmt = $conn->prepare("INSERT INTO security_logs (user_id, event_type, ip_address, user_agent, risk_score, details, is_flagged) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("isssssi", $user_id, $event_type, $ip_address, $user_agent, $risk_score, $details, $is_flagged);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Security log recorded.", "log_id" => $conn->insert_id]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to log event: " . $conn->error]);
}
$stmt->close();
$conn->close();
?>
