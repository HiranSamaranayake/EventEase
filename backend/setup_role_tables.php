<?php
require_once __DIR__ . '/config/database.php';

header("Content-Type: application/json");

// 1. Create customers table
$sqlCustomers = "CREATE TABLE IF NOT EXISTS `customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `fk_customers_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";

// 2. Create admins table
$sqlAdmins = "CREATE TABLE IF NOT EXISTS `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `admin_role` enum('super_admin','support_admin','financial_admin','security_admin') DEFAULT 'super_admin',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `fk_admins_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";

// 3. Create or Update organizers table
$sqlOrganizers = "CREATE TABLE IF NOT EXISTS `organizers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `organization_name` varchar(150) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `verification_status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `fk_organizers_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";

$cRes = $conn->query($sqlCustomers);
$aRes = $conn->query($sqlAdmins);
$oRes = $conn->query($sqlOrganizers);

if (!$cRes || !$aRes || !$oRes) {
    echo json_encode(["status" => "error", "message" => "Table creation error: " . $conn->error]);
    exit();
}

// 4. Ensure organizers columns (full_name, email, phone) exist safely
$fnCheck = $conn->query("SHOW COLUMNS FROM organizers LIKE 'full_name'");
if ($fnCheck && $fnCheck->num_rows === 0) {
    $conn->query("ALTER TABLE organizers ADD COLUMN full_name varchar(255) DEFAULT NULL AFTER user_id");
}
$emCheck = $conn->query("SHOW COLUMNS FROM organizers LIKE 'email'");
if ($emCheck && $emCheck->num_rows === 0) {
    $conn->query("ALTER TABLE organizers ADD COLUMN email varchar(255) DEFAULT NULL AFTER full_name");
}
$phCheck = $conn->query("SHOW COLUMNS FROM organizers LIKE 'phone'");
if ($phCheck && $phCheck->num_rows === 0) {
    $conn->query("ALTER TABLE organizers ADD COLUMN phone varchar(50) DEFAULT NULL AFTER email");
}

// 5. Backfill data from users into customers, admins, and organizers
$usersRes = $conn->query("SELECT * FROM users");
$migrated = ["customers" => 0, "admins" => 0, "organizers" => 0];

if ($usersRes) {
    while ($user = $usersRes->fetch_assoc()) {
        $uId = $user['id'];
        $name = $conn->real_escape_string($user['full_name'] ?? '');
        $email = $conn->real_escape_string($user['email'] ?? '');
        $phone = $conn->real_escape_string($user['phone'] ?? '');
        $role = $user['role'] ?? 'customer';
        $adminRole = $user['admin_role'] ?? 'super_admin';

        if ($role === 'customer') {
            $check = $conn->query("SELECT id FROM customers WHERE user_id = {$uId}");
            if ($check && $check->num_rows === 0) {
                $conn->query("INSERT INTO customers (user_id, full_name, email, phone) VALUES ({$uId}, '{$name}', '{$email}', '{$phone}')");
                $migrated['customers']++;
            }
        } else if ($role === 'admin') {
            $check = $conn->query("SELECT id FROM admins WHERE user_id = {$uId}");
            if ($check && $check->num_rows === 0) {
                $conn->query("INSERT INTO admins (user_id, full_name, email, phone, admin_role) VALUES ({$uId}, '{$name}', '{$email}', '{$phone}', '{$adminRole}')");
                $migrated['admins']++;
            }
        } else if ($role === 'organizer') {
            $check = $conn->query("SELECT id FROM organizers WHERE user_id = {$uId}");
            if ($check && $check->num_rows === 0) {
                $orgName = !empty($name) ? $name : 'Organizer Account';
                $conn->query("INSERT INTO organizers (user_id, organization_name, full_name, email, phone, verification_status) VALUES ({$uId}, '{$orgName}', '{$name}', '{$email}', '{$phone}', 'approved')");
                $migrated['organizers']++;
            } else {
                $conn->query("UPDATE organizers SET full_name = '{$name}', email = '{$email}', phone = '{$phone}' WHERE user_id = {$uId}");
            }
        }
    }
}

echo json_encode([
    "status" => "success",
    "message" => "Database role tables setup and data migration completed successfully.",
    "migrated" => $migrated
]);

$conn->close();
?>
