<?php
require_once __DIR__ . '/config/database.php';

// Fix users table for user 2
$conn->query("INSERT IGNORE INTO users (id, full_name, email, phone, password, role) VALUES (2, 'Tech Events Asia', 'organizer@tech.com', '0771234567', '$2y$10$3yJP/UXffrUO9pErPOkxp.pWboYL7fLhqP/E/F4cWH/4fq1FVuaV6', 'organizer')");
$conn->query("UPDATE users SET role = 'organizer' WHERE id = 2");

// Fix organizers table for user_id 2
$res = $conn->query("SELECT id FROM organizers WHERE user_id = 2");
if ($res->num_rows == 0) {
    $conn->query("INSERT INTO organizers (id, user_id, organization_name, business_email, status) VALUES (2, 2, 'Tech Events Asia', 'organizer@tech.com', 'approved') ON DUPLICATE KEY UPDATE user_id = 2, status = 'approved'");
} else {
    $conn->query("UPDATE organizers SET status = 'approved' WHERE user_id = 2");
}

// Fix events table for organizer_id 2
$conn->query("UPDATE events SET organizer_id = 2, event_date = '2026-12-25', available_seats = 500, capacity = 500, is_sold_out = 0, audience_restriction_type = NULL, restriction_label = NULL");

echo "Organizer user_id = 2 mapping fixed!\n";
?>
