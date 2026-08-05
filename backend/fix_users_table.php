<?php
require_once __DIR__ . '/config/database.php';

// Ensure user 9 exists
$res = $conn->query("SELECT id FROM users WHERE id = 9");
if ($res && $res->num_rows == 0) {
    $conn->query("INSERT INTO users (id, full_name, email, phone, password, role, admin_role, user_tier) VALUES (9, 'Hiran Anajana', 'hirananjana12@gmail.com', '0719876543', '$2y$10$3yJP/UXffrUO9pErPOkxp.pWboYL7fLhqP/E/F4cWH/4fq1FVuaV6', 'customer', 'super_admin', 'verified')");
    echo "Inserted user 9 into users table.\n";
} else {
    echo "User 9 exists.\n";
}
?>
