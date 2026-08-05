<?php
require_once __DIR__ . '/config/database.php';
$conn->query("UPDATE events SET event_date = '2026-12-25', available_seats = 500, capacity = 500, is_sold_out = 0, audience_restriction_type = NULL, restriction_label = NULL");
echo "All events updated cleanly!\n";
?>
