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

// Total income
$incomeQuery = $conn->prepare(
    "SELECT COALESCE(SUM(amount), 0) AS total
     FROM transactions
     WHERE user_id = ? AND type = 'income'"
);

$incomeQuery->bind_param("i", $user_id);
$incomeQuery->execute();

$incomeResult = $incomeQuery->get_result()->fetch_assoc();
$totalIncome = (float)$incomeResult["total"];


// Total expenses
$expenseQuery = $conn->prepare(
    "SELECT COALESCE(SUM(amount), 0) AS total
     FROM transactions
     WHERE user_id = ? AND type = 'expense'"
);

$expenseQuery->bind_param("i", $user_id);
$expenseQuery->execute();

$expenseResult = $expenseQuery->get_result()->fetch_assoc();
$totalExpense = (float)$expenseResult["total"];


// Balance
$balance = $totalIncome - $totalExpense;


// Current month income and expense
$currentMonthQuery = $conn->prepare(
    "SELECT
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expense
     FROM transactions
     WHERE user_id = ?
       AND YEAR(transaction_date) = YEAR(CURDATE())
       AND MONTH(transaction_date) = MONTH(CURDATE())"
);

$currentMonthQuery->bind_param("i", $user_id);
$currentMonthQuery->execute();

$currentMonthResult = $currentMonthQuery->get_result()->fetch_assoc();

$currentMonthIncome = (float)$currentMonthResult["income"];
$currentMonthExpense = (float)$currentMonthResult["expense"];


// Previous month income and expense
$previousMonthQuery = $conn->prepare(
    "SELECT
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expense
     FROM transactions
     WHERE user_id = ?
       AND YEAR(transaction_date) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
       AND MONTH(transaction_date) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))"
);

$previousMonthQuery->bind_param("i", $user_id);
$previousMonthQuery->execute();

$previousMonthResult = $previousMonthQuery->get_result()->fetch_assoc();

$previousMonthIncome = (float)$previousMonthResult["income"];
$previousMonthExpense = (float)$previousMonthResult["expense"];

$currentMonthQuery->close();
$previousMonthQuery->close();


// Monthly income and expense data
$chartQuery = $conn->prepare(
    "SELECT 
        DATE_FORMAT(transaction_date, '%b') AS month,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense
     FROM transactions
     WHERE user_id = ?
     GROUP BY YEAR(transaction_date), MONTH(transaction_date)
     ORDER BY YEAR(transaction_date), MONTH(transaction_date)"
);
//Chat
$chartQuery->bind_param("i", $user_id);
$chartQuery->execute();

$chartResult = $chartQuery->get_result();

$chartData = [];

while ($row = $chartResult->fetch_assoc()) {
    $chartData[] = [
        "month" => $row["month"],
        "income" => (float)$row["income"],
        "expense" => (float)$row["expense"]
    ];
}

$chartQuery->close();


// Send data to React
// Percentage change calculations
$incomeChange = $previousMonthIncome > 0
    ? (($currentMonthIncome - $previousMonthIncome) / $previousMonthIncome) * 100
    : 0;

$expenseChange = $previousMonthExpense > 0
    ? (($currentMonthExpense - $previousMonthExpense) / $previousMonthExpense) * 100
    : 0;


// Monthly savings
$currentMonthSavings = $currentMonthIncome - $currentMonthExpense;
$previousMonthSavings = $previousMonthIncome - $previousMonthExpense;


// Savings percentage change
$savingsChange = $previousMonthSavings != 0
    ? (($currentMonthSavings - $previousMonthSavings) / abs($previousMonthSavings)) * 100
    : 0;

// Total balance percentage change
$previousBalance = $previousMonthIncome - $previousMonthExpense;

$balanceChange = $previousBalance != 0
    ? (($balance - $previousBalance) / abs($previousBalance)) * 100
    : 0;

// Send data to React
echo json_encode([
    "success" => true,
    "balance" => $balance,
    "income" => $currentMonthIncome,
    "expenses" => $currentMonthExpense,
    "savings" => $currentMonthSavings,

    "incomeChange" => round($incomeChange, 1),
    "expenseChange" => round($expenseChange, 1),
    "balanceChange" => round($balanceChange, 1),
    "savingsChange" => round($savingsChange, 1),

    "chartData" => $chartData
]);

?>