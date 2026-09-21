<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

$event_id = isset($data['event_id']) ? intval($data['event_id']) : 0;
$organizer_id = isset($data['organizer_id']) ? intval($data['organizer_id']) : 0;
$title = isset($data['title']) ? trim($data['title']) : '';
$message = isset($data['message']) ? trim($data['message']) : (isset($data['content']) ? trim($data['content']) : '');
$priority = isset($data['priority']) ? trim($data['priority']) : 'normal';
$broadcast_type = isset($data['broadcast_type']) ? trim($data['broadcast_type']) : 'all_attendees';

if (empty($title) || empty($message)) {
    echo json_encode(["status" => "error", "message" => "Announcement Title and Message Body are required."]);
    exit;
}

// Determine target users strictly based on selected broadcast type
$target_user_ids = [];

if ($broadcast_type === 'vip_only') {
    // Only VIP ticket holders or Premium users for this specific event
    $bQuery = "SELECT DISTINCT b.user_id 
               FROM bookings b
               LEFT JOIN event_booked_seats s ON b.id = s.booking_id
               LEFT JOIN users u ON b.user_id = u.id
               WHERE b.event_id = $event_id 
                 AND b.user_id IS NOT NULL 
                 AND (b.payment_status IS NULL OR b.payment_status != 'Cancelled') 
                 AND (b.booking_status IS NULL OR b.booking_status != 'Cancelled') 
                 AND (s.tier_name LIKE '%VIP%' OR s.tier_name LIKE '%vip%' OR u.user_tier = 'premium' OR u.user_tier = 'vip' OR b.total_amount >= 5000)";
    $res = $conn->query($bQuery);
    if ($res && $res->num_rows > 0) {
        while ($row = $res->fetch_assoc()) {
            if (!empty($row['user_id'])) {
                $target_user_ids[] = intval($row['user_id']);
            }
        }
    }
} else if ($broadcast_type === 'waiting_list') {
    // Only users on the waiting list for this specific event
    $wQuery = "SELECT DISTINCT user_id FROM waiting_list 
               WHERE event_id = $event_id 
                 AND user_id IS NOT NULL 
                 AND (status IS NULL OR status = 'waiting' OR status = 'active')";
    $res = $conn->query($wQuery);
    if ($res && $res->num_rows > 0) {
        while ($row = $res->fetch_assoc()) {
            if (!empty($row['user_id'])) {
                $target_user_ids[] = intval($row['user_id']);
            }
        }
    }
} else if ($broadcast_type === 'all_users') {
    // All system customer users
    $res = $conn->query("SELECT id FROM users WHERE role IN ('customer', 'user')");
    if ($res && $res->num_rows > 0) {
        while ($row = $res->fetch_assoc()) {
            $target_user_ids[] = intval($row['id']);
        }
    }
} else {
    // Default: all_attendees for this specific event
    $bQuery = "SELECT DISTINCT user_id FROM bookings 
               WHERE event_id = $event_id 
                 AND user_id IS NOT NULL 
                 AND (payment_status IS NULL OR payment_status != 'Cancelled') 
                 AND (booking_status IS NULL OR booking_status != 'Cancelled')";
    $res = $conn->query($bQuery);
    if ($res && $res->num_rows > 0) {
        while ($row = $res->fetch_assoc()) {
            if (!empty($row['user_id'])) {
                $target_user_ids[] = intval($row['user_id']);
            }
        }
    }
}

// Remove duplicates
$target_user_ids = array_values(array_unique($target_user_ids));
$sent_count = count($target_user_ids);

// Insert record into event_announcements log
$stmt = $conn->prepare("INSERT INTO event_announcements (event_id, organizer_id, title, message, priority, broadcast_type, sent_count) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("iissssi", $event_id, $organizer_id, $title, $message, $priority, $broadcast_type, $sent_count);

if ($stmt->execute()) {
    $new_id = $stmt->insert_id;

    // Dispatch in-app notifications only to target_user_ids
    $delivered_count = 0;
    $recipients_info = [];

    if (!empty($target_user_ids)) {
        $notif_type = $priority === 'emergency' ? 'urgent' : ($priority === 'urgent' ? 'warning' : 'info');
        $notif_msg = "📢 [" . strtoupper($priority) . "] " . $title . ": " . $message;

        $notifStmt = $conn->prepare("INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)");

        // Fetch user details for recipients info audit log
        $idList = implode(',', array_map('intval', $target_user_ids));
        $uRes = $conn->query("SELECT id, full_name, email FROM users WHERE id IN ($idList)");
        
        if ($uRes) {
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
        }
        $notifStmt->close();
    }

    // Get Event Title for response
    $evTitle = "Event #" . $event_id;
    if ($event_id > 0) {
        $evRes = $conn->query("SELECT title FROM events WHERE id = $event_id");
        if ($evRes && $evRow = $evRes->fetch_assoc()) {
            $evTitle = $evRow['title'];
        }
    }

    $broadcastLabelMap = [
        'all_attendees' => 'All Ticket Holders',
        'vip_only' => 'VIP Ticket Holders Only',
        'waiting_list' => 'Waiting List Members Only',
        'all_users' => 'All System Customers'
    ];
    $targetLabel = isset($broadcastLabelMap[$broadcast_type]) ? $broadcastLabelMap[$broadcast_type] : $broadcast_type;

    $responseMsg = $delivered_count > 0 
        ? "Broadcast announcement successfully dispatched to " . $delivered_count . " recipients (" . $targetLabel . ")!"
        : "Announcement recorded. No active users matched the target group (" . $targetLabel . ") for this event.";

    echo json_encode([
        "status" => "success",
        "message" => $responseMsg,
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
