<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    http_response_code(200);
    exit();
}

require_once "../config/database.php";

$user_id = intval($_GET['user_id'] ?? 0);
$booking_id = intval($_GET['booking_id'] ?? 0);

$where = "WHERE 1=1";
if ($user_id > 0) {
    $where .= " AND user_id = '$user_id'";
}
if ($booking_id > 0) {
    $where .= " AND (booking_id = '$booking_id' OR body_html LIKE '%Booking ID : " . $booking_id . "%' OR body_html LIKE '%EVT-" . $booking_id . "-%' OR body_html LIKE '%booking_id=" . $booking_id . "%')";
}

$sql = "SELECT id, user_id, recipient_email, subject, body_html, status, created_at
        FROM email_logs
        $where
        ORDER BY id DESC
        LIMIT 20";

$res = mysqli_query($conn, $sql);
$logs = [];

if ($res) {
    while ($row = mysqli_fetch_assoc($res)) {
        $logs[] = $row;
    }
}

echo json_encode([
    "success" => true,
    "email_logs" => $logs
]);
?>
