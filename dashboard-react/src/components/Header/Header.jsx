import React from 'react';
import './Header.css';

const Header = ({ userName = 'FloStack User' }) => {
  const initials = userName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="header">
      <div className="header-left">
        <h1>Overview</h1>
      </div>

      <div className="header-right">
        <div className="user-profile">
          <div className="avatar">{initials}</div>

          <div className="user-info">
            <span className="user-name">{userName}</span>
            <span className="user-role">Personal Account</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;