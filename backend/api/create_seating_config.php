<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

$event_id = isset($data['event_id']) ? intval($data['event_id']) : 0;
$organizer_id = isset($data['organizer_id']) ? intval($data['organizer_id']) : 2;
$section_name = isset($data['section_name']) ? trim($data['section_name']) : '';
$total_rows = isset($data['total_rows']) ? intval($data['total_rows']) : 5;
$seats_per_row = isset($data['seats_per_row']) ? intval($data['seats_per_row']) : 10;
$ticket_price = isset($data['ticket_price']) ? floatval($data['ticket_price']) : 0.00;
$color_code = isset($data['color_code']) ? trim($data['color_code']) : '#8b5cf6';
$perks_description = isset($data['perks_description']) ? trim($data['perks_description']) : '';

if (!$event_id) {
    // Default to event 16 if not passed
    $event_id = 16;
}

if (empty($section_name) || $ticket_price < 0) {
    echo json_encode(["status" => "error", "message" => "Section Name and Ticket Price are required."]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO event_seating_configs (event_id, organizer_id, section_name, total_rows, seats_per_row, ticket_price, color_code, perks_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("iisiidss", $event_id, $organizer_id, $section_name, $total_rows, $seats_per_row, $ticket_price, $color_code, $perks_description);

if ($stmt->execute()) {
    $new_id = $stmt->insert_id;
    echo json_encode(["status" => "success", "message" => "Seating section '" . $section_name . "' created successfully!", "id" => $new_id]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to save seating section: " . $conn->error]);
}
$stmt->close();
$conn->close();
?>
