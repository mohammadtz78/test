import React, { useState, useEffect } from 'react';
import { devicesAPI } from '../services/api';
import Button from '../components/Button';
import './Devices.css';

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await devicesAPI.getAll();
      setDevices(data);
    } catch (err) {
      console.error('Error fetching devices:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async (id, name) => {
    if (!window.confirm(`Are you sure you want to disconnect "${name}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await devicesAPI.delete(id);
      await fetchDevices();
      alert('Device disconnected successfully!');
    } catch (err) {
      console.error('Error disconnecting device:', err);
      alert('Failed to disconnect device: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && devices.length === 0) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading devices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Devices</h1>
          <p className="page-subtitle">Manage active Spotify devices and sessions</p>
        </div>
        <Button type="secondary" onClick={fetchDevices}>
          🔄 Refresh
        </Button>
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {devices.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📱</span>
          <h3>No active devices</h3>
          <p>No Spotify devices are currently active on your linked accounts</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Device Name</th>
                <th>Type</th>
                <th>Account</th>
                <th>Status</th>
                <th>Volume</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => (
                <tr key={device.id}>
                  <td>
                    <strong>{device.name}</strong>
                  </td>
                  <td>{device.type}</td>
                  <td>{device.accountDisplayName || 'Unknown'}</td>
                  <td>
                    <span className={`badge ${device.isActive ? 'badge-success' : 'badge-neutral'}`}>
                      {device.isActive ? '🟢 Active' : '⚫ Inactive'}
                    </span>
                  </td>
                  <td>{device.volumePercent !== null ? `${device.volumePercent}%` : 'N/A'}</td>
                  <td>
                    <button 
                      className="icon-button danger"
                      onClick={() => handleDisconnect(device.id, device.name)}
                      title="Disconnect device"
                    >
                      🔌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Devices;
