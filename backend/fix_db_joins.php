<?php
require_once __DIR__ . '/config/database.php';

// Ensure user 2 exists
$conn->query("INSERT INTO users (id, full_name, email, phone, password, role) VALUES (2, 'Tech Events Asia', 'organizer@tech.com', '0771234567', '$2y$10$3yJP/UXffrUO9pErPOkxp.pWboYL7fLhqP/E/F4cWH/4fq1FVuaV6', 'organizer') ON DUPLICATE KEY UPDATE role='organizer', full_name='Tech Events Asia'");

// Ensure organizer 2 exists and points to user_id 2
$conn->query("INSERT INTO organizers (id, user_id, organization_name, business_email, status) VALUES (2, 2, 'Tech Events Asia', 'organizer@tech.com', 'approved') ON DUPLICATE KEY UPDATE user_id=2, status='approved'");

// Ensure all events belong to organizer_id 2 and are approved
$conn->query("UPDATE events SET organizer_id = 2, status = 'approved', event_date = '2026-12-25'");

echo "DB JOINS FIXED CLEANLY!\n";
?>
