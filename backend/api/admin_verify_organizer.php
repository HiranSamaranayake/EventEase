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

// Auto-expand ENUM definition to support both 'approved' and 'verified'
@mysqli_query($conn, "ALTER TABLE organizers MODIFY COLUMN verification_status ENUM('pending','approved','verified','rejected') DEFAULT 'pending'");

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
    $status = 'approved';
}

$reasonSql = ($status === 'rejected') ? "'$reason'" : "NULL";

// Check if organizer record exists by user_id OR id
$checkRes = mysqli_query($conn, "SELECT id, user_id FROM organizers WHERE user_id = $userId OR id = $userId");

if ($checkRes && mysqli_num_rows($checkRes) > 0) {
    $row = mysqli_fetch_assoc($checkRes);
    $orgId = intval($row['id']);
    $realUserId = intval($row['user_id']) > 0 ? intval($row['user_id']) : $userId;
    
    $updateSql = "
    UPDATE organizers 
    SET verification_status = '$status', rejection_reason = $reasonSql 
    WHERE id = $orgId OR user_id = $realUserId
    ";
    $success = mysqli_query($conn, $updateSql);

    if ($status === 'approved' || $status === 'verified') {
        @mysqli_query($conn, "UPDATE users SET user_tier = 'verified' WHERE id = $realUserId");
    }
} else {
    $insertSql = "
    INSERT INTO organizers (user_id, verification_status, rejection_reason) 
    VALUES ($userId, '$status', $reasonSql)
    ";
    $success = mysqli_query($conn, $insertSql);

    if ($status === 'approved' || $status === 'verified') {
        @mysqli_query($conn, "UPDATE users SET user_tier = 'verified' WHERE id = $userId");
    }
}

if ($success) {
    // Send automated notification
    $isVerified = ($status === 'approved' || $status === 'verified');
    $noteTitle = $isVerified ? "🛡️ Organizer Verification Approved!" : "❌ Verification Status Update";
    $noteMsg = $isVerified 
        ? "Your business verification has been approved! You now have an official Verified Badge."
        : "Your verification request was rejected. Reason: " . ($reason ? $reason : "Documents incomplete.");
    $noteLink = "/organizer/verify";

    mysqli_query($conn, "INSERT INTO notifications (user_id, type, title, message, link, is_read) VALUES ($userId, 'verification', '" . mysqli_real_escape_string($conn, $noteTitle) . "', '" . mysqli_real_escape_string($conn, $noteMsg) . "', '$noteLink', 0)");

    echo json_encode([
        "success" => true,
        "message" => $isVerified 
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
