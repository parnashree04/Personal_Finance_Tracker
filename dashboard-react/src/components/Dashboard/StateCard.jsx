import React from 'react';
import './StateCard.css';

const StatCard = ({ title, amount, change, type, icon }) => {
  const isPositive = change?.startsWith('+');

  return (
    <div className={`stat-card type-${type}`}>
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        <div className="stat-icon">{icon}</div>
      </div>
      <div className="stat-value">{amount}</div>
      <div className="stat-footer">
        <span className={isPositive ? 'trend-positive' : 'trend-negative'}>
          {change}
        </span>
        <span> vs last month</span>
      </div>
    </div>
  );
};

export default StatCard;