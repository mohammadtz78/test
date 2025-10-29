import React from 'react';
import '../styles/Navigation.css';

/**
 * Navigation Component
 * Fixed topbar navigation following the design system
 */
function Navigation() {
  return (
    <nav className="navigation">
      <div className="navigation-container container">
        <div className="navigation-brand">
          <a href="/" className="navigation-logo">
            HWP
          </a>
          <span className="navigation-title">Hello World Page</span>
        </div>
        
        <ul className="navigation-menu">
          <li className="navigation-menu-item">
            <a href="/" className="navigation-link active">
              Home
            </a>
          </li>
          <li className="navigation-menu-item">
            <a href="/" className="navigation-link">
              Settings
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
