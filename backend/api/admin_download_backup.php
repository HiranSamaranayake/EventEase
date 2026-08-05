<?php
require_once __DIR__ . '/../config/database.php';

$file_name = isset($_GET['file']) ? basename($_GET['file']) : '';

if (empty($file_name)) {
    http_response_code(400);
    echo "Backup file name required.";
    exit;
}

$filepath = __DIR__ . '/../../database/backups/' . $file_name;

if (!file_exists($filepath)) {
    http_response_code(404);
    echo "Backup snapshot file not found.";
    exit;
}

header('Content-Description: File Transfer');
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="' . $file_name . '"');
header('Expires: 0');
header('Cache-Control: must-revalidate');
header('Pragma: public');
header('Content-Length: ' . filesize($filepath));

readfile($filepath);
exit;
?>
