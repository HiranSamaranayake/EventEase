<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once "../config/database.php";

$raw = file_get_contents("php://input");
$data = json_decode($raw, true) ?? [];

$eventId = intval($data["event_id"] ?? $_POST["event_id"] ?? 0);
$userId = intval($data["user_id"] ?? $_POST["user_id"] ?? 0);
$title = trim($data["title"] ?? $_POST["title"] ?? "");
$description = trim($data["description"] ?? $_POST["description"] ?? "");
$eventDate = trim($data["event_date"] ?? $_POST["event_date"] ?? "");
$location = trim($data["location"] ?? $_POST["location"] ?? "");
$price = floatval($data["price"] ?? $_POST["price"] ?? 0);
$capacity = intval($data["capacity"] ?? $_POST["capacity"] ?? 0);
$category = trim($data["category"] ?? $_POST["category"] ?? "General");

if (!$eventId || empty($title) || empty($description) || empty($eventDate) || empty($location)) {
    echo json_encode([
        "success" => false,
        "message" => "Missing required fields"
    ]);
    exit;
}

// Ownership verification
$eventCheck = mysqli_query($conn, "SELECT organizer_id FROM events WHERE id = '$eventId' LIMIT 1");
if (!$eventCheck || mysqli_num_rows($eventCheck) == 0) {
    echo json_encode([
        "success" => false,
        "message" => "Event not found"
    ]);
    exit;
}

$eventRow = mysqli_fetch_assoc($eventCheck);
$eventOrgId = intval($eventRow['organizer_id']);

if ($userId > 0) {
    $orgQuery = mysqli_query($conn, "SELECT id FROM organizers WHERE user_id='$userId'");
    $orgId = 0;
    if ($orgQuery && mysqli_num_rows($orgQuery) > 0) {
        $orgRow = mysqli_fetch_assoc($orgQuery);
        $orgId = intval($orgRow['id']);
    } else {
        $orgQuery2 = mysqli_query($conn, "SELECT id FROM organizers WHERE id='$userId'");
        if ($orgQuery2 && mysqli_num_rows($orgQuery2) > 0) {
            $orgRow2 = mysqli_fetch_assoc($orgQuery2);
            $orgId = intval($orgRow2['id']);
        }
    }

    if ($eventOrgId !== $orgId && $eventOrgId !== $userId) {
        // Admin check
        $uQuery = mysqli_query($conn, "SELECT role FROM users WHERE id='$userId' LIMIT 1");
        $uRole = '';
        if ($uQuery && $uRow = mysqli_fetch_assoc($uQuery)) {
            $uRole = strtolower($uRow['role'] ?? '');
        }

        if ($uRole !== 'admin') {
            echo json_encode([
                "success" => false,
                "message" => "Unauthorized access: You do not have permission to edit this event."
            ]);
            exit;
        }
    }
}

$query = "
UPDATE events
SET
    title = '" . mysqli_real_escape_string($conn, $title) . "',
    description = '" . mysqli_real_escape_string($conn, $description) . "',
    event_date = '" . mysqli_real_escape_string($conn, $eventDate) . "',
    location = '" . mysqli_real_escape_string($conn, $location) . "',
    price = '$price',
    capacity = '$capacity',
    category = '" . mysqli_real_escape_string($conn, $category) . "'
WHERE id = '$eventId'
";

$result = mysqli_query($conn, $query);

if ($result) {
    echo json_encode([
        "success" => true,
        "message" => "Event updated successfully"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => mysqli_error($conn)
    ]);
}
?>