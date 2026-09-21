<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . "/../config/database.php";

// Ensure table exists
$tableCheck = mysqli_query($conn, "SHOW TABLES LIKE 'website_reviews'");
if (mysqli_num_rows($tableCheck) == 0) {
    $createSql = "CREATE TABLE website_reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        reviewer_name VARCHAR(255) NOT NULL,
        role VARCHAR(100) DEFAULT 'Customer',
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'approved',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    mysqli_query($conn, $createSql);
}

$input = json_decode(file_get_contents("php://input"), true);

$reviewer_name = isset($input['reviewer_name']) ? trim($input['reviewer_name']) : '';
$role = isset($input['role']) && !empty(trim($input['role'])) ? trim($input['role']) : 'Customer';
$rating = isset($input['rating']) ? (int)$input['rating'] : 5;
$comment = isset($input['comment']) ? trim($input['comment']) : '';
$user_id = isset($input['user_id']) ? (int)$input['user_id'] : null;

if (empty($reviewer_name) || empty($comment)) {
    echo json_encode([
        "success" => false,
        "message" => "Name and review text are required fields."
    ]);
    exit;
}

if ($rating < 1 || $rating > 5) {
    $rating = 5;
}

// Escaping
$reviewer_name_esc = mysqli_real_escape_string($conn, $reviewer_name);
$role_esc = mysqli_real_escape_string($conn, $role);
$comment_esc = mysqli_real_escape_string($conn, $comment);
$user_id_val = $user_id ? $user_id : "NULL";

$query = "INSERT INTO website_reviews (user_id, reviewer_name, role, rating, comment, status) 
          VALUES ($user_id_val, '$reviewer_name_esc', '$role_esc', $rating, '$comment_esc', 'approved')";

if (mysqli_query($conn, $query)) {
    $newId = mysqli_insert_id($conn);
    echo json_encode([
        "success" => true,
        "message" => "Thank you! Your review has been published successfully.",
        "id" => $newId
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . mysqli_error($conn)
    ]);
}
?>
