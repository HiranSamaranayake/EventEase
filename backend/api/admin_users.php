<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once __DIR__ . "/../config/database.php";

$query = "
SELECT 
    u.id,
    COALESCE(c.full_name, u.full_name) as full_name,
    COALESCE(c.email, u.email) as email,
    COALESCE(c.phone, u.phone) as phone,
    u.role,
    u.created_at
FROM users u
LEFT JOIN customers c ON u.id = c.user_id AND u.role = 'customer'
ORDER BY u.created_at DESC
";

$result = mysqli_query($conn, $query);

$users = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $users[] = $row;
    }
}

echo json_encode([
    "success" => true,
    "users" => $users
]);

?>