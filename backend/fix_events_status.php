<?php
require_once __DIR__ . '/config/database.php';

$conn->query("UPDATE events SET status = 'approved', event_date = '2026-12-25', available_seats = 500, capacity = 500, is_sold_out = 0");
echo "All events set to approved and upcoming (2026-12-25).\n";
?>
