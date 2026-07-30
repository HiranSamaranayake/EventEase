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

$id = $_POST['id'] ?? $input['id'] ?? $_POST['user_id'] ?? $input['user_id'] ?? $_GET['id'] ?? 0;
$id = intval($id);

if ($id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Valid user ID is required"
    ]);
    exit;
}

// Delete from organizers and users tables
mysqli_query($conn, "DELETE FROM organizers WHERE user_id = $id OR id = $id");
$deleteRes = mysqli_query($conn, "DELETE FROM users WHERE id = $id AND role = 'organizer'");

if ($deleteRes) {
    echo json_encode([
        "success" => true,
        "message" => "Organizer deleted successfully"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . mysqli_error($conn)
    ]);
}
