<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/database.php';

$organizer_id = isset($_GET['organizer_id']) ? intval($_GET['organizer_id']) : 0;
$event_id = isset($_GET['event_id']) ? intval($_GET['event_id']) : 0;

$where = [];
$params = [];
$types = "";

if ($organizer_id > 0) {
    $where[] = "(organizer_id = ? OR organizer_id IS NULL)";
    $params[] = $organizer_id;
    $types .= "i";
}

if ($event_id > 0) {
    $where[] = "(event_id = ? OR event_id IS NULL)";
    $params[] = $event_id;
    $types .= "i";
}

$sql = "SELECT p.*, e.title as event_title 
        FROM promo_codes p 
        LEFT JOIN events e ON p.event_id = e.id";

if (!empty($where)) {
    $sql .= " WHERE " . implode(" AND ", $where);
}
$sql .= " ORDER BY p.id DESC";

$stmt = $conn->prepare($sql);
if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}
$stmt->execute();
$result = $stmt->get_result();

$promos = [];
while ($row = $result->fetch_assoc()) {
    $promos[] = $row;
}

echo json_encode(["status" => "success", "data" => $promos]);
$stmt->close();
$conn->close();
?>
