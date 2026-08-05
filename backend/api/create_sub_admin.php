<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . "/../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

$full_name = trim($data['full_name'] ?? '');
$email = trim($data['email'] ?? '');
$phone = trim($data['phone'] ?? '0770000000');
$password = trim($data['password'] ?? '');
$admin_role = trim($data['admin_role'] ?? 'junior_admin');

$allowed_roles = ['super_admin', 'junior_admin', 'financial_admin', 'security_admin'];

if (empty($full_name) || empty($email) || empty($password) || !in_array($admin_role, $allowed_roles)) {
    echo json_encode([
        "success" => false,
        "message" => "Full Name, Email, Password, and a valid Sub-Admin role are required."
    ]);
    exit();
}

// Check if email exists
$checkStmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$checkStmt->bind_param("s", $email);
$checkStmt->execute();
$res = $checkStmt->get_result();

if ($res && $res->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "message" => "A user with this email address already exists. Use 'Assign Sub-Role' on existing user."
    ]);
    exit();
}

$hashed_password = password_hash($password, PASSWORD_BCRYPT);
$role = 'admin';
$created_at = date('Y-m-d H:i:s');

$stmt = $conn->prepare("INSERT INTO users (full_name, email, phone, password, role, admin_role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssss", $full_name, $email, $phone, $hashed_password, $role, $admin_role, $created_at);

if ($stmt->execute()) {
    $new_id = $stmt->insert_id;
    echo json_encode([
        "success" => true,
        "message" => "New Sub-Admin account created successfully with role: " . $admin_role,
        "user_id" => $new_id
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Failed to create sub-admin: " . $conn->error
    ]);
}

$stmt->close();
$conn->close();
?>
