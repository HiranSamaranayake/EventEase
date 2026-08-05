<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

$complaint_id = isset($data['complaint_id']) ? intval($data['complaint_id']) : 0;
$status = isset($data['status']) ? trim($data['status']) : 'resolved';
$admin_response = isset($data['admin_response']) ? trim($data['admin_response']) : '';
$admin_id = (isset($data['admin_id']) && !empty($data['admin_id'])) ? intval($data['admin_id']) : 7;
$priority = isset($data['priority']) ? trim($data['priority']) : null;

if (!$complaint_id) {
    echo json_encode(["status" => "error", "message" => "Complaint ID required."]);
    exit;
}

$sql = "UPDATE complaints SET status = ?, admin_response = ?, resolved_by = ?";
$params = [$status, $admin_response, $admin_id];
$types = "ssi";

if ($priority) {
    $sql .= ", priority = ?";
    $params[] = $priority;
    $types .= "s";
}

$sql .= " WHERE id = ?";
$params[] = $complaint_id;
$types .= "i";

$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    $get_comp = $conn->query("SELECT user_id, subject FROM complaints WHERE id = " . $complaint_id);
    if ($get_comp && $row = $get_comp->fetch_assoc()) {
        $u_id = intval($row['user_id']);
        $subj = $row['subject'];
        $n_title = "🎧 Support Ticket Update: " . $status;
        $n_msg = "Your support ticket '" . $subj . "' has been updated to: " . strtoupper($status) . ". Admin note: " . ($admin_response ? $admin_response : 'No notes provided.');
        
        $n_title_esc = mysqli_real_escape_string($conn, $n_title);
        $n_msg_esc = mysqli_real_escape_string($conn, $n_msg);
        $conn->query("INSERT INTO notifications (user_id, type, title, message, link) VALUES ($u_id, 'support', '$n_title_esc', '$n_msg_esc', '/customer/support')");
    }

    echo json_encode(["status" => "success", "message" => "Complaint updated successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => "Update failed: " . $conn->error]);
}
$stmt->close();
$conn->close();
?>
