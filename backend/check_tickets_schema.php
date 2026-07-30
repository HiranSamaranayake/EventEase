<?php

require_once __DIR__ . "/config/database.php";

echo "=== COLUMNS IN TICKETS TABLE ===" . PHP_EOL;
$res = mysqli_query($conn, "SHOW COLUMNS FROM tickets");
if ($res) {
    while ($r = mysqli_fetch_assoc($res)) {
        echo $r['Field'] . " (" . $r['Type'] . ")" . PHP_EOL;
    }
}
