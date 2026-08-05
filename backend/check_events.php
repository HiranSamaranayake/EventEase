<?php
require_once __DIR__ . '/config/database.php';
$res = $conn->query("SELECT e.id, e.title, e.organizer_id FROM events e JOIN organizers o ON e.organizer_id = o.id WHERE o.user_id = 2");
while ($r = $res->fetch_assoc()) {
    echo "Event ID: " . $r['id'] . " | Title: " . $r['title'] . " | Organizer ID: " . $r['organizer_id'] . "\n";
}
?>
