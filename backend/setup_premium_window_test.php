<?php
require_once 'c:/xampp/htdocs/EventEase/backend/config/database.php';

// Event #901: Phase 1 (Before Premium Booking Opens) -> Premium Date: 2026-12-01, Normal Date: 2026-12-02
$check1 = mysqli_query($conn, "SELECT id FROM events WHERE id = 901");
if (!$check1 || mysqli_num_rows($check1) == 0) {
    mysqli_query($conn, "INSERT INTO events (id, title, description, event_date, premium_booking_open_date, normal_booking_open_date, location, capacity, price, organizer_id, status)
        VALUES (901, 'Phase 1 Future Festival 2026', 'Phase 1 test event where booking is closed for everyone', '2026-12-25 18:00:00', '2026-12-01 00:00:00', '2026-12-02 00:00:00', 'Lotus Tower', 500, 2500.00, 2, 'approved')");
} else {
    mysqli_query($conn, "UPDATE events SET event_date = '2026-12-25 18:00:00', premium_booking_open_date = '2026-12-01 00:00:00', normal_booking_open_date = '2026-12-02 00:00:00', title = 'Phase 1 Future Festival 2026' WHERE id = 901");
}

// Event #902: Phase 2 (Premium Only Period) -> Premium Date: 2026-08-01, Normal Date: 2026-12-01
$check2 = mysqli_query($conn, "SELECT id FROM events WHERE id = 902");
if (!$check2 || mysqli_num_rows($check2) == 0) {
    mysqli_query($conn, "INSERT INTO events (id, title, description, event_date, premium_booking_open_date, normal_booking_open_date, location, capacity, price, organizer_id, status)
        VALUES (902, 'Phase 2 Premium Exclusive Gala 2026', 'Phase 2 test event open only for Premium customers right now', '2026-12-25 18:00:00', '2026-08-01 00:00:00', '2026-12-01 00:00:00', 'BMICH Arena', 500, 3000.00, 2, 'approved')");
} else {
    mysqli_query($conn, "UPDATE events SET event_date = '2026-12-25 18:00:00', premium_booking_open_date = '2026-08-01 00:00:00', normal_booking_open_date = '2026-12-01 00:00:00', title = 'Phase 2 Premium Exclusive Gala 2026' WHERE id = 902");
}

// Event #903: Phase 3 (General Booking Open) -> Premium Date: 2026-08-01, Normal Date: 2026-08-02
$check3 = mysqli_query($conn, "SELECT id FROM events WHERE id = 903");
if (!$check3 || mysqli_num_rows($check3) == 0) {
    mysqli_query($conn, "INSERT INTO events (id, title, description, event_date, premium_booking_open_date, normal_booking_open_date, location, capacity, price, organizer_id, status)
        VALUES (903, 'Phase 3 Open Gala 2026', 'Phase 3 test event open for both Premium and General customers', '2026-12-25 18:00:00', '2026-08-01 00:00:00', '2026-08-02 00:00:00', 'Nelum Pokuna', 500, 1800.00, 2, 'approved')");
} else {
    mysqli_query($conn, "UPDATE events SET event_date = '2026-12-25 18:00:00', premium_booking_open_date = '2026-08-01 00:00:00', normal_booking_open_date = '2026-08-02 00:00:00', title = 'Phase 3 Open Gala 2026' WHERE id = 903");
}

echo "Setup test events #901, #902, #903 successfully.\n";
?>
