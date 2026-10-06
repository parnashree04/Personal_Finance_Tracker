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

if (empty($id)) {
    echo json_encode([
        "success" => false,
        "message" => "Transaction ID is required"
    ]);
    exit();
}

$stmt = $conn->prepare(
    "DELETE FROM transactions
     WHERE id = ? AND user_id = ?"
);

$stmt->bind_param(
    "ii",
    $id,
    $user_id
);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Transaction deleted successfully"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Failed to delete transaction"
    ]);
}

$stmt->close();

?>