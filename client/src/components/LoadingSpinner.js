import React from 'react';
import '../styles/LoadingSpinner.css';

/**
 * Loading Spinner Component
 * Displays a loading indicator with optional text
 * @param {Object} props - Component props
 * @param {string} props.text - Loading text to display (default: "Loading...")
 * @param {boolean} props.small - Use small variant (default: false)
 */
function LoadingSpinner({ text = "Loading...", small = false }) {
  return (
    <div className={`loading-spinner-container ${small ? 'small' : ''}`}>
      <div className={`loading-spinner ${small ? 'small' : ''}`} role="status" aria-label="Loading">
        <span className="visually-hidden">Loading</span>
      </div>
      {text && (
        <p className="loading-spinner-text">{text}</p>
      )}
    </div>
  );
}

export default LoadingSpinner;
