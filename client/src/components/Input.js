import React from 'react';
import './Input.css';

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  helper,
  name,
  id,
  className = ''
}) => {
  const inputId = id || name;

  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      
      <input
        type={type}
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`input ${error ? 'input-error' : ''}`}
      />
      
      {error && <span className="input-error-text">{error}</span>}
      {helper && !error && <span className="input-helper-text">{helper}</span>}
    </div>
  );
};

export default Input;
