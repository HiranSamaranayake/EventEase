<?php

require_once __DIR__ . "/config/database.php";

$cols = [
    "phone" => "VARCHAR(50) NULL",
    "website" => "VARCHAR(255) NULL",
    "address" => "TEXT NULL",
    "business_registration_number" => "VARCHAR(100) NULL",
    "nic_passport" => "VARCHAR(100) NULL",
    "document_path" => "VARCHAR(255) NULL",
    "verification_status" => "ENUM('pending', 'approved', 'verified', 'rejected') DEFAULT 'pending'",
    "rejection_reason" => "TEXT NULL",
    "submitted_at" => "TIMESTAMP NULL"
];

foreach ($cols as $col => $type) {
    $check = mysqli_query($conn, "SHOW COLUMNS FROM organizers LIKE '$col'");
    if ($check && mysqli_num_rows($check) == 0) {
        $alter = "ALTER TABLE organizers ADD COLUMN $col $type";
        if (mysqli_query($conn, $alter)) {
            echo "Added column: $col" . PHP_EOL;
        } else {
            echo "Failed adding $col: " . mysqli_error($conn) . PHP_EOL;
        }
    } else {
        echo "Column $col already exists." . PHP_EOL;
    }
}
