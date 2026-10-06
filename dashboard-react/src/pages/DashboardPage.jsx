import React, { useState, useEffect } from 'react';
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import StatCard from '../components/Dashboard/StateCard';
import RecentTransactions from '../components/Dashboard/RecentTransactions';
import './DashboardPage.css';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [userName, setUserName] = useState('FloStack User');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get logged-in user's name
    fetch('http://localhost/Personal_Finance_Tracker/api/user.php', {
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Logged-in user:', data);

        if (data.success && data.name) {
          setUserName(data.name);
        }
      })
      .catch((error) => {
        console.error('Failed to load user:', error);
      });

    // Get dashboard data
    fetch('http://localhost/Personal_Finance_Tracker/api/dashboard.php', {
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((data) => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to connect to backend:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="dashboard-page">
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      <Sidebar />

      <div className="dashboard-main">

        <Header userName={userName} />

        <main className="dashboard-content">

          <div className="stats-grid">

            <StatCard
              title="Total Balance"
              amount={`₹${dashboardData?.balance || 0}`}
              change={`${dashboardData?.balanceChange >= 0 ? '+' : ''}${dashboardData?.balanceChange || 0}%`}
              type="balance"
              icon="💰"
            />

            <StatCard
              title="Monthly Income"
              amount={`₹${dashboardData?.income || 0}`}
              change={`${dashboardData?.incomeChange >= 0 ? '+' : ''}${dashboardData?.incomeChange || 0}%`}
              type="income"
              icon="📈"
            />

            <StatCard
              title="Monthly Expense"
              amount={`₹${dashboardData?.expenses || 0}`}
              change={`${dashboardData?.expenseChange >= 0 ? '+' : ''}${dashboardData?.expenseChange || 0}%`}
              type="expense"
              icon="📉"
            />

            <StatCard
              title="Savings"
              amount={`₹${dashboardData?.savings || 0}`}
              change={`${dashboardData?.savingsChange >= 0 ? '+' : ''}${dashboardData?.savingsChange || 0}%`}
              type="savings"
              icon="🏦"
            />

          </div>

          <div className="analytics-grid">
            <RecentTransactions />
          </div>

        </main>

      </div>

    </div>
  );
};

export default DashboardPage;