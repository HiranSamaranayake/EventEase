<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

$log_id = isset($data['log_id']) ? intval($data['log_id']) : 0;
$action = isset($data['action']) ? trim($data['action']) : ''; // 'toggle_flag', 'block_user', 'update_risk'
$risk_score = isset($data['risk_score']) ? trim($data['risk_score']) : null;
$user_id = isset($data['user_id']) ? intval($data['user_id']) : null;

if (!$log_id && $action !== 'block_user') {
    echo json_encode(["status" => "error", "message" => "Log ID required."]);
    exit;
}

if ($action === 'toggle_flag') {
    $stmt = $conn->prepare("UPDATE security_logs SET is_flagged = NOT is_flagged WHERE id = ?");
    $stmt->bind_param("i", $log_id);
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Flag status toggled successfully."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to toggle flag: " . $conn->error]);
    }
    $stmt->close();
} elseif ($action === 'update_risk') {
    if (!$risk_score) {
        echo json_encode(["status" => "error", "message" => "Risk score required."]);
        exit;
    }
    $stmt = $conn->prepare("UPDATE security_logs SET risk_score = ? WHERE id = ?");
    $stmt->bind_param("si", $risk_score, $log_id);
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Risk score updated to " . $risk_score]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to update risk score: " . $conn->error]);
    }
    $stmt->close();
} elseif ($action === 'block_user') {
    if (!$user_id) {
        echo json_encode(["status" => "error", "message" => "User ID required to block user."]);
        exit;
    }
    // Record security log for user blockage
    $conn->query("INSERT INTO security_logs (user_id, event_type, risk_score, details, is_flagged) VALUES ($user_id, 'user_blocked', 'critical', 'User #$user_id access blocked by Security Admin.', 1)");
    echo json_encode(["status" => "success", "message" => "User #$user_id access blocked and security log recorded."]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid security action."]);
}

$conn->close();
?>
