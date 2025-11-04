import React, { useState, useEffect } from 'react';
import { listeningActivityAPI } from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import './Reports.css';

const Reports = () => {
  const [listeningActivity, setListeningActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listeningActivityAPI.getAll();
      setListeningActivity(data);
    } catch (err) {
      console.error('Error fetching listening activity:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate statistics
  const totalTracks = listeningActivity.length;
  const totalDuration = listeningActivity.reduce((sum, activity) => sum + (activity.durationPlayedMs || 0), 0);
  const totalHours = (totalDuration / 3600000).toFixed(1);

  // Get top artists
  const artistCounts = {};
  listeningActivity.forEach(activity => {
    const artist = activity.artist || 'Unknown';
    artistCounts[artist] = (artistCounts[artist] || 0) + 1;
  });
  const topArtists = Object.entries(artistCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (loading && listeningActivity.length === 0) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading listening activity...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Listening Reports</h1>
          <p className="page-subtitle">View your listening history and statistics</p>
        </div>
        <Button type="secondary" onClick={fetchActivity}>
          🔄 Refresh
        </Button>
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className="stats-grid">
        <Card elevated>
          <div className="stat-card">
            <span className="stat-icon">🎵</span>
            <div>
              <p className="stat-label">Total Tracks</p>
              <p className="stat-number">{totalTracks}</p>
            </div>
          </div>
        </Card>

        <Card elevated>
          <div className="stat-card">
            <span className="stat-icon">⏱️</span>
            <div>
              <p className="stat-label">Total Hours</p>
              <p className="stat-number">{totalHours}</p>
            </div>
          </div>
        </Card>

        <Card elevated>
          <div className="stat-card">
            <span className="stat-icon">🎤</span>
            <div>
              <p className="stat-label">Unique Artists</p>
              <p className="stat-number">{Object.keys(artistCounts).length}</p>
            </div>
          </div>
        </Card>
      </div>

      {topArtists.length > 0 && (
        <Card title="Top Artists" className="top-artists-card">
          <div className="top-artists-list">
            {topArtists.map(([artist, count], index) => (
              <div key={artist} className="artist-item">
                <span className="artist-rank">#{index + 1}</span>
                <span className="artist-name">{artist}</span>
                <span className="artist-count">{count} plays</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card title="Recent Listening Activity">
        {listeningActivity.length === 0 ? (
          <div className="empty-state-inline">
            <p>No listening activity recorded yet</p>
          </div>
        ) : (
          <div className="table-container-inline">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Track</th>
                  <th>Artist</th>
                  <th>Album</th>
                  <th>Account</th>
                  <th>Duration</th>
                  <th>Played At</th>
                </tr>
              </thead>
              <tbody>
                {listeningActivity.slice(0, 20).map((activity) => (
                  <tr key={activity.id}>
                    <td><strong>{activity.trackName}</strong></td>
                    <td>{activity.artist}</td>
                    <td>{activity.album}</td>
                    <td>{activity.accountDisplayName}</td>
                    <td>{formatDuration(activity.durationPlayedMs)}</td>
                    <td>{formatDate(activity.listenedAtInstant)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Reports;
