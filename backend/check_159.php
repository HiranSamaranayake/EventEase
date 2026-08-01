<?php

require_once __DIR__ . "/config/database.php";

echo "=== BOOKING 159 ===" . PHP_EOL;
$bRes = mysqli_query($conn, "SELECT * FROM bookings WHERE id=159");
if ($bRes) {
    print_r(mysqli_fetch_assoc($bRes));
}

echo PHP_EOL . "=== TICKETS FOR BOOKING 159 OR ID 159 ===" . PHP_EOL;
$tRes = mysqli_query($conn, "SELECT * FROM tickets WHERE booking_id=159 OR id=159");
if ($tRes) {
    while ($r = mysqli_fetch_assoc($tRes)) {
        print_r($r);
    }
}

echo PHP_EOL . "=== LATEST 5 BOOKINGS & TICKETS ===" . PHP_EOL;
$lRes = mysqli_query($conn, "SELECT bookings.id AS booking_id, tickets.id AS ticket_id, tickets.ticket_code, tickets.qr_code FROM bookings LEFT JOIN tickets ON bookings.id = tickets.booking_id ORDER BY bookings.id DESC LIMIT 5");
if ($lRes) {
    while ($r = mysqli_fetch_assoc($lRes)) {
        print_r($r);
    }
}
