public function login($email, $password)
{
    $query = "SELECT * FROM users WHERE email = ?";

    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("s", $email);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();

        if ($user['password'] === $password) {
            return $user;
        }
    }

    return false;
}