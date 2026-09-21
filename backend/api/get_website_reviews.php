<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . "/../config/database.php";

// Ensure website_reviews table exists
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

    // Insert initial default reviews
    $initialSql = "INSERT INTO website_reviews (reviewer_name, role, rating, comment, status) VALUES
    ('Amanda Silva', 'Event Organizer', 5, 'EventEase made organizing our annual tech conference incredibly simple. Ticket sales and attendee management were effortless.', 'approved'),
    ('Daniel Fernando', 'Customer', 5, 'Booking tickets has never been easier. The platform is fast, modern and extremely user friendly.', 'approved'),
    ('Michael Perera', 'Festival Manager', 5, 'Our music festival sold out within days. Managing registrations and bookings became completely stress-free.', 'approved')";
    mysqli_query($conn, $initialSql);
}

// Fetch approved reviews
$query = "SELECT * FROM website_reviews WHERE status = 'approved' ORDER BY id DESC";
$result = mysqli_query($conn, $query);

$reviews = [];
if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $row['rating'] = (int)$row['rating'];
        $reviews[] = $row;
    }
}

echo json_encode([
    "success" => true,
    "reviews" => $reviews
]);
?>
