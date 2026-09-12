
<?php
include "../config/database.php";

$message = "";
$messageType = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $email = trim($_POST["email"]);

    // Check if email exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows == 1) {

        // Email exists
        $user = $result->fetch_assoc();

        // Store user ID temporarily for password reset
        session_start();
        $_SESSION["reset_user_id"] = $user["id"];

        // Go to reset password page
        header("Location: reset_password.php");
        exit();

    } else {

        $message = "No account found with this email.";
        $messageType = "error";
    }

    $stmt->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Forgot Password - FloStack</title>

    <link rel="stylesheet" href="style.css">
</head>

<body>

    <div class="card">

        <div class="brand">
            <span class="brand-name">FloStack</span>
        </div>

        <h2>Forgot Password?</h2>

        <p class="subtitle">
            Enter your registered email to reset your password.
        </p>

        <?php if ($message != ""): ?>

            <div class="message <?php echo htmlspecialchars($messageType); ?>">
                <?php echo htmlspecialchars($message); ?>
            </div>

        <?php endif; ?>

        <form method="POST">

            <div class="field">

                <label for="email">Email</label>

                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                >

            </div>

            <button type="submit">
                Continue
            </button>

        </form>

        <p class="footer-note">
            Remember your password?<br>
            <a href="login.php">Back to Login</a>
        </p>

    </div>

</body>
</html>
