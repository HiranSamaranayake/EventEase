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

$user_id = intval($data['user_id'] ?? 0);
$admin_role = trim($data['admin_role'] ?? '');

$allowed_roles = ['super_admin', 'junior_admin', 'financial_admin', 'security_admin'];

if ($user_id <= 0 || !in_array($admin_role, $allowed_roles)) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid parameters. Allowed sub-roles: super_admin, junior_admin, financial_admin, security_admin"
    ]);
    exit();
}

$stmt = $conn->prepare("UPDATE users SET role = 'admin', admin_role = ? WHERE id = ?");
$stmt->bind_param("si", $admin_role, $user_id);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Admin sub-role updated successfully to " . $admin_role
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Failed to update admin sub-role: " . $conn->error
    ]);
}

?>
