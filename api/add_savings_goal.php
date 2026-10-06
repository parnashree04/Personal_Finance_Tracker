<?php

session_start();

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../config/database.php";

if (!isset($_SESSION["user_id"])) {
    echo json_encode([
        "success" => false,
        "message" => "User not logged in"
    ]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $_SESSION["user_id"];
$goal_name = $data["goalName"] ?? "";
$target_amount = $data["targetAmount"] ?? 0;
$current_amount = $data["currentSaved"] ?? 0;
$deadline = $data["targetDate"] ?? null;

if (empty($goal_name) || empty($target_amount)) {
    echo json_encode([
        "success" => false,
        "message" => "Goal name and target amount are required"
    ]);
    exit();
}

$stmt = $conn->prepare(
    "INSERT INTO savings_goal
    (user_id, goal_name, target_amount, current_amount, deadline)
    VALUES (?, ?, ?, ?, ?)"
);

$stmt->bind_param(
    "isdds",
    $user_id,
    $goal_name,
    $target_amount,
    $current_amount,
    $deadline
);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Savings goal added successfully"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Failed to add savings goal"
    ]);
}

$stmt->close();

?>