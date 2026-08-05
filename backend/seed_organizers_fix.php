<?php
require_once __DIR__ . '/config/database.php';

// Insert users
$conn->query("INSERT IGNORE INTO users (id, full_name, email, phone, password, role) VALUES 
(2, 'Tech Events Asia', 'organizer@tech.com', '0771234567', '$2y$10$3yJP/UXffrUO9pErPOkxp.pWboYL7fLhqP/E/F4cWH/4fq1FVuaV6', 'organizer'),
(5, 'Yumeth Events', 'organizer2@tech.com', '0777654321', '$2y$10$3yJP/UXffrUO9pErPOkxp.pWboYL7fLhqP/E/F4cWH/4fq1FVuaV6', 'organizer')");

// Insert organizers
$conn->query("INSERT INTO organizers (id, user_id, organization_name, business_email, status) VALUES 
(1, 2, 'Tech Events Asia', 'organizer@tech.com', 'approved'),
(2, 2, 'Tech Events Asia', 'organizer@tech.com', 'approved'),
(5, 5, 'Yumeth Events', 'organizer2@tech.com', 'approved')
ON DUPLICATE KEY UPDATE user_id = VALUES(user_id), status = 'approved'");

// Update events to organizer_id 2 or 1
$conn->query("UPDATE events SET organizer_id = 2, status = 'approved', event_date = '2026-12-25', available_seats = 500, capacity = 500, is_sold_out = 0");

echo "Organizers table seeded & restored successfully!\n";
?>
