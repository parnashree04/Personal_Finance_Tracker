<?php

session_start();

include "../config/database.php";

if (!isset($_SESSION["user_id"])) {
    header("Location: ../auth/login.php");
    exit();
}

$user_id = $_SESSION["user_id"];

$stmt = $conn->prepare(
    "SELECT name, email, created_at FROM users WHERE id = ?"
);

$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();
$user = $result->fetch_assoc();

$stmt->close();

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>My Profile - Spendly</title>
</head>

<body>

    <h1>My Profile</h1>

    <hr>

    <h2>Personal Information</h2>

    <p>
        <strong>Name:</strong>
        <?php echo htmlspecialchars($user["name"]); ?>
    </p>

    <p>
        <strong>Email:</strong>
        <?php echo htmlspecialchars($user["email"]); ?>
    </p>

    <p>
        <strong>Account Created:</strong>
        <?php echo htmlspecialchars($user["created_at"]); ?>
    </p>

    <br>

    <a href="../dashboard/index.php">← Back to Dashboard</a>

    &nbsp;&nbsp;

    <a href="../auth/logout.php">Logout</a>

</body>

</html>