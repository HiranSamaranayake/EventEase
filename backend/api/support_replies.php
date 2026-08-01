<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $ticket_id = intval($_GET['ticket_id'] ?? 0);
    if (!$ticket_id) {
        echo json_encode(["success" => false, "message" => "Ticket ID required."]);
        exit();
    }

    $stmt = $conn->prepare("SELECT str.*, u.full_name as sender_name, u.role as sender_role, COALESCE(a.admin_role, 'super_admin') as sender_admin_role
                            FROM support_ticket_replies str
                            LEFT JOIN users u ON str.sender_id = u.id
                            LEFT JOIN admins a ON str.sender_id = a.user_id
                            WHERE str.ticket_id = ?
                            ORDER BY str.created_at ASC");
    $stmt->bind_param("i", $ticket_id);
    $stmt->execute();
    $res = $stmt->get_result();
    $replies = [];
    while ($row = $res->fetch_assoc()) {
        $replies[] = $row;
    }
    echo json_encode(["success" => true, "data" => $replies]);
    exit();
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $ticket_id = intval($input['ticket_id'] ?? 0);
    $sender_id = intval($input['sender_id'] ?? 0);
    $message = trim($input['message'] ?? '');

    if (!$ticket_id || !$sender_id || empty($message)) {
        echo json_encode(["success" => false, "message" => "Ticket ID, Sender ID, and Message are required."]);
        exit();
    }

    $stmt = $conn->prepare("INSERT INTO support_ticket_replies (ticket_id, sender_id, message) VALUES (?, ?, ?)");
    $stmt->bind_param("iis", $ticket_id, $sender_id, $message);

    if ($stmt->execute()) {
        // Touch ticket updated_at
        $conn->query("UPDATE support_tickets SET updated_at = CURRENT_TIMESTAMP WHERE id = {$ticket_id}");
        echo json_encode(["success" => true, "message" => "Reply sent successfully!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to post reply: " . $conn->error]);
    }
    exit();
}

$conn->close();
?>
