<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/database.php';

$status_filter = isset($_GET['status']) ? trim($_GET['status']) : 'all';

$sql = "SELECT p.*, e.title as event_title, u.full_name as organizer_name, u.email as organizer_email 
        FROM organizer_payouts p 
        LEFT JOIN events e ON p.event_id = e.id 
        LEFT JOIN users u ON p.organizer_id = u.id";

if ($status_filter !== 'all') {
    $sql .= " WHERE p.status = '" . $conn->real_escape_string($status_filter) . "'";
}
$sql .= " ORDER BY p.id DESC";

$result = $conn->query($sql);
$payouts = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $payouts[] = $row;
    }
}

echo json_encode(["status" => "success", "data" => $payouts]);
$conn->close();
?>
