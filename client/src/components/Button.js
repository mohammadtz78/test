import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  onClick, 
  type = 'primary', 
  disabled = false,
  size = 'medium',
  icon = null,
  fullWidth = false,
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${type} btn-${size} ${fullWidth ? 'btn-full-width' : ''} ${className}`}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      <span className="btn-text">{children}</span>
    </button>
  );
};

export default Button;
