<?php
require_once __DIR__ . '/config/database.php';
$id = 16;
$query = "SELECT events.*, organizers.organization_name FROM events LEFT JOIN users ON events.organizer_id = users.id LEFT JOIN organizers ON users.id = organizers.user_id WHERE events.id = $id LIMIT 1";
$res = $conn->query($query);
if ($res) {
    print_r($res->fetch_assoc());
} else {
    echo "SQL error: " . $conn->error;
}
?>
