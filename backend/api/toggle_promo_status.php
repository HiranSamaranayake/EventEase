<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);
$promo_id = isset($data['promo_id']) ? intval($data['promo_id']) : 0;
$action = isset($data['action']) ? trim($data['action']) : 'toggle_status';

if (!$promo_id) {
    echo json_encode(["status" => "error", "message" => "Promo ID required."]);
    exit;
}

if ($action === 'delete') {
    $stmt = $conn->prepare("DELETE FROM promo_codes WHERE id = ?");
    $stmt->bind_param("i", $promo_id);
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Promo code deleted."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Delete failed: " . $conn->error]);
    }
} else {
    // Toggle status between active & inactive
    $stmt = $conn->prepare("UPDATE promo_codes SET status = IF(status = 'active', 'inactive', 'active') WHERE id = ?");
    $stmt->bind_param("i", $promo_id);
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Promo code status updated."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Update failed: " . $conn->error]);
    }
}
$stmt->close();
$conn->close();
?>
