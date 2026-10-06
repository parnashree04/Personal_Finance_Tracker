import React from 'react';
import './Reports.css';

const Reports = () => {
  return (
    <div className="reports-card">
      <div className="reports-header">
        <h3>Financial Reports</h3>
        <p>View and generate your financial reports.</p>
      </div>

      <div
        style={{
          padding: '2rem 1rem',
          textAlign: 'center',
          color: '#64748b'
        }}
      >
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          📄
        </div>

        <strong>No reports available</strong>

        <p style={{ margin: '0.4rem 0 0', fontSize: '0.85rem' }}>
          Your financial reports will appear here.
        </p>
      </div>

      <button className="btn-generate">
        Generate New Report
      </button>
    </div>
  );
};

export default Reports;