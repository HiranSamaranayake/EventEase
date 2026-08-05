<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/database.php';

$event_id = isset($_GET['event_id']) ? intval($_GET['event_id']) : 0;
$organizer_id = isset($_GET['organizer_id']) ? intval($_GET['organizer_id']) : 0;

$sql = "SELECT s.*, e.title as event_title 
        FROM event_seating_configs s 
        LEFT JOIN events e ON s.event_id = e.id 
        WHERE 1=1";

if ($event_id > 0) {
    $sql .= " AND s.event_id = " . $event_id;
}
if ($organizer_id > 0) {
    $sql .= " AND s.organizer_id = " . $organizer_id;
}
$sql .= " ORDER BY s.id ASC";

$result = $conn->query($sql);
$configs = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $configs[] = $row;
    }
}

echo json_encode(["status" => "success", "data" => $configs]);
$conn->close();
?>
