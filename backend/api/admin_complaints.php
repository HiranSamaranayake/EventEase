<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/database.php';

$query = "SELECT c.*, u.full_name as user_name, u.email as user_email, e.title as event_title, r.full_name as resolver_name
          FROM complaints c 
          LEFT JOIN users u ON c.user_id = u.id 
          LEFT JOIN events e ON c.event_id = e.id 
          LEFT JOIN users r ON c.resolved_by = r.id 
          ORDER BY FIELD(c.status, 'open', 'in_progress', 'resolved', 'dismissed'), c.created_at DESC";

$result = $conn->query($query);

$complaints = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $complaints[] = $row;
    }
}

// Quick stats summary
$stats = [
    "total" => count($complaints),
    "open" => 0,
    "in_progress" => 0,
    "resolved" => 0,
    "dismissed" => 0
];

foreach ($complaints as $c) {
    if (isset($stats[$c['status']])) {
        $stats[$c['status']]++;
    }
}

echo json_encode(["status" => "success", "stats" => $stats, "data" => $complaints]);
$conn->close();
?>
