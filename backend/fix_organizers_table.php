<?php
require_once __DIR__ . '/config/database.php';

$res = $conn->query("SELECT id FROM organizers WHERE user_id = 2 OR id = 2");
if ($res->num_rows == 0) {
    $conn->query("INSERT INTO organizers (id, user_id, organization_name, business_email, status) VALUES (2, 2, 'Tech Events Asia', 'organizer@tech.com', 'approved')");
} else {
    $conn->query("UPDATE organizers SET user_id = 2, status = 'approved' WHERE id = 1 OR id = 2");
}

// Ensure events 16, 17, 1 belong to organizer_id 2 or 1
$conn->query("UPDATE events SET organizer_id = 2 WHERE id = 16 OR id = 17 OR id = 1");

echo "Organizers table and event organizer mapping fixed!\n";
?>
