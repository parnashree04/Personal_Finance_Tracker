import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './RecentTransactions.css';

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch("http://localhost/Personal_Finance_Tracker/api/get_transactions.php", {
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Dashboard transactions:', data);

        if (data.success) {
          setTransactions(data.transactions);
        }
      })
      .catch((error) => {
        console.error('Failed to load transactions:', error);
      });
  }, []);

  return (
    <div className="recent-transactions-card">
      <div className="card-header">
        <h3>Recent Transactions</h3>

        <Link to="/transactions" className="view-all-link">
          View All →
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div
          style={{
            padding: '2.5rem 1rem',
            textAlign: 'center',
            color: '#64748b'
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            💳
          </div>

          <strong>No transactions yet</strong>

          <p style={{ margin: '0.4rem 0 0', fontSize: '0.85rem' }}>
            Your recent income and expenses will appear here.
          </p>
        </div>
      ) : (
        <table className="dashboard-tx-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Category</th>
              <th>Date</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {transactions.slice(0, 5).map((transaction) => (
              <tr key={transaction.id}>
                <td><strong>{transaction.description}</strong></td>
                <td>{transaction.category}</td>
                <td>{transaction.transaction_date}</td>
                <td
                  className={
                    transaction.type === 'income'
                      ? 'amount-income'
                      : 'amount-expense'
                  }
                >
                  {transaction.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RecentTransactions;