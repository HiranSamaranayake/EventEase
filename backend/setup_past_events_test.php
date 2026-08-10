<?php
require_once 'c:/xampp/htdocs/EventEase/backend/config/database.php';

// 1. Ensure Past Event #888 exists with a past date (2024-05-15)
$pCheck = mysqli_query($conn, "SELECT id FROM events WHERE id = 888");
if (!$pCheck || mysqli_num_rows($pCheck) == 0) {
    mysqli_query($conn, "INSERT INTO events (id, title, description, event_date, premium_booking_open_date, normal_booking_open_date, location, capacity, price, organizer_id, status)
        VALUES (888, 'Past Test Musical Gala 2024', 'An event that took place in the past', '2024-05-15 18:00:00', '2024-05-01 00:00:00', '2024-05-02 00:00:00', 'Colombo City Hall', 500, 1500.00, 2, 'approved')");
} else {
    mysqli_query($conn, "UPDATE events SET event_date = '2024-05-15 18:00:00', title = 'Past Test Musical Gala 2024' WHERE id = 888");
}

// 2. Ensure Future Event #889 exists with a future date (2026-12-15)
$fCheck = mysqli_query($conn, "SELECT id FROM events WHERE id = 889");
if (!$fCheck || mysqli_num_rows($fCheck) == 0) {
    mysqli_query($conn, "INSERT INTO events (id, title, description, event_date, premium_booking_open_date, normal_booking_open_date, location, capacity, price, organizer_id, status)
        VALUES (889, 'Future Tech Summit 2026', 'An upcoming future event', '2026-12-15 18:00:00', '2026-08-01 00:00:00', '2026-08-02 00:00:00', 'Lotus Tower Arena', 500, 2000.00, 2, 'approved')");
} else {
    mysqli_query($conn, "UPDATE events SET event_date = '2026-12-15 18:00:00', title = 'Future Tech Summit 2026' WHERE id = 889");
}

echo "Past Event #888 and Future Event #889 configured successfully.\n";
?>
