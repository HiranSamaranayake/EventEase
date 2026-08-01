<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

// GET ALL SUB-ADMINS OR CANDIDATE NON-ADMIN USERS
if ($method === 'GET') {
    $type = $_GET['type'] ?? 'admins';

    if ($type === 'candidates') {
        // Return non-admin users and organizers for promotion
        $res = $conn->query("SELECT id, full_name, email, role FROM users WHERE role != 'admin' ORDER BY full_name ASC");
        $candidates = [];
        if ($res) {
            while ($row = $res->fetch_assoc()) {
                $candidates[] = $row;
            }
        }
        echo json_encode(["success" => true, "data" => $candidates]);
        exit();
    }

    // Return all sub-admins, joined with admins table
    $query = "SELECT u.id, u.full_name, u.email, u.phone, u.created_at, 
              COALESCE(a.admin_role, 'super_admin') as admin_role
              FROM users u
              LEFT JOIN admins a ON u.id = a.user_id
              WHERE u.role = 'admin' 
              ORDER BY u.created_at DESC";
    $res = $conn->query($query);
    $admins = [];
    if ($res) {
        while ($row = $res->fetch_assoc()) {
            $admins[] = $row;
        }
    }

    echo json_encode(["success" => true, "data" => $admins]);
    exit();
}

// POST CREATE NEW SUB-ADMIN OR PROMOTE EXISTING USER
if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? 'create';
    $admin_role = trim($input['admin_role'] ?? 'support_admin');

    if ($action === 'promote') {
        $user_id = intval($input['user_id'] ?? 0);
        if (!$user_id) {
            echo json_encode(["success" => false, "message" => "Valid user_id required for promotion."]);
            exit();
        }

        // Fetch candidate details
        $stmt = $conn->prepare("SELECT full_name, email, phone FROM users WHERE id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $uRes = $stmt->get_result()->fetch_assoc();

        if (!$uRes) {
            echo json_encode(["success" => false, "message" => "User record not found."]);
            exit();
        }

        // Update user role to admin
        $upStmt = $conn->prepare("UPDATE users SET role = 'admin' WHERE id = ?");
        $upStmt->bind_param("i", $user_id);
        
        if ($upStmt->execute()) {
            // Upsert into admins table
            $aCheck = $conn->query("SELECT id FROM admins WHERE user_id = {$user_id}");
            if ($aCheck && $aCheck->num_rows > 0) {
                $conn->query("UPDATE admins SET admin_role = '{$admin_role}', full_name = '" . $conn->real_escape_string($uRes['full_name']) . "', email = '" . $conn->real_escape_string($uRes['email']) . "' WHERE user_id = {$user_id}");
            } else {
                $conn->query("INSERT INTO admins (user_id, full_name, email, phone, admin_role) VALUES ({$user_id}, '" . $conn->real_escape_string($uRes['full_name']) . "', '" . $conn->real_escape_string($uRes['email']) . "', '" . $conn->real_escape_string($uRes['phone']) . "', '{$admin_role}')");
            }

            echo json_encode(["success" => true, "message" => "User promoted to Sub-Admin successfully!"]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to promote user: " . $conn->error]);
        }
        exit();
    }

    // Default: Provision Brand New Account
    $full_name = trim($input['full_name'] ?? '');
    $email = trim($input['email'] ?? '');
    $phone = trim($input['phone'] ?? '');
    $password = trim($input['password'] ?? '');

    if (empty($full_name) || empty($email) || empty($password)) {
        echo json_encode(["success" => false, "message" => "Full Name, Email, and Password are required."]);
        exit();
    }

    // Check duplicate
    $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $check->bind_param("s", $email);
    $check->execute();
    if ($check->get_result()->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "User email already exists."]);
        exit();
    }

    $hashed_pass = password_hash($password, PASSWORD_DEFAULT);
    $role = 'admin';

    $stmt = $conn->prepare("INSERT INTO users (full_name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $full_name, $email, $phone, $hashed_pass, $role);

    if ($stmt->execute()) {
        $new_id = $stmt->insert_id;
        
        // Insert into admins table
        $aStmt = $conn->prepare("INSERT INTO admins (user_id, full_name, email, phone, admin_role) VALUES (?, ?, ?, ?, ?)");
        if ($aStmt) {
            $aStmt->bind_param("issss", $new_id, $full_name, $email, $phone, $admin_role);
            $aStmt->execute();
        }

        echo json_encode(["success" => true, "message" => "Sub-Admin provisioned successfully!", "id" => $new_id]);
    } else {
        echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
    }
    exit();
}

// PUT UPDATE SUB-ADMIN ROLE
if ($method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = intval($input['id'] ?? 0);
    $admin_role = trim($input['admin_role'] ?? 'support_admin');

    if (!$id) {
        echo json_encode(["success" => false, "message" => "Sub-Admin ID required."]);
        exit();
    }

    // Update role in admins table
    $aCheck = $conn->query("SELECT id FROM admins WHERE user_id = {$id}");
    if ($aCheck && $aCheck->num_rows > 0) {
        $conn->query("UPDATE admins SET admin_role = '{$admin_role}' WHERE user_id = {$id}");
    } else {
        $uRes = $conn->query("SELECT full_name, email, phone FROM users WHERE id = {$id}")->fetch_assoc();
        if ($uRes) {
            $conn->query("INSERT INTO admins (user_id, full_name, email, phone, admin_role) VALUES ({$id}, '" . $conn->real_escape_string($uRes['full_name']) . "', '" . $conn->real_escape_string($uRes['email']) . "', '" . $conn->real_escape_string($uRes['phone']) . "', '{$admin_role}')");
        }
    }

    echo json_encode(["success" => true, "message" => "Sub-Admin role updated successfully."]);
    exit();
}

// DELETE REVOKE ADMIN ACCESS
if ($method === 'DELETE') {
    $id = intval($_GET['id'] ?? 0);
    if (!$id) {
        echo json_encode(["success" => false, "message" => "Sub-Admin ID required."]);
        exit();
    }

    // Demote role to customer and remove from admins table
    $stmt = $conn->prepare("UPDATE users SET role = 'customer' WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        $conn->query("DELETE FROM admins WHERE user_id = {$id}");
        
        // Ensure customer entry exists
        $cCheck = $conn->query("SELECT id FROM customers WHERE user_id = {$id}");
        if ($cCheck && $cCheck->num_rows === 0) {
            $uRes = $conn->query("SELECT full_name, email, phone FROM users WHERE id = {$id}")->fetch_assoc();
            if ($uRes) {
                $conn->query("INSERT INTO customers (user_id, full_name, email, phone) VALUES ({$id}, '" . $conn->real_escape_string($uRes['full_name']) . "', '" . $conn->real_escape_string($uRes['email']) . "', '" . $conn->real_escape_string($uRes['phone']) . "')");
            }
        }

        echo json_encode(["success" => true, "message" => "Sub-Admin access revoked successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to revoke admin access: " . $conn->error]);
    }
    exit();
}

$conn->close();
?>
