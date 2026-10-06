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
$id = $data["id"] ?? 0;
$goal_name = $data["goalName"] ?? "";
$target_amount = $data["targetAmount"] ?? 0;
$current_amount = $data["currentSaved"] ?? 0;
$deadline = $data["targetDate"] ?? null;

if (empty($id) || empty($goal_name) || empty($target_amount)) {
    echo json_encode([
        "success" => false,
        "message" => "Required fields are missing"
    ]);
    exit();
}

$stmt = $conn->prepare(
    "UPDATE savings_goal
     SET goal_name = ?,
         target_amount = ?,
         current_amount = ?,
         deadline = ?
     WHERE id = ? AND user_id = ?"
);

$stmt->bind_param(
    "sddssi",
    $goal_name,
    $target_amount,
    $current_amount,
    $deadline,
    $id,
    $user_id
);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Savings goal updated successfully"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Failed to update savings goal"
    ]);
}

$stmt->close();

?>