<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once "../config/database.php";

$eventId = intval($_GET["id"] ?? $_POST["id"] ?? 0);
$userId = intval($_GET["user_id"] ?? $_POST["user_id"] ?? 0);

if (!$eventId) {
    echo json_encode([
        "success" => false,
        "message" => "Event ID is required"
    ]);
    exit;
}

$query = "SELECT * FROM events WHERE id = '$eventId' LIMIT 1";
$result = mysqli_query($conn, $query);

if (!$result || mysqli_num_rows($result) == 0) {
    echo json_encode([
        "success" => false,
        "message" => "Event not found"
    ]);
    exit;
}

$event = mysqli_fetch_assoc($result);

// Ownership verification if user_id is provided
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

    $eventOrgId = intval($event['organizer_id']);
    if ($eventOrgId !== $orgId && $eventOrgId !== $userId) {
        // Also check if user is super admin / admin
        $uQuery = mysqli_query($conn, "SELECT role FROM users WHERE id='$userId' LIMIT 1");
        $uRole = '';
        if ($uQuery && $uRow = mysqli_fetch_assoc($uQuery)) {
            $uRole = strtolower($uRow['role'] ?? '');
        }

        if ($uRole !== 'admin') {
            echo json_encode([
                "success" => false,
                "message" => "Unauthorized access: You do not have permission to view or edit this event."
            ]);
            exit;
        }
    }
}

echo json_encode([
    "success" => true,
    "event" => $event
]);
?>