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

// Determine target users based on broadcast type
$target_user_ids = [];

if ($broadcast_type === 'vip_only') {
    $bQuery = "SELECT DISTINCT user_id FROM bookings WHERE event_id = $event_id AND booking_status != 'Cancelled' AND (seat_tier LIKE '%VIP%' OR total_price >= 5000)";
    $res = $conn->query($bQuery);
    if ($res && $res->num_rows > 0) {
        while ($row = $res->fetch_assoc()) {
            $target_user_ids[] = intval($row['user_id']);
        }
    }
} else if ($broadcast_type === 'all_users') {
    $res = $conn->query("SELECT id FROM users WHERE role IN ('customer', 'user', 'organizer')");
    if ($res && $res->num_rows > 0) {
        while ($row = $res->fetch_assoc()) {
            $target_user_ids[] = intval($row['id']);
        }
    }
} else {
    // all_attendees or waiting_list default
    $bQuery = "SELECT DISTINCT user_id FROM bookings WHERE event_id = $event_id AND booking_status != 'Cancelled'";
    $res = $conn->query($bQuery);
    if ($res && $res->num_rows > 0) {
        while ($row = $res->fetch_assoc()) {
            $target_user_ids[] = intval($row['user_id']);
        }
    }
}

// Fallback: If no specific bookings for this event, target all customer users in system so notifications are delivered
if (empty($target_user_ids)) {
    $resAll = $conn->query("SELECT id FROM users WHERE role IN ('customer', 'user')");
    if ($resAll && $resAll->num_rows > 0) {
        while ($row = $resAll->fetch_assoc()) {
            $target_user_ids[] = intval($row['id']);
        }
    }
}

$sent_count = count($target_user_ids);

// Insert record into event_announcements
$stmt = $conn->prepare("INSERT INTO event_announcements (event_id, organizer_id, title, message, priority, broadcast_type, sent_count) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("iissssi", $event_id, $organizer_id, $title, $message, $priority, $broadcast_type, $sent_count);

if ($stmt->execute()) {
    $new_id = $stmt->insert_id;

    // Dispatch real in-app notification rows into notifications table
    $delivered_count = 0;
    $recipients_info = [];

    if (!empty($target_user_ids)) {
        $notif_type = $priority === 'emergency' ? 'urgent' : ($priority === 'urgent' ? 'warning' : 'info');
        $notif_msg = "📢 [" . strtoupper($priority) . "] " . $title . ": " . $message;

        $notifStmt = $conn->prepare("INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)");

        // Fetch user names for audit log
        $idList = implode(',', array_map('intval', $target_user_ids));
        $uRes = $conn->query("SELECT id, full_name, email FROM users WHERE id IN ($idList)");
        
        while ($uRow = $uRes->fetch_assoc()) {
            $u_id = intval($uRow['id']);
            $notifStmt->bind_param("iss", $u_id, $notif_msg, $notif_type);
            if ($notifStmt->execute()) {
                $delivered_count++;
                $recipients_info[] = [
                    "id" => $u_id,
                    "name" => $uRow['full_name'] ?: 'Customer #' . $u_id,
                    "email" => $uRow['email'] ?: 'user' . $u_id . '@eventease.com'
                ];
            }
        }
        $notifStmt->close();
    }

    // Get Event Title for response
    $evTitle = "Event #" . $event_id;
    $evRes = $conn->query("SELECT title FROM events WHERE id = $event_id");
    if ($evRes && $evRow = $evRes->fetch_assoc()) {
        $evTitle = $evRow['title'];
    }

    echo json_encode([
        "status" => "success",
        "message" => "Broadcast announcement successfully dispatched to " . $delivered_count . " recipients!",
        "id" => $new_id,
        "sent_count" => $sent_count,
        "delivered_count" => $delivered_count,
        "event_title" => $evTitle,
        "timestamp" => date("Y-m-d H:i:s"),
        "recipients" => array_slice($recipients_info, 0, 10)
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to dispatch broadcast: " . $conn->error]);
}

$stmt->close();
$conn->close();
?>
