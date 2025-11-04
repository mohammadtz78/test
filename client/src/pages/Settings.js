import React from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import './Settings.css';

const Settings = () => {
  const handleExportData = () => {
    alert('Data export feature - This would typically download your data as JSON/CSV');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your preferences and data</p>
        </div>
      </div>

      <div className="settings-sections">
        <Card title="Data Export" elevated>
          <p className="settings-description">
            Export your listening history, playlists, and account data in JSON or CSV format.
          </p>
          <Button type="secondary" onClick={handleExportData}>
            Export Account Data
          </Button>
        </Card>

        <Card title="About" elevated>
          <div className="about-section">
            <p><strong>Spotify Account Manager</strong></p>
            <p>Version 1.0.0</p>
            <p className="settings-description">
              A comprehensive multi-account Spotify management application for managing
              playlists, tracking listening history, and automating playlist management
              across multiple Spotify accounts.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
