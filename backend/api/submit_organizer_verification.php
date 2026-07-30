<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once "../config/database.php";

$userId = $_POST['user_id'] ?? 0;
$organizationName = mysqli_real_escape_string($conn, $_POST['organization_name'] ?? '');
$phone = mysqli_real_escape_string($conn, $_POST['phone'] ?? '');
$website = mysqli_real_escape_string($conn, $_POST['website'] ?? '');
$address = mysqli_real_escape_string($conn, $_POST['address'] ?? '');
$brn = mysqli_real_escape_string($conn, $_POST['business_registration_number'] ?? '');
$nicPassport = mysqli_real_escape_string($conn, $_POST['nic_passport'] ?? '');

$userId = intval($userId);

if ($userId <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Valid user_id is required"
    ]);
    exit;
}

$documentPath = null;

// Handle Document Upload
if (isset($_FILES['document']) && $_FILES['document']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = "../uploads/";
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $ext = pathinfo($_FILES['document']['name'], PATHINFO_EXTENSION);
    $filename = "verif_" . $userId . "_" . time() . "." . $ext;
    $targetFile = $uploadDir . $filename;

    if (move_uploaded_file($_FILES['document']['tmp_name'], $targetFile)) {
        $documentPath = $filename;
    }
}

// Check if organizer record exists
$checkRes = mysqli_query($conn, "SELECT id, document_path FROM organizers WHERE user_id = $userId");

if ($checkRes && mysqli_num_rows($checkRes) > 0) {
    $existing = mysqli_fetch_assoc($checkRes);
    if (!$documentPath && !empty($existing['document_path'])) {
        $documentPath = $existing['document_path'];
    }

    $updateSql = "
    UPDATE organizers SET
        organization_name = '$organizationName',
        phone = '$phone',
        website = '$website',
        address = '$address',
        business_registration_number = '$brn',
        nic_passport = '$nicPassport',
        document_path = '$documentPath',
        verification_status = 'pending',
        rejection_reason = NULL,
        submitted_at = NOW()
    WHERE user_id = $userId
    ";
    $success = mysqli_query($conn, $updateSql);
} else {
    $insertSql = "
    INSERT INTO organizers 
        (user_id, organization_name, phone, website, address, business_registration_number, nic_passport, document_path, verification_status, submitted_at)
    VALUES 
        ($userId, '$organizationName', '$phone', '$website', '$address', '$brn', '$nicPassport', '$documentPath', 'pending', NOW())
    ";
    $success = mysqli_query($conn, $insertSql);
}

if ($success) {
    echo json_encode([
        "success" => true,
        "message" => "Verification documents submitted successfully! Admin review is in progress.",
        "verification_status" => "pending"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . mysqli_error($conn)
    ]);
}
