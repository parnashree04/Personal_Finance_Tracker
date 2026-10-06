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
$type = $data["type"] ?? "";
$amount = $data["amount"] ?? 0;
$category = $data["category"] ?? "";
$description = $data["description"] ?? "";
$date = $data["date"] ?? "";

if (
    empty($id) ||
    empty($type) ||
    empty($amount) ||
    empty($category) ||
    empty($date)
) {
    echo json_encode([
        "success" => false,
        "message" => "Required fields are missing"
    ]);
    exit();
}

/* Find category ID */
$category_stmt = $conn->prepare(
    "SELECT id FROM categories WHERE name = ? LIMIT 1"
);

$category_stmt->bind_param("s", $category);
$category_stmt->execute();

$category_result = $category_stmt->get_result();

if ($category_result->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Category not found"
    ]);
    exit();
}

$category_row = $category_result->fetch_assoc();
$category_id = $category_row["id"];

$category_stmt->close();

/* Update transaction */
$stmt = $conn->prepare(
    "UPDATE transactions
     SET type = ?,
         amount = ?,
         category_id = ?,
         description = ?,
         transaction_date = ?
     WHERE id = ? AND user_id = ?"
);

$stmt->bind_param(
    "sdissii",
    $type,
    $amount,
    $category_id,
    $description,
    $date,
    $id,
    $user_id
);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Transaction updated successfully"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Failed to update transaction"
    ]);
}

$stmt->close();

?>