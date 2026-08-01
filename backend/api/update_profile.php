<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require_once __DIR__ . "/../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

$userId = intval($data["user_id"] ?? 0);
$fullName = trim($data["full_name"] ?? "");
$phone = trim($data["phone"] ?? "");

if (!$userId || empty($fullName)) {
    echo json_encode([
        "success" => false,
        "message" => "Missing required fields"
    ]);
    exit;
}

$fullNameEsc = mysqli_real_escape_string($conn, $fullName);
$phoneEsc = mysqli_real_escape_string($conn, $phone);

// 1. Update users table
$query = "UPDATE users SET full_name = '$fullNameEsc', phone = '$phoneEsc' WHERE id = '$userId'";
$result = mysqli_query($conn, $query);

if ($result) {
    // 2. Fetch role to update corresponding role table
    $uRes = mysqli_query($conn, "SELECT role FROM users WHERE id = '$userId'");
    if ($uRes && $uRow = mysqli_fetch_assoc($uRes)) {
        $role = $uRow['role'];
        if ($role === 'customer') {
            mysqli_query($conn, "UPDATE customers SET full_name = '$fullNameEsc', phone = '$phoneEsc' WHERE user_id = '$userId'");
        } else if ($role === 'admin') {
            mysqli_query($conn, "UPDATE admins SET full_name = '$fullNameEsc', phone = '$phoneEsc' WHERE user_id = '$userId'");
        } else if ($role === 'organizer') {
            mysqli_query($conn, "UPDATE organizers SET full_name = '$fullNameEsc', phone = '$phoneEsc' WHERE user_id = '$userId'");
        }
    }

    echo json_encode([
        "success" => true,
        "message" => "Profile updated successfully"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Failed to update profile: " . mysqli_error($conn)
    ]);
}

?>