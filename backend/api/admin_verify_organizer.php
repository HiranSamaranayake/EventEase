<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once __DIR__ . "/../config/database.php";

$raw = file_get_contents("php://input");
$input = json_decode($raw, true) ?? [];

$userId = $_POST['user_id'] ?? $input['user_id'] ?? $_POST['id'] ?? $input['id'] ?? $_GET['user_id'] ?? $_GET['id'] ?? 0;
$action = $_POST['action'] ?? $input['action'] ?? $_GET['action'] ?? '';
$statusParam = $_POST['status'] ?? $input['status'] ?? $_GET['status'] ?? '';
$reason = mysqli_real_escape_string($conn, $_POST['rejection_reason'] ?? $input['rejection_reason'] ?? '');

$userId = intval($userId);

if ($userId <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Valid user_id is required"
    ]);
    exit;
}

// Determine final status
if ($action === 'reject' || $statusParam === 'rejected') {
    $status = 'rejected';
} else {
    $status = 'verified';
}

$reasonSql = ($status === 'rejected') ? "'$reason'" : "NULL";

// Check if organizer record exists
$checkRes = mysqli_query($conn, "SELECT id FROM organizers WHERE user_id = $userId OR id = $userId");

if ($checkRes && mysqli_num_rows($checkRes) > 0) {
    $row = mysqli_fetch_assoc($checkRes);
    $orgId = intval($row['id']);
    $updateSql = "
    UPDATE organizers 
    SET verification_status = '$status', rejection_reason = $reasonSql 
    WHERE id = $orgId OR user_id = $userId
    ";
    $success = mysqli_query($conn, $updateSql);
} else {
    $insertSql = "
    INSERT INTO organizers (user_id, verification_status, rejection_reason) 
    VALUES ($userId, '$status', $reasonSql)
    ";
    $success = mysqli_query($conn, $insertSql);
}

if ($success) {
    echo json_encode([
        "success" => true,
        "message" => ($status === 'verified') 
            ? "Organizer verified successfully! Verified badge granted." 
            : "Organizer verification rejected.",
        "verification_status" => $status
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . mysqli_error($conn)
    ]);
}
