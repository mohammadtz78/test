import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="layout">
      <div className="topbar">
        <div className="topbar-content">
          <h1 className="app-title">🎵 Spotify Account Manager</h1>
        </div>
      </div>
      
      <div className="layout-body">
        <nav className="sidebar">
          <div className="sidebar-content">
            <Link 
              to="/dashboard" 
              className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
            >
              <span className="nav-icon">🏠</span>
              <span className="nav-text">Dashboard</span>
            </Link>
            
            <Link 
              to="/playlists" 
              className={`nav-item ${isActive('/playlists') ? 'active' : ''}`}
            >
              <span className="nav-icon">📝</span>
              <span className="nav-text">Playlists</span>
            </Link>
            
            <Link 
              to="/reports" 
              className={`nav-item ${isActive('/reports') ? 'active' : ''}`}
            >
              <span className="nav-icon">📊</span>
              <span className="nav-text">Reports</span>
            </Link>
            
            <Link 
              to="/devices" 
              className={`nav-item ${isActive('/devices') ? 'active' : ''}`}
            >
              <span className="nav-icon">📱</span>
              <span className="nav-text">Devices</span>
            </Link>
            
            <Link 
              to="/subscriptions" 
              className={`nav-item ${isActive('/subscriptions') ? 'active' : ''}`}
            >
              <span className="nav-icon">💳</span>
              <span className="nav-text">Subscriptions</span>
            </Link>
            
            <Link 
              to="/settings" 
              className={`nav-item ${isActive('/settings') ? 'active' : ''}`}
            >
              <span className="nav-icon">⚙️</span>
              <span className="nav-text">Settings</span>
            </Link>
          </div>
        </nav>
        
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
