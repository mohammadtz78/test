import React, { useEffect, useState } from 'react';
import '../styles/Toast.css';

/**
 * Toast Notification Component
 * Displays temporary notification messages
 * @param {Object} props - Component props
 * @param {string} props.message - Toast message text
 * @param {string} props.type - Toast type: 'success', 'error', 'warning', 'info' (default: 'info')
 * @param {number} props.duration - Duration in milliseconds (default: 5000)
 * @param {function} props.onClose - Callback when toast closes
 */
function Toast({ message, type = 'info', duration = 5000, onClose }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300); // Match animation duration
  };

  const getTitle = () => {
    switch (type) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Warning';
      case 'info':
      default:
        return 'Info';
    }
  };

  return (
    <div className={`toast ${type} ${isExiting ? 'toast-exit' : ''}`} role="alert">
      <div className="toast-header">
        <h3 className="toast-title">{getTitle()}</h3>
        <button 
          className="toast-close" 
          onClick={handleClose}
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
      <p className="toast-message">{message}</p>
    </div>
  );
}

export default Toast;
