<?php
require_once __DIR__ . '/config/database.php';

// Ensure user 2 exists with role organizer
$conn->query("INSERT IGNORE INTO users (id, full_name, email, phone, password, role) VALUES (2, 'Tech Events Asia', 'organizer@tech.com', '0771234567', '$2y$10$3yJP/UXffrUO9pErPOkxp.pWboYL7fLhqP/E/F4cWH/4fq1FVuaV6', 'organizer')");
$conn->query("UPDATE users SET role = 'organizer' WHERE id = 2");

// Ensure organizer 2 exists with user_id = 2
$conn->query("DELETE FROM organizers WHERE id = 2 OR user_id = 2");
$conn->query("INSERT INTO organizers (id, user_id, organization_name, business_email, status) VALUES (2, 2, 'Tech Events Asia', 'organizer@tech.com', 'approved')");

// Ensure all events belong to organizer_id 2
$conn->query("UPDATE events SET organizer_id = 2, event_date = '2026-12-25', available_seats = 500, capacity = 500, is_sold_out = 0, audience_restriction_type = NULL, restriction_label = NULL");

// Ensure event schedules, promos, seating configs exist for event 16
$conn->query("INSERT IGNORE INTO event_schedules (event_id, session_title, start_time, end_time, hall_stage, speaker_performer, description) VALUES (16, 'Opening Keynote & Tech Roadmap', '2026-12-25 09:00:00', '2026-12-25 11:00:00', 'Main Stage Hall A', 'Dr. Aruni Silva', 'Keynote address on AI & Web Development')");
$conn->query("INSERT IGNORE INTO promo_codes (organizer_id, code, discount_type, discount_value, max_uses, current_uses, valid_until, is_active) VALUES (2, 'PLAY20TEST', 'percentage', 20, 100, 0, '2026-12-31', 1)");

echo "Database schema & relationships synced perfectly!\n";
?>
