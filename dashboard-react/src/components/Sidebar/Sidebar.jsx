import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>FloStack</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink 
          to="/" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <span>📊</span>
          <span>Dashboard</span>
        </NavLink>
        <NavLink 
          to="/transactions" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <span>💳</span>
          <span>Transactions</span>
        </NavLink>
        <NavLink 
          to="/savings" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <span>🎯</span>
          <span>Savings Goals</span>
        </NavLink>
        <NavLink 
          to="/reports" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <span>📈</span>
          <span>Reports</span>
        </NavLink>
        <NavLink 
          to="/settings" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <span>⚙️</span>
          <span>Settings</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;