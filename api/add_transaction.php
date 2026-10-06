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

$data = json_decode(file_get_contents("php://input"), true);

$type = $data["type"] ?? "";
$amount = $data["amount"] ?? "";
$category = $data["category"] ?? "";
$description = $data["description"] ?? "";
$date = $data["date"] ?? "";

if (
    empty($type) ||
    empty($amount) ||
    empty($category) ||
    empty($date)
) {
    echo json_encode([
        "success" => false,
        "message" => "Please fill all required fields"
    ]);
    exit();
}

$categoryQuery = $conn->prepare(
    "SELECT id FROM categories WHERE user_id = ? AND name = ? AND type = ? LIMIT 1"
);

$categoryQuery->bind_param("iss", $user_id, $category, $type);
$categoryQuery->execute();

$categoryResult = $categoryQuery->get_result();

if ($categoryResult->num_rows > 0) {

    $categoryRow = $categoryResult->fetch_assoc();
    $category_id = $categoryRow["id"];

} else {

    $categoryInsert = $conn->prepare(
        "INSERT INTO categories (user_id, name, type) VALUES (?, ?, ?)"
    );

    $categoryInsert->bind_param(
        "iss",
        $user_id,
        $category,
        $type
    );

    if (!$categoryInsert->execute()) {
        echo json_encode([
            "success" => false,
            "message" => "Failed to create category"
        ]);
        exit();
    }

    $category_id = $categoryInsert->insert_id;

    $categoryInsert->close();
}
$stmt = $conn->prepare(
    "INSERT INTO transactions
    (user_id, category_id, type, amount, description, transaction_date)
    VALUES (?, ?, ?, ?, ?, ?)"
);

$stmt->bind_param(
    "iisdss",
    $user_id,
    $category_id,
    $type,
    $amount,
    $description,
    $date
);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Transaction added successfully"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Failed to add transaction"
    ]);
}

$stmt->close();
$categoryQuery->close();

?>