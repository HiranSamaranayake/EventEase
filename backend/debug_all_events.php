<?php
require_once __DIR__ . '/config/database.php';

$res = $conn->query("SELECT id, title, status, event_date, organizer_id FROM events");
while ($r = $res->fetch_assoc()) {
    print_r($r);
}
?>
