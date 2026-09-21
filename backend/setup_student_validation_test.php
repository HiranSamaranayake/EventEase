<?php
ob_start();
header("Content-Type: application/json");
require_once __DIR__ . "/config/database.php";

$now = date('Y-m-d H:i:s');
$premOpen = date('Y-m-d H:i:s', strtotime('-10 days'));
$normOpen = date('Y-m-d H:i:s', strtotime('-9 days'));

// Ensure a valid customer user exists
@$conn->query("INSERT IGNORE INTO users (id, full_name, email, password, role) VALUES (9999, 'Test Student User', 'teststudent@std.uwu.ac.lk', 'password123', 'customer')");

$userQuery = @$conn->query("SELECT id FROM users LIMIT 1");
$userRow = $userQuery ? $userQuery->fetch_assoc() : null;
$validUserId = intval($userRow['id'] ?? 9999);

// Clear previous test entries respecting foreign key order
@$conn->query("DELETE FROM tickets WHERE booking_id IN (SELECT id FROM bookings WHERE event_id IN (998, 999))");
@$conn->query("DELETE FROM payments WHERE booking_id IN (SELECT id FROM bookings WHERE event_id IN (998, 999))");
@$conn->query("DELETE FROM event_booked_seats WHERE event_id IN (998, 999)");
@$conn->query("DELETE FROM bookings WHERE event_id IN (998, 999)");
@$conn->query("DELETE FROM events WHERE id IN (998, 999)");

// Insert or replace test event 998 (Restricted to University Students Only)
@$conn->query("
INSERT INTO events (id, title, description, event_date, premium_booking_open_date, normal_booking_open_date, location, capacity, price, category, status, organizer_id, audience_restriction_type, allowed_email_domain, audience_passcode, restriction_label)
VALUES (998, 'Campus Tech Fest 2026', 'Restricted event for university students only', '2026-12-30', '$premOpen', '$normOpen', 'University Auditorium', 500, 1000.00, 'Technology', 'approved', 2, 'university_students', 'ac.lk, edu.lk, std.uwu.ac.lk', 'UNI2026', 'University Students Only')
");

// Insert or replace test event 999 (Public Event)
@$conn->query("
INSERT INTO events (id, title, description, event_date, premium_booking_open_date, normal_booking_open_date, location, capacity, price, category, status, organizer_id, audience_restriction_type, allowed_email_domain, audience_passcode, restriction_label)
VALUES (999, 'Open Music Concert 2026', 'Public music event open to all attendees', '2026-12-30', '$premOpen', '$normOpen', 'City Stadium', 1000, 2500.00, 'Music', 'approved', 2, 'public', NULL, NULL, NULL)
");

ob_end_clean();
echo json_encode(["success" => true, "user_id" => $validUserId, "message" => "Test events 998 and 999 set up successfully"]);
?>
