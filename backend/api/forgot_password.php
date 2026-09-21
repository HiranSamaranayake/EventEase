<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/database.php';

header("Content-Type: application/json");

$raw = file_get_contents("php://input");
$data = json_decode($raw, true) ?? [];

$action = $data['action'] ?? $_POST['action'] ?? 'request_otp';
$email = trim($data['email'] ?? $_POST['email'] ?? '');

if (empty($email)) {
    echo json_encode(["success" => false, "message" => "Email address is required."]);
    exit;
}

// Ensure password_reset_otp and otp_expiry columns exist in users table
@mysqli_query($conn, "ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_otp VARCHAR(10) NULL");
@mysqli_query($conn, "ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_expiry TIMESTAMP NULL");

// Check if user exists
$stmt = $conn->prepare("SELECT id, full_name, email FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$res = $stmt->get_result();

if (!$res || $res->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "No account found matching this email address."]);
    exit;
}

$user = $res->fetch_assoc();
$userId = intval($user['id']);

if ($action === 'request_otp') {
    // Generate 6-digit OTP code
    $otp = sprintf("%06d", mt_rand(100000, 999999));

    $upStmt = $conn->prepare("UPDATE users SET reset_otp = ?, otp_expiry = DATE_ADD(NOW(), INTERVAL 30 MINUTE) WHERE id = ?");
    $upStmt->bind_param("si", $otp, $userId);
    
    if ($upStmt->execute()) {
        // Log notification for the user
        $nTitle = "🔐 Password Reset OTP Code: " . $otp;
        $nMsg = "Your password reset verification code is " . $otp . ". Valid for 30 minutes.";
        @mysqli_query($conn, "INSERT INTO notifications (user_id, type, title, message, link) VALUES ($userId, 'security', '" . mysqli_real_escape_string($conn, $nTitle) . "', '" . mysqli_real_escape_string($conn, $nMsg) . "', '/login')");

        echo json_encode([
            "success" => true,
            "message" => "Verification OTP code generated! Check your email or use the code provided below.",
            "otp" => $otp,
            "user_id" => $userId
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to generate reset OTP code."]);
    }
    $upStmt->close();
} else if ($action === 'verify_and_reset') {
    $otp = trim($data['otp'] ?? $_POST['otp'] ?? '');
    $newPassword = $data['new_password'] ?? $_POST['new_password'] ?? '';

    if (empty($otp) || empty($newPassword)) {
        echo json_encode(["success" => false, "message" => "OTP Code and New Password are required."]);
        exit;
    }

    if (strlen($newPassword) < 6) {
        echo json_encode(["success" => false, "message" => "New password must be at least 6 characters long."]);
        exit;
    }

    // Verify OTP code
    $verifyStmt = $conn->prepare("SELECT id FROM users WHERE (id = ? OR email = ?) AND reset_otp = ?");
    $verifyStmt->bind_param("iss", $userId, $email, $otp);
    $verifyStmt->execute();
    $vRes = $verifyStmt->get_result();

    if (!$vRes || $vRes->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "Invalid OTP verification code."]);
        exit;
    }

    // Hash new password using PHP password_hash
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

    $resetStmt = $conn->prepare("UPDATE users SET password = ?, reset_otp = NULL, otp_expiry = NULL WHERE id = ?");
    $resetStmt->bind_param("si", $hashedPassword, $userId);

    if ($resetStmt->execute()) {
        // Log security notification
        $nTitle = "🛡️ Password Reset Successful";
        $nMsg = "Your EventEase account password has been updated successfully.";
        @mysqli_query($conn, "INSERT INTO notifications (user_id, type, title, message, link) VALUES ($userId, 'security', '" . mysqli_real_escape_string($conn, $nTitle) . "', '" . mysqli_real_escape_string($conn, $nMsg) . "', '/login')");

        echo json_encode([
            "success" => true,
            "message" => "Password reset successfully! You can now log in with your new password."
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to update password: " . $conn->error]);
    }
    $resetStmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Invalid action requested."]);
}

$stmt->close();
$conn->close();
?>
