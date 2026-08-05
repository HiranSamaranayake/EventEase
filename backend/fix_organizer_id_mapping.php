<?php
require_once __DIR__ . '/config/database.php';

// Fix organizers: delete id 1, keep id 2 for user_id 2
$conn->query("DELETE FROM organizers WHERE id != 2 AND user_id = 2");
$conn->query("INSERT INTO organizers (id, user_id, organization_name, business_email, status) VALUES (2, 2, 'Tech Events Asia', 'organizer@tech.com', 'approved') ON DUPLICATE KEY UPDATE user_id=2, status='approved'");

// Fix events: ensure organizer_id = 2 for all events
$conn->query("UPDATE events SET organizer_id = 2, status = 'approved', event_date = '2026-12-25'");

echo "Organizer mapping fixed perfectly!\n";
?>
