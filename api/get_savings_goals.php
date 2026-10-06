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

$user_id = $_SESSION["user_id"];

$stmt = $conn->prepare(
    "SELECT 
        id,
        goal_name,
        target_amount,
        current_amount,
        deadline,
        created_by
     FROM savings_goal
     WHERE user_id = ?
     ORDER BY deadline ASC, id DESC"
);

$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();

$goals = [];

while ($row = $result->fetch_assoc()) {
    $goals[] = $row;
}

echo json_encode([
    "success" => true,
    "goals" => $goals
]);

$stmt->close();

?>