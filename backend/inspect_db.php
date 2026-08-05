<?php
require_once __DIR__ . '/config/database.php';

$res = $conn->query("SELECT id, title, organizer_id FROM events");
while ($r = $res->fetch_assoc()) {
    echo "ID: " . $r['id'] . " | Title: " . $r['title'] . " | OrgID: " . $r['organizer_id'] . "\n";
}
?>
