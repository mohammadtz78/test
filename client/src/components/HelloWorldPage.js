import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';
import Toast from './Toast';
import '../styles/HelloWorldPage.css';

/**
 * Hello World Page Component
 * Main page that displays the Hello World message from the backend
 */
function HelloWorldPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastConfig, setToastConfig] = useState({});

  useEffect(() => {
    fetchHelloWorldMessage();
  }, []);

  /**
   * Fetch Hello World message from backend API
   */
  const fetchHelloWorldMessage = async () => {
    try {
      setLoading(true);
      setError(null);

      // Call the backend OData endpoint
      const response = await axios.get('http://localhost:5000/api/SystemSetting/HelloWorld');
      
      if (response.data && response.data.settingValue) {
        setMessage(response.data.settingValue);
        
        // Show success toast
        setToastConfig({
          message: 'Message loaded successfully!',
          type: 'success'
        });
        setShowToast(true);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching Hello World message:', err);
      
      const errorMessage = err.response?.data?.message 
        || err.message 
        || 'Failed to load message from server';
      
      setError(errorMessage);
      
      // Show error toast
      setToastConfig({
        message: errorMessage,
        type: 'error'
      });
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Retry loading the message
   */
  const handleRetry = () => {
    fetchHelloWorldMessage();
  };

  return (
    <div className="hello-world-page">
      <div className="hello-world-content container">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Hello World Page</h1>
          <p className="page-subtitle">
            Welcome to the System Settings Management Application
          </p>
        </div>

        {/* Main Content Card */}
        <div className="card elevated">
          {loading ? (
            // Loading State
            <LoadingSpinner text="Loading message from server..." />
          ) : error ? (
            // Error State
            <div className="error-display">
              <span className="error-icon" role="img" aria-label="Error">⚠️</span>
              <h2 className="error-title">Oops! Something went wrong</h2>
              <p className="error-message">{error}</p>
              <button 
                onClick={handleRetry}
                style={{
                  marginTop: '24px',
                  backgroundColor: '#5E6AD2',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 250ms ease-in-out'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#4F5CBF'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#5E6AD2'}
              >
                Try Again
              </button>
            </div>
          ) : (
            // Success State
            <div className="message-display">
              <span className="badge success">Active</span>
              <span className="message-icon" role="img" aria-label="Hello">👋</span>
              <h2 className="message-text">{message}</h2>
              <p className="message-description">
                This message is fetched from the SQLite database via the backend API
              </p>
            </div>
          )}
        </div>

        {/* Additional Info Section */}
        {!loading && !error && (
          <div className="info-section">
            <h2 style={{
              fontFamily: "'SF Pro Display', sans-serif",
              fontSize: '24px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '8px'
            }}>
              System Information
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#6B7280',
              marginBottom: '24px'
            }}>
              Current application status and configuration
            </p>
            
            <div className="info-grid">
              <div className="info-card">
                <h3 className="info-card-title">Status</h3>
                <p className="info-card-value">✅ Running</p>
              </div>
              
              <div className="info-card">
                <h3 className="info-card-title">Database</h3>
                <p className="info-card-value">SQLite</p>
              </div>
              
              <div className="info-card">
                <h3 className="info-card-title">Backend</h3>
                <p className="info-card-value">Node.js + Express</p>
              </div>
              
              <div className="info-card">
                <h3 className="info-card-title">Frontend</h3>
                <p className="info-card-value">React 18</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastConfig.message}
          type={toastConfig.type}
          duration={5000}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}

export default HelloWorldPage;
