import React from 'react';
import './Card.css';

const Card = ({ 
  children, 
  title, 
  subtitle,
  actions,
  elevated = false,
  interactive = false,
  onClick,
  className = ''
}) => {
  const cardClass = `card ${elevated ? 'card-elevated' : ''} ${interactive ? 'card-interactive' : ''} ${className}`;

  return (
    <div className={cardClass} onClick={onClick}>
      {(title || subtitle || actions) && (
        <div className="card-header">
          <div className="card-header-text">
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

export default Card;
