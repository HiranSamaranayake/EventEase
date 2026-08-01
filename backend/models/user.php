<?php

class User
{
    private $conn;
    private $table = "users";

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function register($name, $email, $phone, $password, $role)
    {
        $checkQuery = "SELECT id FROM users WHERE email = ?";


        $checkStmt = $this->conn->prepare($checkQuery);
        $checkStmt->bind_param("s", $email);
        $checkStmt->execute();

        $checkResult = $checkStmt->get_result();

        if ($checkResult->num_rows > 0) {
            return "EMAIL_EXISTS";
        }

        $password = password_hash(
            $password,
            PASSWORD_DEFAULT
        );

        $query = "INSERT INTO users
          (full_name, email, phone, password, role)
          VALUES (?, ?, ?, ?, ?)";

        $stmt = $this->conn->prepare($query);

        if (!$stmt) {
            die("Prepare Failed: " . $this->conn->error);
        }

        $stmt->bind_param(
            "sssss",
            $name,
            $email,
            $phone,
            $password,
            $role
        );

        if ($stmt->execute()) {
            $userId = $stmt->insert_id;
            
            if ($role === 'customer') {
                $cStmt = $this->conn->prepare("INSERT INTO customers (user_id, full_name, email, phone) VALUES (?, ?, ?, ?)");
                if ($cStmt) {
                    $cStmt->bind_param("isss", $userId, $name, $email, $phone);
                    $cStmt->execute();
                }
            } else if ($role === 'organizer') {
                $orgName = !empty($name) ? $name : 'Organizer Account';
                $oStmt = $this->conn->prepare("INSERT INTO organizers (user_id, organization_name, full_name, email, phone, verification_status) VALUES (?, ?, ?, ?, ?, 'approved')");
                if ($oStmt) {
                    $oStmt->bind_param("issss", $userId, $orgName, $name, $email, $phone);
                    $oStmt->execute();
                }
            } else if ($role === 'admin') {
                $adminRole = 'super_admin';
                $aStmt = $this->conn->prepare("INSERT INTO admins (user_id, full_name, email, phone, admin_role) VALUES (?, ?, ?, ?, ?)");
                if ($aStmt) {
                    $aStmt->bind_param("issss", $userId, $name, $email, $phone, $adminRole);
                    $aStmt->execute();
                }
            }

            return true;
        } else {
            die("Database Error: " . $stmt->error);
        }
    }


    public function login($email, $password)
    {
        $query = "SELECT u.*, a.admin_role FROM users u LEFT JOIN admins a ON u.id = a.user_id WHERE u.email = ?";

        $stmt = $this->conn->prepare($query);

        $stmt->bind_param("s", $email);

        $stmt->execute();

        $result = $stmt->get_result();

        if ($result->num_rows > 0) {

            $user = $result->fetch_assoc();

            if (
                password_verify(
                    $password,
                    $user['password']
                )
            ) {
                return $user;
            }
        }

        return false;
    }
}
