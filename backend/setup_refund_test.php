<?php
ob_start();
header("Content-Type: application/json");
require_once __DIR__ . "/config/database.php";

$now = date('Y-m-d H:i:s');
$premOpen = date('Y-m-d H:i:s', strtotime('-10 days'));
$normOpen = date('Y-m-d H:i:s', strtotime('-9 days'));

// Ensure test user 9999 exists
@$conn->query("INSERT IGNORE INTO users (id, full_name, email, password, role) VALUES (9999, 'Test Refund User', 'refunduser@test.com', 'password123', 'customer')");

$userQuery = @$conn->query("SELECT id FROM users LIMIT 1");
$userRow = $userQuery ? $userQuery->fetch_assoc() : null;
$validUserId = intval($userRow['id'] ?? 9999);

// Delete dependent rows first using event_id subquery to satisfy foreign key constraints
@$conn->query("DELETE FROM tickets WHERE booking_id IN (SELECT id FROM bookings WHERE event_id IN (997, 996))");
@$conn->query("DELETE FROM payments WHERE booking_id IN (SELECT id FROM bookings WHERE event_id IN (997, 996))");
@$conn->query("DELETE FROM event_booked_seats WHERE event_id IN (997, 996)");
@$conn->query("DELETE FROM bookings WHERE event_id IN (997, 996)");
@$conn->query("DELETE FROM events WHERE id IN (997, 996)");

// Event 997: Upcoming Event with open booking dates
@$conn->query("
INSERT INTO events (id, title, description, event_date, premium_booking_open_date, normal_booking_open_date, location, capacity, price, category, status, organizer_id)
VALUES (997, 'Upcoming Refund Test Event', 'Test event for ticket refund', '2026-12-30', '$premOpen', '$normOpen', 'City Arena', 100, 1500.00, 'Music', 'approved', 2)
");

// Event 996: Past Event
@$conn->query("
INSERT INTO events (id, title, description, event_date, premium_booking_open_date, normal_booking_open_date, location, capacity, price, category, status, organizer_id)
VALUES (996, 'Past Refund Test Event', 'Test event that already ended', '2024-01-01', '$premOpen', '$normOpen', 'Old Hall', 100, 1500.00, 'Music', 'approved', 2)
");

// Booking 887 for Upcoming Event 997
@$conn->query("
INSERT INTO bookings (id, user_id, event_id, ticket_quantity, total_amount, payment_status, booking_status)
VALUES (887, '$validUserId', 997, 1, 1500.00, 'Paid', 'Confirmed')
");

// Seat reservation for Booking 887
@$conn->query("
INSERT INTO event_booked_seats (event_id, booking_id, seat_code, tier_name, price, user_id)
VALUES (997, 887, 'A-101', 'Standard', 1500.00, '$validUserId')
");

// Booking 886 for Past Event 996
@$conn->query("
INSERT INTO bookings (id, user_id, event_id, ticket_quantity, total_amount, payment_status, booking_status)
VALUES (886, '$validUserId', 996, 1, 1500.00, 'Paid', 'Confirmed')
");

ob_end_clean();
echo json_encode(["success" => true, "user_id" => $validUserId, "message" => "Test setup for refund functionality completed"]);
?>
