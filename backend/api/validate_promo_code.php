<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

$code = isset($data['code']) ? strtoupper(trim($data['code'])) : '';
$order_amount = isset($data['order_amount']) ? floatval($data['order_amount']) : 0.00;
$event_id = isset($data['event_id']) ? intval($data['event_id']) : 0;

if (empty($code) || $order_amount <= 0) {
    echo json_encode(["status" => "error", "message" => "Promo code and valid order amount required."]);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM promo_codes WHERE UPPER(code) = ? AND status = 'active'");
$stmt->bind_param("s", $code);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "Invalid or expired promo code."]);
    exit;
}

$promo = $result->fetch_assoc();

// Check event restriction
if ($promo['event_id'] !== null && intval($promo['event_id']) !== $event_id) {
    echo json_encode(["status" => "error", "message" => "This promo code is not applicable for this event."]);
    exit;
}

// Check usage limits
if ($promo['max_uses'] > 0 && $promo['used_count'] >= $promo['max_uses']) {
    echo json_encode(["status" => "error", "message" => "Promo code redemption limit reached."]);
    exit;
}

// Check expiration date
if ($promo['valid_until'] !== null && strtotime($promo['valid_until']) < time()) {
    echo json_encode(["status" => "error", "message" => "This promo code expired on " . date("Y-m-d", strtotime($promo['valid_until']))]);
    exit;
}

// Check min order amount
if ($order_amount < floatval($promo['min_order_amount'])) {
    echo json_encode([
        "status" => "error", 
        "message" => "Minimum order amount of LKR " . number_format($promo['min_order_amount'], 2) . " required for code '$code'."
    ]);
    exit;
}

// Calculate discount
$discount_amount = 0.00;
if ($promo['discount_type'] === 'percentage') {
    $discount_amount = round(($order_amount * floatval($promo['discount_value'])) / 100, 2);
} else {
    $discount_amount = min(floatval($promo['discount_value']), $order_amount);
}

$final_total = max(0.00, round($order_amount - $discount_amount, 2));

echo json_encode([
    "status" => "success",
    "message" => "Promo code '$code' applied successfully!",
    "code" => $promo['code'],
    "discount_type" => $promo['discount_type'],
    "discount_value" => floatval($promo['discount_value']),
    "discount_amount" => $discount_amount,
    "original_total" => $order_amount,
    "final_total" => $final_total
]);

$stmt->close();
$conn->close();
?>
