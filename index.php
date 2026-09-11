<!-- ?php
//include "config/database.php";
//echo"Database Connected Successfully";
?> -->





<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>FloStack - Personal Finance Tracker</title>

    <link rel="stylesheet" href="assets/css/style.css">
</head>

<body>

    <!-- Navbar -->
    <nav class="navbar">

        <div class="logo">
            FloStack
        </div>

        <div class="nav-buttons">
            <a href="auth/register.php" class="btn signup">
                Sign Up
            </a>

            <a href="auth/login.php" class="btn login">
                Login
            </a>
        </div>

    </nav>


    <!-- Hero Section -->
    <section class="hero">

        <div class="hero-content">

            <p class="small-title">
                SMART MONEY MANAGEMENT
            </p>

            <h1>
                Track Your<br>
                <span>Expenses</span><br>
                Effortlessly
            </h1>

            <p class="description">
                Take control of your finances with an intuitive
                personal finance tracker. Track your spending,
                set budgets, and reach your financial goals.
            </p>

            <div class="hero-buttons">

                <a href="auth/register.php" class="primary-btn">
                    Get Started →
                </a>

                <a href="#features" class="secondary-btn">
                    Learn More
                </a>

            </div>

        </div>


        <!-- Finance Illustration -->
        <div class="hero-image">

            <div class="laptop">

                <div class="screen">

                    <div class="screen-title">
                        Your Finances
                    </div>

                    <div class="chart chart-one"></div>
                    <div class="chart chart-two"></div>
                    <div class="chart chart-three"></div>

                    <div class="mini-card">
                        Balance<br>
                        <strong>₹25,500</strong>
                    </div>

                    <div class="mini-card small">
                        Income<br>
                        <strong>+ ₹5,000</strong>
                    </div>

                </div>

                <div class="keyboard"></div>

            </div>

        </div>

    </section>


    <!-- Features -->
    <section class="features" id="features">

        <h2>Key Features</h2>

        <div class="feature-container">

            <div class="feature">
                <div class="icon">💰</div>

                <h3>Track Expenses</h3>

                <p>
                    Easily record and organize your daily expenses.
                </p>
            </div>


            <div class="feature">
                <div class="icon">📋</div>

                <h3>Expense Categories</h3>

                <p>
                    Divide money into groups to track spending, build budgets.
                </p>
            </div>


            <div class="feature">
                <div class="icon">📊</div>

                <h3>View Analytics</h3>

                <p>
                    Understand where your money is going with
                    simple financial insights.
                </p>
            </div>

        </div>

    </section>

</body>

</html>