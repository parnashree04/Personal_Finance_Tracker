
<?php
session_start();
include "../config/database.php";

$message = "";
$messageType = "";

// Check if user came through forgot password
if (!isset($_SESSION["reset_user_id"])) {
    header("Location: forgot_password.php");
    exit();
}

$user_id = $_SESSION["reset_user_id"];

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $new_password = $_POST["new_password"];
    $confirm_password = $_POST["confirm_password"];

    // Check if passwords match
    if ($new_password !== $confirm_password) {

        $message = "Passwords do not match.";
        $messageType = "error";

    } elseif (strlen($new_password) < 6) {

        $message = "Password must be at least 6 characters.";
        $messageType = "error";

    } else {

        // Securely hash the new password
        $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

        // Update password in database
        $stmt = $conn->prepare(
            "UPDATE users SET password = ? WHERE id = ?"
        );

        $stmt->bind_param("si", $hashed_password, $user_id);

        if ($stmt->execute()) {

            // Remove reset session
            unset($_SESSION["reset_user_id"]);

            // Redirect to login with success message
            header("Location: login.php?reset=success");
            exit();

        } else {

            $message = "Something went wrong. Please try again.";
            $messageType = "error";
        }

        $stmt->close();
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Reset Password - FloStack</title>

    <link rel="stylesheet" href="style.css">

</head>

<body>

    <div class="card">

        <div class="brand">
            <span class="brand-name">FloStack</span>
        </div>

        <h2>Reset Password</h2>

        <p class="subtitle">
            Create a new password for your account.
        </p>

        <?php if ($message != ""): ?>

            <div class="message <?php echo htmlspecialchars($messageType); ?>">
                <?php echo htmlspecialchars($message); ?>
            </div>

        <?php endif; ?>

        <form method="POST">

            <div class="field">

                <label for="new_password">New Password</label>

                <input
                    type="password"
                    id="new_password"
                    name="new_password"
                    placeholder="Enter new password"
                    required
                >

            </div>

            <div class="field">

                <label for="confirm_password">Confirm Password</label>

                <input
                    type="password"
                    id="confirm_password"
                    name="confirm_password"
                    placeholder="Confirm new password"
                    required
                >

            </div>

            <button type="submit">
                Reset Password
            </button>

        </form>

        <p class="footer-note">
            Remember your password?<br>
            <a href="login.php">Back to Login</a>
        </p>

    </div>

</body>

</html>
