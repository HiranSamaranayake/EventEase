<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

$code = isset($data['code']) ? strtoupper(trim($data['code'])) : '';
$discount_type = isset($data['discount_type']) ? trim($data['discount_type']) : 'percentage';
$discount_value = isset($data['discount_value']) ? floatval($data['discount_value']) : 0.00;
$min_order_amount = isset($data['min_order_amount']) ? floatval($data['min_order_amount']) : 0.00;
$max_uses = isset($data['max_uses']) ? intval($data['max_uses']) : 100;
$valid_until = isset($data['valid_until']) ? trim($data['valid_until']) : null;
$event_id = isset($data['event_id']) && intval($data['event_id']) > 0 ? intval($data['event_id']) : null;
$organizer_id = isset($data['organizer_id']) && intval($data['organizer_id']) > 0 ? intval($data['organizer_id']) : null;

if (empty($code) || $discount_value <= 0) {
    echo json_encode(["status" => "error", "message" => "Promo code string and a valid discount value are required."]);
    exit;
}

// Check if code exists
$check = $conn->prepare("SELECT id FROM promo_codes WHERE code = ?");
$check->bind_param("s", $code);
$check->execute();
if ($check->get_result()->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Promo code '$code' already exists. Please choose another unique code."]);
    exit;
}
$check->close();

$valid_from = date("Y-m-d H:i:s");
if (empty($valid_until)) {
    $valid_until = date("Y-m-d H:i:s", strtotime("+1 year"));
} else {
    $valid_until = date("Y-m-d 23:59:59", strtotime($valid_until));
}

$stmt = $conn->prepare("INSERT INTO promo_codes (event_id, organizer_id, code, discount_type, discount_value, min_order_amount, max_uses, used_count, valid_from, valid_until, status) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, 'active')");
$stmt->bind_param("iissddiss", $event_id, $organizer_id, $code, $discount_type, $discount_value, $min_order_amount, $max_uses, $valid_from, $valid_until);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Promo code '$code' created successfully!", "id" => $conn->insert_id]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to create promo code: " . $conn->error]);
}
$stmt->close();
$conn->close();
?>
