<?php
require_once __DIR__ . '/config/database.php';
$res = $conn->query("SELECT * FROM organizers");
while ($r = $res->fetch_assoc()) {
    print_r($r);
}
?>
