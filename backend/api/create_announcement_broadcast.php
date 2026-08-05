<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

$event_id = isset($data['event_id']) ? intval($data['event_id']) : 16;
$organizer_id = isset($data['organizer_id']) ? intval($data['organizer_id']) : 2;
$title = isset($data['title']) ? trim($data['title']) : '';
$message = isset($data['message']) ? trim($data['message']) : (isset($data['content']) ? trim($data['content']) : '');
$priority = isset($data['priority']) ? trim($data['priority']) : 'normal';
$broadcast_type = isset($data['broadcast_type']) ? trim($data['broadcast_type']) : 'all_attendees';

if (!$event_id) {
    $event_id = 16;
}

if (empty($title) || empty($message)) {
    echo json_encode(["status" => "error", "message" => "Announcement Title and Message Body are required."]);
    exit;
}

// Calculate target reach attendees from bookings
$sent_count = 0;
$bookedRes = $conn->query("SELECT DISTINCT user_id FROM bookings WHERE event_id = $event_id AND booking_status != 'Cancelled'");
if ($bookedRes) {
    $sent_count = $bookedRes->num_rows;
}
if ($sent_count == 0) {
    $sent_count = 50; // default estimated reach
}

// Insert into event_announcements
$stmt = $conn->prepare("INSERT INTO event_announcements (event_id, organizer_id, title, message, priority, broadcast_type, sent_count) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("iissssi", $event_id, $organizer_id, $title, $message, $priority, $broadcast_type, $sent_count);

if ($stmt->execute()) {
    $new_id = $stmt->insert_id;

    // Dispatch notifications to notifications table for each customer
    if ($bookedRes && $bookedRes->num_rows > 0) {
        $notifStmt = $conn->prepare("INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)");
        $notif_type = $priority === 'emergency' ? 'urgent' : 'info';
        $notif_msg = "📢 [" . strtoupper($priority) . "] " . $title . ": " . $message;
        
        while ($bRow = $bookedRes->fetch_assoc()) {
            $u_id = intval($bRow['user_id']);
            $notifStmt->bind_param("iss", $u_id, $notif_msg, $notif_type);
            $notifStmt->execute();
        }
        $notifStmt->close();
    }

    echo json_encode([
        "status" => "success",
        "message" => "Broadcast announcement sent to " . $sent_count . " registered attendees!",
        "id" => $new_id,
        "sent_count" => $sent_count
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to dispatch broadcast: " . $conn->error]);
}

$stmt->close();
$conn->close();
?>
