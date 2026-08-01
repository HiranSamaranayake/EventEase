<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

// GET TICKETS
if ($method === 'GET') {
    $user_id = intval($_GET['user_id'] ?? 0);
    $category = $_GET['category'] ?? '';
    $status = $_GET['status'] ?? '';
    $ticket_id = intval($_GET['id'] ?? 0);

    if ($ticket_id > 0) {
        $stmt = $conn->prepare("SELECT st.*, u.full_name as submitter_name, u.email as submitter_email, u.role as submitter_role,
                                au.full_name as assignee_name
                                FROM support_tickets st
                                LEFT JOIN users u ON st.user_id = u.id
                                LEFT JOIN users au ON st.assigned_to = au.id
                                WHERE st.id = ?");
        $stmt->bind_param("i", $ticket_id);
        $stmt->execute();
        $res = $stmt->get_result();
        $ticket = $res->fetch_assoc();
        echo json_encode(["success" => true, "data" => $ticket]);
        exit();
    }

    if ($user_id > 0) {
        // Customer / Organizer view
        $stmt = $conn->prepare("SELECT st.*, au.full_name as assignee_name 
                                FROM support_tickets st 
                                LEFT JOIN users au ON st.assigned_to = au.id 
                                WHERE st.user_id = ? 
                                ORDER BY st.updated_at DESC");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $res = $stmt->get_result();
        $tickets = [];
        while ($row = $res->fetch_assoc()) {
            $tickets[] = $row;
        }
        echo json_encode(["success" => true, "data" => $tickets]);
        exit();
    } else {
        // Admin View (Junior / Financial / Security / Super Admin)
        $query = "SELECT st.*, u.full_name as submitter_name, u.email as submitter_email, u.role as submitter_role,
                  au.full_name as assignee_name
                  FROM support_tickets st
                  LEFT JOIN users u ON st.user_id = u.id
                  LEFT JOIN users au ON st.assigned_to = au.id
                  WHERE 1=1";
        
        if (!empty($category) && $category !== 'all') {
            $query .= " AND st.category = '" . $conn->real_escape_string($category) . "'";
        }
        if (!empty($status) && $status !== 'all') {
            $query .= " AND st.status = '" . $conn->real_escape_string($status) . "'";
        }
        $query .= " ORDER BY st.updated_at DESC";

        $res = $conn->query($query);
        $tickets = [];
        if ($res) {
            while ($row = $res->fetch_assoc()) {
                $tickets[] = $row;
            }
        }
        echo json_encode(["success" => true, "data" => $tickets]);
        exit();
    }
}

// POST NEW TICKET / COMPLAINT
if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $user_id = intval($input['user_id'] ?? 0);
    $category = trim($input['category'] ?? 'General Inquiry');
    $subject = trim($input['subject'] ?? '');
    $description = trim($input['description'] ?? '');
    $priority = trim($input['priority'] ?? 'Medium');
    $event_id = !empty($input['event_id']) ? intval($input['event_id']) : NULL;
    $booking_id = !empty($input['booking_id']) ? intval($input['booking_id']) : NULL;

    if (!$user_id || empty($subject) || empty($description)) {
        echo json_encode(["success" => false, "message" => "User ID, Subject, and Description are required."]);
        exit();
    }

    $ticket_number = 'TKT-' . rand(10000, 99999);

    $stmt = $conn->prepare("INSERT INTO support_tickets (ticket_number, user_id, event_id, booking_id, category, subject, description, priority, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Open')");
    $stmt->bind_param("siiissss", $ticket_number, $user_id, $event_id, $booking_id, $category, $subject, $description, $priority);

    if ($stmt->execute()) {
        $ticket_id = $stmt->insert_id;
        echo json_encode([
            "success" => true,
            "message" => "Support complaint ticket submitted successfully!",
            "ticket_number" => $ticket_number,
            "ticket_id" => $ticket_id
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to submit ticket: " . $conn->error]);
    }
    exit();
}

// PUT UPDATE TICKET STATUS / ASSIGNEE
if ($method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = intval($input['id'] ?? 0);
    $status = trim($input['status'] ?? '');
    $priority = trim($input['priority'] ?? '');
    $assigned_to = isset($input['assigned_to']) ? intval($input['assigned_to']) : NULL;

    if (!$id) {
        echo json_encode(["success" => false, "message" => "Ticket ID is required."]);
        exit();
    }

    $updates = [];
    $params = [];
    $types = "";

    if (!empty($status)) {
        $updates[] = "status = ?";
        $params[] = $status;
        $types .= "s";
    }
    if (!empty($priority)) {
        $updates[] = "priority = ?";
        $params[] = $priority;
        $types .= "s";
    }
    if ($assigned_to !== NULL) {
        $updates[] = "assigned_to = ?";
        $params[] = $assigned_to > 0 ? $assigned_to : NULL;
        $types .= "i";
    }

    if (empty($updates)) {
        echo json_encode(["success" => false, "message" => "No update fields specified."]);
        exit();
    }

    $sql = "UPDATE support_tickets SET " . implode(", ", $updates) . " WHERE id = ?";
    $params[] = $id;
    $types .= "i";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Support ticket updated successfully!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to update ticket: " . $conn->error]);
    }
    exit();
}

$conn->close();
?>
