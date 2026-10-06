import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import './TransactionsPage.css';
import useUser from '../hooks/useUser';

const TransactionsPage = () => {
  const user = useUser();
  const userName = user.name;
  const [showForm, setShowForm] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  

  const [formData, setFormData] = useState({
  type: 'income',
  amount: '',
  category: '',
  description: '',
  date: ''
  });

  useEffect(() => {
    fetch('http://localhost/Personal_Finance_Tracker/api/get_transactions.php', {
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Transactions from database:', data);

        if (data.success) {
          setTransactions(data.transactions);
        }
      })
      .catch((error) => {
        console.error('Failed to load transactions:', error);
      });
  }, []);
    // Filter transactions based on search
const filteredTransactions = transactions.filter((transaction) => {
  const search = searchTerm.toLowerCase();

  return (
    transaction.description?.toLowerCase().includes(search) ||
    transaction.category?.toLowerCase().includes(search) ||
    transaction.transaction_date?.toLowerCase().includes(search) ||
    transaction.amount?.toString().includes(search)
  );
});

// Group transactions by month
const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
  const date = new Date(transaction.transaction_date);
    const monthYear = date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });

    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }

    groups[monthYear].push(transaction);

    return groups;
  }, {});

  // Sort months from newest to oldest
  const sortedMonths = Object.keys(groupedTransactions).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  // Keep Salary at the top of each month
  sortedMonths.forEach((month) => {
    groupedTransactions[month].sort((a, b) => {
      const aIsSalary =
        a.category?.toLowerCase() === 'salary' ||
        a.description?.toLowerCase().includes('salary');

      const bIsSalary =
        b.category?.toLowerCase() === 'salary' ||
        b.description?.toLowerCase().includes('salary');

      if (aIsSalary && !bIsSalary) return -1;
      if (!aIsSalary && bIsSalary) return 1;

      return (
        new Date(b.transaction_date) -
        new Date(a.transaction_date)
      );
    });
  });

    return (
    <div className="dashboard-page">
      <Sidebar />

      <div className="dashboard-main">
        <Header userName={userName} />

        <main className="dashboard-content">

          <div className="transaction-header">
            <h2>Transactions</h2>

            <div className="transaction-search">
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              className="btn-add-transaction"
              onClick={() => setShowForm(true)}
            >
            + Add Transaction
          </button>
        </div>

          {showForm && (
            <div className="transaction-form">

              <h3>
                {editingTransactionId ? 'Edit Transaction' : 'Add Transaction'}
              </h3>

              <div className="form-group">
                <label>Transaction Type</label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value
                    })
                  }
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amount: e.target.value
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  placeholder="e.g. Food, Salary, Bills"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      date: e.target.value
                    })
                  }
                />
              </div>

              <button
                type="button"
                className="btn-save-transaction"
                onClick={async () => {
                  try {
                    const response = await fetch(
                       editingTransactionId
                        ? 'http://localhost/Personal_Finance_Tracker/api/update_transaction.php'
                        : 'http://localhost/Personal_Finance_Tracker/api/add_transaction.php',
                      {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(
                          editingTransactionId
                           ? { ...formData, id: editingTransactionId }
                           : formData
                        )
                      }
                    );

                    const result = await response.json();

                    console.log(result);

                    if (result.success) {
                      alert(
                        editingTransactionId
                          ? 'Transaction updated successfully!'
                          : 'Transaction added successfully!'
                      );

                      const refreshResponse = await fetch(
                        'http://localhost/Personal_Finance_Tracker/api/get_transactions.php',
                      {
                        credentials: 'include'
                      }
                    );

                    const refreshData = await refreshResponse.json();

                    if (refreshData.success) {
                      setTransactions(refreshData.transactions);
                    }

                    setEditingTransactionId(null);
                    setShowForm(false);

                    setFormData({
                      type: 'income',
                      amount: '',
                      category: '',
                      description: '',
                      date: ''
                    });
                  } else {
                      alert(result.message);
                    }
                  } catch (error) {
                    console.error(error);
                    alert('Failed to connect to the server.');
                  }
                }}
              >
                {editingTransactionId ? 'Update Transaction' : 'Save Transaction'}
              </button>

              <button
                type="button"
                className="btn-cancel-transaction"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

            </div>
          )}

          <div className="report-section-card">

            {sortedMonths.map((month) => (
              <div key={month} className="month-section">

                <h3 className="month-heading">
                  {month}
                </h3>

                <table className="report-history-table">

                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Date</th>
                      <th>Amount</th>
                      {/* <th>Actions</th>
                      <th>Actions</th> */}
                    </tr>
                  </thead>

                  <tbody>

                    {groupedTransactions[month].map((tx) => (
                      <tr key={tx.id}>

                        <td>
                          <strong>{tx.description}</strong>
                        </td>

                        <td>
                          {tx.category}
                        </td>

                        <td>
                          {tx.transaction_date}
                        </td>

                        <td
                          className={
                            tx.type === 'income'
                              ? 'transaction-income'
                              : 'transaction-expense'
                          }
                        >
                          {tx.type === 'income' ? '+' : '-'}₹{tx.amount}
                        </td>
                        <td>
                          <button
                            className="btn-edit-transaction"
                            onClick={() => {
                              setFormData({
                                type:tx.type,
                                amount: tx.amount,
                                category: tx.category,
                                description: tx.description,
                                date: tx.transaction_date
                              });

                              setEditingTransactionId(tx.id);
                              setShowForm(true);
                            }}
                          >
                            Edit
                          </button>
                        </td>
                        <td>
                          <button
                          className='btn-delete-transaction'
                          onClick={async () => {
                            const confirmed=window.confirm(
                              'Are you sure you want to delete this transaction?'
                            );
                            if(!confirmed){
                              return;
                            }
                            try{
                              const response=await fetch(
                                'http://localhost/Personal_Finance_Tracker/api/delete_transaction.php',
                                {
                                  method:'POST',
                                  credentials: 'include',
                                  headers: {
                                    'Content-Type': 'application/json'
                                  },
                                  body: JSON.stringify({
                                    id: tx.id
                                  })
                                }
                              );
                              const result = await response.json();
                              
                              if (result.success) {
                                alert('Transaction deleted successfully!');

                                setTransactions(
                                  transactions.filter(
                                    (transaction) => transaction.id !== tx.id
                                  )
                                );
                              }else{
                                alert(result.message);
                              }
                            }catch (error) {
                              console.error(error);
                              alert('Failed to connect to the server.');
                            }
                            }}
                          >
                            Delete
                          </button>
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>
            ))}

          </div>

        </main>
      </div>
    </div>
  );
};

export default TransactionsPage;