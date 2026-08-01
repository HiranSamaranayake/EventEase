<?php

require_once __DIR__ . "/config/database.php";

$sql = "
SELECT 
    users.id AS user_id,
    users.id AS id,
    users.full_name,
    users.email,
    users.role,
    organizers.id AS organizer_id,
    organizers.organization_name,
    organizers.verification_status
FROM users
LEFT JOIN organizers ON users.id = organizers.user_id
WHERE LOWER(users.role) = 'organizer' OR organizers.id IS NOT NULL
";

$res = mysqli_query($conn, $sql);

if (!$res) {
    echo "SQL ERROR: " . mysqli_error($conn) . PHP_EOL;
} else {
    echo "COUNT: " . mysqli_num_rows($res) . PHP_EOL;
    while ($row = mysqli_fetch_assoc($res)) {
        echo json_encode($row) . PHP_EOL;
    }
}
