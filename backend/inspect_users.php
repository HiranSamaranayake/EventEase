<?php
require_once __DIR__ . '/config/database.php';

$res = $conn->query("SELECT id, full_name, role FROM users");
while ($r = $res->fetch_assoc()) {
    echo "User ID: " . $r['id'] . " | Name: " . $r['full_name'] . " | Role: " . $r['role'] . "\n";
}
?>
