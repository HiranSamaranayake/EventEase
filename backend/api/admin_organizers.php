<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once __DIR__ . "/../config/database.php";

$sql = "
SELECT 
    users.id AS user_id,
    users.id AS id,
    users.full_name,
    users.email,
    users.role,
    organizers.id AS organizer_id,
    organizers.organization_name,
    organizers.phone,
    organizers.website,
    organizers.address,
    organizers.business_registration_number,
    organizers.nic_passport,
    organizers.document_path,
    organizers.verification_status,
    organizers.rejection_reason,
    organizers.submitted_at
FROM users
LEFT JOIN organizers ON users.id = organizers.user_id
WHERE LOWER(users.role) = 'organizer' OR organizers.id IS NOT NULL
ORDER BY users.id DESC
";

$res = mysqli_query($conn, $sql);

if (!$res) {
    echo json_encode(["success" => false, "error" => mysqli_error($conn)]);
    exit;
}

$organizers = [];

while ($row = mysqli_fetch_assoc($res)) {
    if (empty($row['verification_status'])) {
        $row['verification_status'] = 'pending';
    }
    if (empty($row['organization_name'])) {
        $row['organization_name'] = $row['full_name'] . " Events";
    }
    $organizers[] = $row;
}

echo json_encode([
    "success" => true,
    "organizers" => $organizers
]);