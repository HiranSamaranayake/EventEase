<?php
require_once __DIR__ . '/config/database.php';

$res = $conn->query("SELECT id, title, status, organizer_id, event_date FROM events");
while ($r = $res->fetch_assoc()) {
    echo "ID: " . $r['id'] . " | Title: " . $r['title'] . " | Status: " . $r['status'] . " | OrgID: " . $r['organizer_id'] . " | Date: " . $r['event_date'] . "\n";
}
?>
