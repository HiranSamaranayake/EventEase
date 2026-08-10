<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/email_helper.php';

// Auto create system_settings & email_logs tables if missing
$conn->query("CREATE TABLE IF NOT EXISTS `system_settings` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `setting_key` VARCHAR(100) NOT NULL UNIQUE,
  `setting_value` TEXT NOT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true) ?? [];
$targetEmail = trim($input['test_email'] ?? 'admin@eventease.com');

$customSettings = [];
if (isset($input['smtp_host'])) {
    $customSettings['smtp_host'] = trim($input['smtp_host']);
    $customSettings['smtp_port'] = trim($input['smtp_port']);
    $customSettings['smtp_user'] = trim($input['smtp_user']);
    $customSettings['smtp_from_email'] = trim($input['smtp_from_email']);
    $customSettings['smtp_from_name'] = trim($input['smtp_from_name']);
    if (!empty($input['smtp_pass'])) {
        $customSettings['smtp_pass'] = trim($input['smtp_pass']);
    }

    foreach ($customSettings as $k => $v) {
        $sk = mysqli_real_escape_string($conn, $k);
        $sv = mysqli_real_escape_string($conn, $v);
        mysqli_query($conn, "INSERT INTO system_settings (setting_key, setting_value) VALUES ('$sk', '$sv') ON DUPLICATE KEY UPDATE setting_value='$sv'");
    }
}

$subject = "🧪 SMTP Server Connectivity Test - EventEase";
$body = '
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
  <div style="max-width: 500px; margin: 0 auto; background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #4f46e5;">
    <h2 style="color: #4f46e5; margin-top: 0;">✅ SMTP Connection Successful</h2>
    <p>This test email verifies that your EventEase Live PHPMailer SMTP Gateway is functioning correctly.</p>
    <p><strong>Timestamp:</strong> ' . date("Y-m-d H:i:s") . '</p>
  </div>
</body>
</html>
';

$smtpResult = sendSmtpMail($targetEmail, $subject, $body, $conn, null, "test.pdf", $customSettings);

$status_str = $smtpResult['success'] ? 'sent' : 'failed';
$safe_email = mysqli_real_escape_string($conn, $targetEmail);
$safe_subject = mysqli_real_escape_string($conn, $subject);
$safe_body = mysqli_real_escape_string($conn, $body);
$safe_err = mysqli_real_escape_string($conn, $smtpResult['message']);

mysqli_query($conn, "INSERT INTO email_logs (user_id, recipient_email, subject, body_html, status, error_message) VALUES (1, '$safe_email', '$safe_subject', '$safe_body', '$status_str', '$safe_err')");

if (ob_get_length()) ob_clean();

echo json_encode([
    "success" => $smtpResult['success'],
    "message" => $smtpResult['success'] ? ("SMTP test executed successfully! Target: " . $targetEmail) : ("SMTP Delivery Failed: " . $smtpResult['message']),
    "smtp_status" => $status_str,
    "smtp_response" => $smtpResult['message'],
    "debug_log" => $smtpResult['debug'],
    "settings_used" => $smtpResult['settings_used'],
    "timestamp" => date("Y-m-d H:i:s")
]);
