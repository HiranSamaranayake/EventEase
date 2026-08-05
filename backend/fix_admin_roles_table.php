<?php

require_once __DIR__ . "/config/database.php";

$check = mysqli_query($conn, "SHOW COLUMNS FROM users LIKE 'admin_role'");
if ($check && mysqli_num_rows($check) == 0) {
    $alter = "ALTER TABLE users ADD COLUMN admin_role ENUM('super_admin', 'junior_admin', 'financial_admin', 'security_admin') DEFAULT 'super_admin'";
    if (mysqli_query($conn, $alter)) {
        echo "Successfully added admin_role column to users table.\n";
    } else {
        echo "Failed adding admin_role column: " . mysqli_error($conn) . "\n";
    }
} else {
    echo "admin_role column already exists.\n";
}

// Ensure default super_admin for admin users
$update = "UPDATE users SET admin_role = 'super_admin' WHERE role = 'admin' AND (admin_role IS NULL OR admin_role = '')";
mysqli_query($conn, $update);
echo "Updated default admin_role for existing admins.\n";

?>
