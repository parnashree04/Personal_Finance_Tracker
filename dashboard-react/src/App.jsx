import { BrowserRouter, Routes, Route } from 'react-router-dom';

import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import SavingsGoalsPage from './pages/SavingsGoalsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Dashboard */}
        <Route path="/" element={<DashboardPage />} />

        {/* Other pages - we'll create these next */}
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/savings" element={<SavingsGoalsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;