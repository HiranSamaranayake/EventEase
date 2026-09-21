<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

$complaint_id = isset($data['complaint_id']) ? intval($data['complaint_id']) : 0;
$status = isset($data['status']) ? trim($data['status']) : 'resolved';
$response_message = isset($data['response_message']) ? trim($data['response_message']) : (isset($data['admin_response']) ? trim($data['admin_response']) : '');
$organizer_id = isset($data['organizer_id']) ? intval($data['organizer_id']) : 0;

if (!$complaint_id) {
    echo json_encode(["status" => "error", "message" => "Complaint ID is required."]);
    exit;
}

$sql = "UPDATE complaints SET status = ?, admin_response = ?, resolved_by = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssii", $status, $response_message, $organizer_id, $complaint_id);

if ($stmt->execute()) {
    // Notify customer about the organizer response
    $get_comp = $conn->query("SELECT user_id, subject FROM complaints WHERE id = " . $complaint_id);
    if ($get_comp && $row = $get_comp->fetch_assoc()) {
        $u_id = intval($row['user_id']);
        $subj = $row['subject'];
        $n_title = "💬 Complaint Response Update: " . ucfirst(str_replace('_', ' ', $status));
        $n_msg = "The organizer responded to your ticket '" . $subj . "' (" . strtoupper(str_replace('_', ' ', $status)) . "). Note: " . ($response_message ? $response_message : 'No comments provided.');
        
        $n_title_esc = mysqli_real_escape_string($conn, $n_title);
        $n_msg_esc = mysqli_real_escape_string($conn, $n_msg);
        $conn->query("INSERT INTO notifications (user_id, type, title, message, link) VALUES ($u_id, 'support', '$n_title_esc', '$n_msg_esc', '/customer/support')");
    }

    echo json_encode(["status" => "success", "message" => "Complaint status updated and customer notified successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to update complaint: " . $conn->error]);
}

$stmt->close();
$conn->close();
?>
