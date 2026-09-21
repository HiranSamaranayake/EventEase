<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/database.php';

$organizer_id = isset($_GET['organizer_id']) ? intval($_GET['organizer_id']) : 0;
$event_id = isset($_GET['event_id']) ? intval($_GET['event_id']) : 0;

$where = [];
$params = [];
$types = "";

if ($organizer_id > 0) {
    // Check if there is an associated organizer record ID in `organizers` table for this user_id
    $orgIdLookup = 0;
    $lookupQuery = mysqli_query($conn, "SELECT id FROM organizers WHERE user_id = '$organizer_id'");
    if ($lookupQuery && $row = mysqli_fetch_assoc($lookupQuery)) {
        $orgIdLookup = intval($row['id']);
    }

    if ($orgIdLookup > 0) {
        $where[] = "(p.organizer_id = ? OR p.organizer_id = ? OR p.organizer_id IS NULL OR e.organizer_id = ? OR e.organizer_id = ?)";
        $params[] = $organizer_id;
        $params[] = $orgIdLookup;
        $params[] = $organizer_id;
        $params[] = $orgIdLookup;
        $types .= "iiii";
    } else {
        $where[] = "(p.organizer_id = ? OR p.organizer_id IS NULL OR e.organizer_id = ?)";
        $params[] = $organizer_id;
        $params[] = $organizer_id;
        $types .= "ii";
    }
}

if ($event_id > 0) {
    $where[] = "(p.event_id = ? OR p.event_id IS NULL)";
    $params[] = $event_id;
    $types .= "i";
}

$sql = "SELECT p.*, e.title as event_title 
        FROM promo_codes p 
        LEFT JOIN events e ON p.event_id = e.id";

if (!empty($where)) {
    $sql .= " WHERE " . implode(" AND ", $where);
}
$sql .= " ORDER BY p.id DESC";

$stmt = $conn->prepare($sql);
if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}
$stmt->execute();
$result = $stmt->get_result();

$promos = [];
while ($row = $result->fetch_assoc()) {
    $promos[] = $row;
}

echo json_encode(["status" => "success", "data" => $promos]);
$stmt->close();
$conn->close();
?>
