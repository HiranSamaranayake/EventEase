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

?>