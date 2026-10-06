import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import useUser from '../hooks/useUser';
import './SettingsPage.css';

const SettingsPage = () => {
  const user = useUser();
  const userName = user.name;

  const [darkMode, setDarkMode] = React.useState(
    localStorage.getItem('darkMode') === 'true'
  );
  const [notifications, setNotifications] = React.useState(
    localStorage.getItem('notifications') === 'true'
  );
  React.useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode);
    localStorage.setItem('notifications', notifications);
  }, [darkMode, notifications]);
  return (
    <div className="dashboard-page">

      <Sidebar />

      <div className="dashboard-main">

        <Header userName={userName} />

        <main className="dashboard-content">

          <div className="settings-page-header">
            <h2>Settings</h2>

            <p>
              Manage your account and application settings.
            </p>
          </div>

          <div className="settings-card">
            <h3>Profile Information</h3>

            <div className="settings-item">

              <p className="settings-item-title">Name</p>
              <p className="settings-item-value">{userName}</p>
            </div>
            <div className="settings-item">
              <p className="settings-item-title">Email</p>
              <p className="settings-item-value">{user.email}</p>
            </div>
          </div>
            <div className="settings-card settings-section">
              <h3>Appearance</h3>
              <div className="settings-toggle">
                <div className="settings-toggle-info">
                  <p className="settings-item-title">Dark Mode</p>
                  <p className="settings-item-value">
                    Change the appearance of FloStack.
                  </p>
                </div>
                <button 
                  className={`toggle-button ${darkMode ? 'active' : ''}`}
                  onClick={() => setDarkMode(!darkMode)}
                  >
                  </button>
              </div>
            </div>
            
            <div className="settings-card settings-notification">
              <h3>Notifications</h3>

                <div className="settings-notification-row">
                  <div className="settings-toggle-info">
                    <p className="settings-item-title">Enable Notifications</p>
                    <p className="settings-item-value">
                      Receive notifications about your finance activity.
                    </p>
                  </div>

                  <button
                    className={`toggle-button ${notifications ? 'active' : ''}`}
                    onClick={() => setNotifications(!notifications)}
                  >
                  </button>
                </div>
            </div>
            <div className="settings-card settings-section">
              <h3>Account</h3>
              <button className="settings-logout-button"
              onClick={() => {
                 window.location.href = 'http://localhost/Personal_Finance_Tracker/auth/logout.php';
                }}
              >
                Logout
              </button>
            </div>
          </main>

      </div>

    </div>
  );
};

export default SettingsPage;