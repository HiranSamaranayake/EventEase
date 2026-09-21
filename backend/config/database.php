<?php

$host = "localhost";
$user = "root";
$password = "";
$database = "eventease";

$conn = new mysqli(
    $host,
    $user,
    $password,
    $database
);

if ($conn->connect_error) {
    die("Connection Failed");
}

// Auto-migrate events table columns for Audience Restrictions if missing
$colCheck = mysqli_query($conn, "SHOW COLUMNS FROM events LIKE 'audience_restriction_type'");
if ($colCheck && mysqli_num_rows($colCheck) == 0) {
    mysqli_query($conn, "ALTER TABLE events ADD COLUMN audience_restriction_type VARCHAR(50) DEFAULT 'public'");
    mysqli_query($conn, "ALTER TABLE events ADD COLUMN allowed_email_domain VARCHAR(255) DEFAULT NULL");
    mysqli_query($conn, "ALTER TABLE events ADD COLUMN audience_passcode VARCHAR(100) DEFAULT NULL");
    mysqli_query($conn, "ALTER TABLE events ADD COLUMN restriction_label VARCHAR(255) DEFAULT NULL");
}

?>