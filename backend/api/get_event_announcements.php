<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/database.php';

$event_id = isset($_GET['event_id']) ? intval($_GET['event_id']) : 0;
$organizer_id = isset($_GET['organizer_id']) ? intval($_GET['organizer_id']) : 0;

$sql = "SELECT a.*, e.title as event_title 
        FROM event_announcements a 
        LEFT JOIN events e ON a.event_id = e.id 
        WHERE 1=1";

if ($event_id > 0) {
    $sql .= " AND a.event_id = " . $event_id;
}
if ($organizer_id > 0) {
    $sql .= " AND a.organizer_id = " . $organizer_id;
}
$sql .= " ORDER BY a.id DESC";

$result = $conn->query($sql);
$announcements = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $announcements[] = $row;
    }
}

echo json_encode(["status" => "success", "data" => $announcements]);
$conn->close();
?>
