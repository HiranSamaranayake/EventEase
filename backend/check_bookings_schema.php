<?php
require_once __DIR__ . '/config/database.php';
$res = $conn->query("SHOW COLUMNS FROM bookings");
if ($res) {
    while ($row = $res->fetch_assoc()) {
        echo $row['Field'] . " (" . $row['Type'] . ")\n";
    }
} else {
    echo "Error: " . $conn->error;
}
?>
