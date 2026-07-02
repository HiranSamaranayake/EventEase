<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../config/database.php";

$totalUsers = mysqli_fetch_assoc(
    mysqli_query($conn, "SELECT COUNT(*) AS total FROM users")
);

$totalCustomers = mysqli_fetch_assoc(
    mysqli_query($conn, "SELECT COUNT(*) AS total FROM users WHERE role='customer'")
);

$totalOrganizers = mysqli_fetch_assoc(
    mysqli_query($conn, "SELECT COUNT(*) AS total FROM users WHERE role='organizer'")
);

$totalEvents = mysqli_fetch_assoc(
    mysqli_query($conn, "SELECT COUNT(*) AS total FROM events")
);

$totalBookings = mysqli_fetch_assoc(
    mysqli_query($conn, "SELECT COUNT(*) AS total FROM bookings")
);

echo json_encode([
    "success" => true,
    "users" => $totalUsers["total"],
    "customers" => $totalCustomers["total"],
    "organizers" => $totalOrganizers["total"],
    "events" => $totalEvents["total"],
    "bookings" => $totalBookings["total"]
]);

?>