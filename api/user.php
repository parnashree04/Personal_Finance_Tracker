<?php

session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if (!isset($_SESSION["user_id"])) {
    echo json_encode([
        "success" => false,
        "message" => "User not logged in"
    ]);
    exit();
}

include "../config/database.php";

$user_id = $_SESSION["user_id"];

$stmt = $conn->prepare(
    "SELECT name, email FROM users WHERE id = ?"
);

$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();
$user = $result->fetch_assoc();

$stmt->close();

if ($user) {
    echo json_encode([
        "success" => true,
        "name" => $user["name"],
        "email" => $user["email"]
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "User not found"
    ]);
}
?>