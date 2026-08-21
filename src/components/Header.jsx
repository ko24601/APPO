import React from 'react';
import './Header.css';

const Header = ({ title }) => {
  return (
    <header className="app-header">
      <h1>{title}</h1>
      <div className="header-info">
        <span className="current-time">{new Date().toLocaleTimeString()}</span>
        <span className="date">{new Date().toLocaleDateString()}</span>
      </div>
    </header>
  );
};

export default Header;