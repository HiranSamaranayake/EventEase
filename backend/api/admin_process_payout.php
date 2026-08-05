<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

$payout_id = isset($data['payout_id']) ? intval($data['payout_id']) : 0;
$status = isset($data['status']) ? trim($data['status']) : '';
$admin_notes = isset($data['admin_notes']) ? trim($data['admin_notes']) : '';
$admin_id = isset($data['admin_id']) ? intval($data['admin_id']) : 7;

if (!$payout_id || !in_array($status, ['approved', 'rejected', 'transferred', 'pending'])) {
    echo json_encode(["status" => "error", "message" => "Valid Payout ID and status required."]);
    exit;
}

$now = date("Y-m-d H:i:s");
$stmt = $conn->prepare("UPDATE organizer_payouts SET status = ?, admin_notes = ?, processed_by = ?, processed_at = ? WHERE id = ?");
$stmt->bind_param("ssisi", $status, $admin_notes, $admin_id, $now, $payout_id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Payout request #" . $payout_id . " updated to " . strtoupper($status) . "."]);
} else {
    echo json_encode(["status" => "error", "message" => "Update failed: " . $conn->error]);
}
$stmt->close();
$conn->close();
?>
