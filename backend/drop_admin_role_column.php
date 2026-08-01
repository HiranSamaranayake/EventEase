<?php
require_once __DIR__ . '/config/database.php';

header("Content-Type: application/json");

// Check if admin_role column exists in users table
$check = $conn->query("SHOW COLUMNS FROM users LIKE 'admin_role'");

if ($check && $check->num_rows > 0) {
    $res = $conn->query("ALTER TABLE users DROP COLUMN admin_role");
    if ($res) {
        echo json_encode(["status" => "success", "message" => "Column 'admin_role' successfully dropped from 'users' table."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error dropping column: " . $conn->error]);
    }
} else {
    echo json_encode(["status" => "success", "message" => "Column 'admin_role' already removed from 'users' table."]);
}

$conn->close();
?>
