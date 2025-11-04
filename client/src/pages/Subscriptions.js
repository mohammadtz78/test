import React, { useState, useEffect } from 'react';
import { subscriptionsAPI } from '../services/api';
import Card from '../components/Card';
import './Subscriptions.css';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await subscriptionsAPI.getAll();
      setSubscriptions(data);
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatCurrency = (amount, currency) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  if (loading && subscriptions.length === 0) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Subscriptions</h1>
          <p className="page-subtitle">View subscription details for all linked accounts</p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {subscriptions.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">💳</span>
          <h3>No subscriptions found</h3>
          <p>Link Spotify accounts to view their subscription details</p>
        </div>
      ) : (
        <div className="subscriptions-grid">
          {subscriptions.map((sub) => (
            <Card key={sub.id} elevated>
              <div className="subscription-card">
                <div className="subscription-header">
                  <h3 className="subscription-account">{sub.accountDisplayName || 'Unknown Account'}</h3>
                  <span className={`subscription-badge badge-${sub.productType?.toLowerCase()}`}>
                    {sub.planName}
                  </span>
                </div>

                <div className="subscription-details">
                  <div className="detail-row">
                    <span className="detail-label">Product Type</span>
                    <span className="detail-value">{sub.productType}</span>
                  </div>

                  {sub.currency && (
                    <div className="detail-row">
                      <span className="detail-label">Currency</span>
                      <span className="detail-value">{sub.currency}</span>
                    </div>
                  )}

                  {sub.nextBillingAmount && (
                    <div className="detail-row">
                      <span className="detail-label">Next Billing Amount</span>
                      <span className="detail-value">
                        {formatCurrency(sub.nextBillingAmount, sub.currency)}
                      </span>
                    </div>
                  )}

                  {sub.billingDate && (
                    <div className="detail-row">
                      <span className="detail-label">Next Billing Date</span>
                      <span className="detail-value">{formatDate(sub.billingDate)}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
