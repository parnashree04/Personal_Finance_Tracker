<?php

session_start();

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");

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
        t.id,
        t.type,
        t.amount,
        t.description,
        t.transaction_date,
        c.name AS category
     FROM transactions t
     JOIN categories c ON t.category_id = c.id
     WHERE t.user_id = ?
     ORDER BY t.transaction_date DESC, t.id DESC"
);

$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();

$transactions = [];

while ($row = $result->fetch_assoc()) {
    $transactions[] = $row;
}

echo json_encode([
    "success" => true,
    "transactions" => $transactions
]);

$stmt->close();

?>