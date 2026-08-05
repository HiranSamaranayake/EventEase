<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);
$admin_id = isset($data['admin_id']) ? intval($data['admin_id']) : 7;

$backup_dir = __DIR__ . '/../../database/backups';
if (!file_exists($backup_dir)) {
    mkdir($backup_dir, 0777, true);
}

$timestamp = date('Y-m-d_H-i-s');
$filename = "eventease_backup_" . $timestamp . ".sql";
$filepath = $backup_dir . "/" . $filename;

// Fetch all tables in database
$tables = [];
$res = $conn->query("SHOW TABLES");
if ($res) {
    while ($row = $res->fetch_array()) {
        $tables[] = $row[0];
    }
}

// Generate SQL dump content
$sql_content = "-- EventEase Database Backup Snapshot\n";
$sql_content .= "-- Generated: " . date('Y-m-d H:i:s') . "\n";
$sql_content .= "-- Database: " . $database . "\n\n";
$sql_content .= "SET FOREIGN_KEY_CHECKS=0;\n\n";

foreach ($tables as $tbl) {
    // Structure
    $create_res = $conn->query("SHOW CREATE TABLE `" . $tbl . "`");
    if ($create_res && $row = $create_res->fetch_array()) {
        $sql_content .= "DROP TABLE IF EXISTS `" . $tbl . "`;\n";
        $sql_content .= $row[1] . ";\n\n";
    }

    // Data
    $data_res = $conn->query("SELECT * FROM `" . $tbl . "`");
    if ($data_res) {
        while ($r = $data_res->fetch_assoc()) {
            $keys = array_keys($r);
            $vals = array_map(function($v) use ($conn) {
                if ($v === null) return "NULL";
                return "'" . mysqli_real_escape_string($conn, $v) . "'";
            }, array_values($r));

            $sql_content .= "INSERT INTO `" . $tbl . "` (`" . implode("`, `", $keys) . "`) VALUES (" . implode(", ", $vals) . ");\n";
        }
        $sql_content .= "\n";
    }
}

$sql_content .= "SET FOREIGN_KEY_CHECKS=1;\n";

file_put_contents($filepath, $sql_content);
$file_size = filesize($filepath);
$tables_count = count($tables);
$relative_path = "database/backups/" . $filename;

// Log backup entry in database
$stmt = $conn->prepare("INSERT INTO database_backups (file_name, file_path, file_size, tables_count, created_by, status) VALUES (?, ?, ?, ?, ?, 'completed')");
$stmt->bind_param("ssiii", $filename, $relative_path, $file_size, $tables_count, $admin_id);

if ($stmt->execute()) {
    $backup_id = $conn->insert_id;
    echo json_encode([
        "status" => "success",
        "message" => "Database backup snapshot generated successfully.",
        "backup" => [
            "id" => $backup_id,
            "file_name" => $filename,
            "file_size" => $file_size,
            "tables_count" => $tables_count,
            "created_at" => date('Y-m-d H:i:s')
        ]
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Backup generated but failed to record log: " . $conn->error]);
}

$stmt->close();
$conn->close();
?>
