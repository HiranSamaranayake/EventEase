<?php
require_once __DIR__ . '/config/database.php';

$res = $conn->query("SELECT id, user_id, organization_name FROM organizers");
while ($r = $res->fetch_assoc()) {
    echo "Org ID: " . $r['id'] . " | User ID: " . $r['user_id'] . " | Name: " . $r['organization_name'] . "\n";
}
?>
