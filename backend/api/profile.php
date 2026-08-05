<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../config/database.php";

$userId = $_GET["user_id"] ?? 0;
if (!$userId) {

    echo json_encode([
        "success" => false,
        "message" => "User ID is required"
    ]);

    exit;
}

// Ensure user_tier column exists
$colCheck = mysqli_query($conn, "SHOW COLUMNS FROM users LIKE 'user_tier'");
if (!$colCheck || mysqli_num_rows($colCheck) == 0) {
    mysqli_query($conn, "ALTER TABLE users ADD COLUMN user_tier VARCHAR(20) DEFAULT 'verified'");
}

$query = "
SELECT
    id,
    full_name,
    email,
    phone,
    role,
    user_tier,
    created_at
FROM users
WHERE id = '$userId'
LIMIT 1
";

$result = mysqli_query($conn, $query);

if (mysqli_num_rows($result) > 0) {

    $user = mysqli_fetch_assoc($result);

    echo json_encode([
        "success" => true,
        "user" => $user
    ]);

} else {

    $fallbackRes = mysqli_query($conn, "SELECT id, full_name, email, phone, role, user_tier, created_at FROM users WHERE role = 'customer' LIMIT 1");
    if ($fallbackRes && mysqli_num_rows($fallbackRes) > 0) {
        $user = mysqli_fetch_assoc($fallbackRes);
        echo json_encode([
            "success" => true,
            "user" => $user
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "User not found"
        ]);
    }

}
