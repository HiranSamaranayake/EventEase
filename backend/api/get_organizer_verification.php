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

$userId = $_GET['user_id'] ?? 0;
$userId = intval($userId);

if ($userId <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Valid user_id is required"
    ]);
    exit;
}

// Fetch organizer details joined with users
$query = "
SELECT 
    organizers.*,
    users.full_name,
    users.email
FROM users
LEFT JOIN organizers ON users.id = organizers.user_id
WHERE users.id = $userId
LIMIT 1
";

$result = mysqli_query($conn, $query);

if ($result && mysqli_num_rows($result) > 0) {
    $data = mysqli_fetch_assoc($result);

    // Default status if empty
    if (empty($data['verification_status'])) {
        $data['verification_status'] = 'pending';
    }

    echo json_encode([
        "success" => true,
        "organizer" => $data
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "User not found"
    ]);
}
