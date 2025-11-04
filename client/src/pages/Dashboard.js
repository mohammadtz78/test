import React, { useState, useEffect } from 'react';
import { spotifyAccountsAPI, dashboardAPI } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import './Dashboard.css';

const Dashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAccount, setNewAccount] = useState({
    spotifyUserId: '',
    displayName: '',
    userId: 1,
    accountType: 'Premium',
    accessToken: '',
    refreshToken: '',
    tokenExpirationInstant: '',
    scope: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [accountsData, dashData] = await Promise.all([
        spotifyAccountsAPI.getAll(),
        dashboardAPI.getOverview()
      ]);
      setAccounts(accountsData);
      setDashboardData(dashData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = async () => {
    try {
      setLoading(true);
      await spotifyAccountsAPI.create(newAccount);
      setShowAddModal(false);
      setNewAccount({
        spotifyUserId: '',
        displayName: '',
        userId: 1,
        accountType: 'Premium',
        accessToken: '',
        refreshToken: '',
        tokenExpirationInstant: '',
        scope: ''
      });
      await fetchData();
      alert('Spotify account linked successfully!');
    } catch (err) {
      console.error('Error adding account:', err);
      alert('Failed to link account: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (id, displayName) => {
    if (!window.confirm(`Are you sure you want to unlink "${displayName}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await spotifyAccountsAPI.delete(id);
      await fetchData();
      alert('Account unlinked successfully!');
    } catch (err) {
      console.error('Error deleting account:', err);
      alert('Failed to unlink account: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading && accounts.length === 0) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Manage your linked Spotify accounts</p>
        </div>
        <Button 
          type="primary" 
          onClick={() => setShowAddModal(true)}
          icon="+"
        >
          Link New Account
        </Button>
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {accounts.length === 0 ? (
        <Card>
          <div className="empty-state">
            <span className="empty-icon">🎵</span>
            <h3>No Spotify accounts linked</h3>
            <p>Link your first Spotify account to get started</p>
            <Button type="primary" onClick={() => setShowAddModal(true)}>
              Link Account
            </Button>
          </div>
        </Card>
      ) : (
        <div className="accounts-grid">
          {dashboardData.map((account) => (
            <Card key={account.spotifyAccountId} elevated>
              <div className="account-card">
                <div className="account-header">
                  <div>
                    <h3 className="account-name">{account.spotifyDisplayName || 'Unnamed Account'}</h3>
                    <span className={`account-badge badge-${account.accountType?.toLowerCase()}`}>
                      {account.accountType || 'Free'}
                    </span>
                  </div>
                  <button 
                    className="icon-button danger"
                    onClick={() => handleDeleteAccount(account.spotifyAccountId, account.spotifyDisplayName)}
                    title="Unlink account"
                  >
                    🗑️
                  </button>
                </div>

                <div className="account-stats">
                  <div className="stat-item">
                    <span className="stat-label">Playlists</span>
                    <span className="stat-value">{account.playlistCount || 0}</span>
                  </div>
                </div>

                {account.lastListenedTrack && (
                  <div className="recent-activity">
                    <h4>Last Played</h4>
                    <p className="track-name">{account.lastListenedTrack}</p>
                    <p className="track-artist">{account.lastListenedArtist}</p>
                    <p className="track-time">{formatDate(account.lastListenedAtInstant)}</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Link Spotify Account"
        size="medium"
        footer={
          <>
            <Button type="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleAddAccount}>
              Link Account
            </Button>
          </>
        }
      >
        <Input
          label="Spotify User ID"
          value={newAccount.spotifyUserId}
          onChange={(e) => setNewAccount({...newAccount, spotifyUserId: e.target.value})}
          required
          placeholder="spotify_user_123"
        />
        <Input
          label="Display Name"
          value={newAccount.displayName}
          onChange={(e) => setNewAccount({...newAccount, displayName: e.target.value})}
          placeholder="My Spotify Account"
        />
        <Input
          label="Account Type"
          value={newAccount.accountType}
          onChange={(e) => setNewAccount({...newAccount, accountType: e.target.value})}
          placeholder="Premium or Free"
        />
        <Input
          label="Access Token"
          value={newAccount.accessToken}
          onChange={(e) => setNewAccount({...newAccount, accessToken: e.target.value})}
          required
          placeholder="access_token_here"
        />
        <Input
          label="Refresh Token"
          value={newAccount.refreshToken}
          onChange={(e) => setNewAccount({...newAccount, refreshToken: e.target.value})}
          required
          placeholder="refresh_token_here"
        />
        <Input
          label="Token Expiration"
          type="datetime-local"
          value={newAccount.tokenExpirationInstant}
          onChange={(e) => setNewAccount({...newAccount, tokenExpirationInstant: e.target.value + ':00Z'})}
          required
        />
        <Input
          label="Scope"
          value={newAccount.scope}
          onChange={(e) => setNewAccount({...newAccount, scope: e.target.value})}
          placeholder="user-read-playback-state user-modify-playback-state"
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
