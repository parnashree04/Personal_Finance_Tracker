import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import './SavingsGoalsPage.css';
import useUser from '../hooks/useUser';

const SavingsGoalsPage = () => {
  const user = useUser();
  const userName = user.name;
  const [showForm, setShowForm] = useState(false);
  const [goals, setGoals] = useState([]);
  const [editingGoalId, setEditingGoalId] = useState(null);

  const [formData, setFormData] = useState({
    goalName: '',
    targetAmount: '',
    targetDate: '',
    currentSaved: ''
  });
  useEffect(() => {
  fetch("http://localhost/Personal_Finance_Tracker/api/get_savings_goals.php", {
    credentials: 'include'
  })
    .then((res) => res.json())
    .then((data) => {
      console.log('Savings goals:', data);

      if (data.success) {
        setGoals(data.goals);
      }
    })
    .catch((error) => {
      console.error('Failed to load savings goals:', error);
    });
}, []);

  return (
    <div className="dashboard-page">
      <Sidebar />

      <div className="dashboard-main">
        <Header userName={userName} />
        
        <main className="dashboard-content">

          {/* Page Header */}
          <div className="savings-header">

            <div>
              <h2>Savings Goals</h2>

              <p className="savings-subtitle">
                Set and track your savings goals.
              </p>
            </div>

            <button
              className="btn-add-savings"
              onClick={() =>{
                setEditingGoalId(null);
                setFormData({
                  goalName: '',
                  targetAmount: '',
                  targetDate: '',
                  targetDate: '',
                });
                setShowForm(true);
              }}
              >
              + Add Savings Goal
            </button>
          </div>

          {/* Add Savings Goal Form */}
          {showForm && (
            <div className="savings-form">
              <h3>{editingGoalId ? 'Edit Savings Goal' : 'Add Savings Goal'}</h3>

              {/* Goal Name */}
              <div className="savings-form-group">
                <label>Goal Name</label>

                <input
                  type="text"
                  placeholder="e.g. New Laptop"
                  value={formData.goalName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      goalName: e.target.value
                    })
                  }
                />
              </div>

              {/* Target Amount */}
              <div className="savings-form-group">
                <label>Target Amount</label>

                <input
                  type="number"
                  placeholder="Enter target amount"
                  value={formData.targetAmount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      targetAmount: e.target.value
                    })
                  }
                  />
              </div>

              {/* Target Date */}
              <div  className="savings-form-group">
                <label>Target Date</label>

                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      targetDate: e.target.value
                    })
                  }
                />
              </div>

              {/* Current Saved Amount */}
              <div  className="savings-form-group">
                <label>Current Saved Amount</label>

                <input
                  type="number"
                  placeholder="Enter amount already saved"
                  value={formData.currentSaved}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentSaved: e.target.value
                    })
                  }
                  />
              </div>

              {/* Save Button */}
              <button
                className="btn-save-goal"
                onClick={() => {
                  fetch(
                    editingGoalId
                      ? "http://localhost/Personal_Finance_Tracker/api/update_savings_goal.php"
                      : "http://localhost/Personal_Finance_Tracker/api/add_savings_goal.php",
                    {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify(
                      editingGoalId
                        ? { ...formData, id: editingGoalId }
                        : formData
                    )
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      console.log("Add savings goal:", data);

                      if (data.success) {
                        setShowForm(false);

                        setFormData({
                        goalName: '',
                        targetAmount: '',
                        targetDate: '',
                        currentSaved: ''
                      });
                      setEditingGoalId(null);


                    // Refresh goals after adding
                    fetch("http://localhost/Personal_Finance_Tracker/api/get_savings_goals.php", {
                      credentials: "include"
                    })
                      .then((res) => res.json())
                      .then((goalData) => {
                      if (goalData.success) {
                        setGoals(goalData.goals);
                      }
                    });
                  } else {
                      alert(data.message);
                    }
                  })
                  .catch((error) => {
                    console.error("Failed to add savings goal:", error);
                  });
                }}
              >
                {editingGoalId ? 'Update Goal' : 'Save Goal'}
              </button>

              {/* Cancel Button */}
              <button
                className="btn-cancel-goal"
                onClick={() =>{
                  setShowForm(false);
                  setEditingGoalId(null);
                  setFormData({
                    goalName: '',
                    targetAmount: '',
                    targetDate: '',
                    currentSaved: ''
                  });
                }}
                >
                Cancel
              </button>
            </div>
          )}

          {/* Empty State */}
          {!showForm && goals.length === 0 && (
            <div className="savings-empty-state">
              <div className="savings-empty-icon">
                🎯
              </div>

              <strong>No savings goals yet</strong>

              <p>
                Add a savings goal to start tracking your progress.
              </p>
            </div>
          )}
          {/* Saved Goals */}
          {!showForm && goals.length > 0 && (
            <div className="savings-goals-list">
              {goals.map((goal) => {
                const target = Number(goal.target_amount);
                const current = Number(goal.current_amount || 0);

                const progress =
                  target > 0
                    ? Math.min((current / target) * 100, 100)
                    : 0;

                return (
                  <div className="savings-goal-card" key={goal.id}>
                    <div>
                      <div>
                        <h3>{goal.goal_name}</h3>
                        <p>
                          Target: ₹{target.toLocaleString()}
                        </p>
                      </div>

                      <div className="savings-goal-actions">
                      <strong>{Math.round(progress)}%</strong>
                      <button
                        className="btn-edit-goal"
                        onClick={() => {
                          setFormData({
                            goalName: goal.goal_name,
                            targetAmount: goal.target_amount,
                            targetDate: goal.deadline || '',
                            currentSaved: goal.current_amount || ''
                          });
                          
                          setEditingGoalId(goal.id);
                          setShowForm(true);
                        }}
                      >
                        Edit 
                      </button>
                    </div>
                  </div>

                    <div className="savings-progress-bar">
                      <div
                        className="savings-progress-fill"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    <div className="savings-goal-details">
                      <span>
                        Saved: ₹{current.toLocaleString()}
                      </span>

                      <span>
                        Deadline: {goal.deadline || 'Not set'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SavingsGoalsPage;