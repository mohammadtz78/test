import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { playlistsAPI, spotifyAccountsAPI } from '../services/api';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import './Playlists.css';

const Playlists = () => {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [newPlaylist, setNewPlaylist] = useState({
    spotifyPlaylistId: '',
    spotifyAccountId: '',
    name: '',
    description: '',
    isPublic: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [playlistsData, accountsData] = await Promise.all([
        playlistsAPI.getAll(),
        spotifyAccountsAPI.getAll()
      ]);
      setPlaylists(playlistsData);
      setAccounts(accountsData);
    } catch (err) {
      console.error('Error fetching playlists:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async () => {
    try {
      setLoading(true);
      await playlistsAPI.create(newPlaylist);
      setShowCreateModal(false);
      setNewPlaylist({
        spotifyPlaylistId: '',
        spotifyAccountId: '',
        name: '',
        description: '',
        isPublic: true
      });
      await fetchData();
      alert('Playlist created successfully!');
    } catch (err) {
      console.error('Error creating playlist:', err);
      alert('Failed to create playlist: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPlaylist = async () => {
    try {
      setLoading(true);
      await playlistsAPI.update(editingPlaylist.id, {
        name: editingPlaylist.name,
        description: editingPlaylist.description,
        isPublic: editingPlaylist.isPublic
      });
      setShowEditModal(false);
      setEditingPlaylist(null);
      await fetchData();
      alert('Playlist updated successfully!');
    } catch (err) {
      console.error('Error updating playlist:', err);
      alert('Failed to update playlist: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlaylist = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await playlistsAPI.delete(id);
      await fetchData();
      alert('Playlist deleted successfully!');
    } catch (err) {
      console.error('Error deleting playlist:', err);
      alert('Failed to delete playlist: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (playlist) => {
    setEditingPlaylist({...playlist});
    setShowEditModal(true);
  };

  const filteredPlaylists = playlists.filter(playlist =>
    playlist.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    playlist.accountDisplayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && playlists.length === 0) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading playlists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Playlists</h1>
          <p className="page-subtitle">Manage playlists across all accounts</p>
        </div>
        <div className="header-actions">
          <Button 
            type="secondary" 
            onClick={() => navigate('/playlists/rules')}
          >
            Manage Rules
          </Button>
          <Button 
            type="primary" 
            onClick={() => setShowCreateModal(true)}
            icon="+"
          >
            Create Playlist
          </Button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className="filters-section">
        <Input
          placeholder="Search playlists..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredPlaylists.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📝</span>
          <h3>No playlists found</h3>
          <p>{searchTerm ? 'Try a different search term' : 'Create your first playlist to get started'}</p>
          {!searchTerm && (
            <Button type="primary" onClick={() => setShowCreateModal(true)}>
              Create Playlist
            </Button>
          )}
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Playlist Name</th>
                <th>Account</th>
                <th>Tracks</th>
                <th>Visibility</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlaylists.map((playlist) => (
                <tr key={playlist.id}>
                  <td>
                    <div className="playlist-name">
                      <strong>{playlist.name}</strong>
                      {playlist.description && (
                        <p className="playlist-description">{playlist.description}</p>
                      )}
                    </div>
                  </td>
                  <td>{playlist.accountDisplayName || 'Unknown'}</td>
                  <td>{playlist.trackCount || 0}</td>
                  <td>
                    <span className={`badge ${playlist.isPublic ? 'badge-success' : 'badge-neutral'}`}>
                      {playlist.isPublic ? 'Public' : 'Private'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="icon-button"
                        onClick={() => openEditModal(playlist)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button 
                        className="icon-button danger"
                        onClick={() => handleDeletePlaylist(playlist.id, playlist.name)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Playlist"
        size="medium"
        footer={
          <>
            <Button type="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleCreatePlaylist}>
              Create
            </Button>
          </>
        }
      >
        <Input
          label="Playlist Name"
          value={newPlaylist.name}
          onChange={(e) => setNewPlaylist({...newPlaylist, name: e.target.value})}
          required
          placeholder="My Awesome Playlist"
        />
        <Input
          label="Description"
          value={newPlaylist.description}
          onChange={(e) => setNewPlaylist({...newPlaylist, description: e.target.value})}
          placeholder="A description of the playlist"
        />
        <div className="input-group">
          <label className="input-label">Spotify Account</label>
          <select
            className="input"
            value={newPlaylist.spotifyAccountId}
            onChange={(e) => setNewPlaylist({...newPlaylist, spotifyAccountId: e.target.value})}
            required
          >
            <option value="">Select an account</option>
            {accounts.map(account => (
              <option key={account.id} value={account.id}>
                {account.displayName || account.spotifyUserId}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="Spotify Playlist ID"
          value={newPlaylist.spotifyPlaylistId}
          onChange={(e) => setNewPlaylist({...newPlaylist, spotifyPlaylistId: e.target.value})}
          required
          placeholder="playlist_xyz"
        />
        <div className="input-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={newPlaylist.isPublic}
              onChange={(e) => setNewPlaylist({...newPlaylist, isPublic: e.target.checked})}
            />
            <span>Make playlist public</span>
          </label>
        </div>
      </Modal>

      {editingPlaylist && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Playlist"
          size="medium"
          footer={
            <>
              <Button type="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button type="primary" onClick={handleEditPlaylist}>
                Save Changes
              </Button>
            </>
          }
        >
          <Input
            label="Playlist Name"
            value={editingPlaylist.name}
            onChange={(e) => setEditingPlaylist({...editingPlaylist, name: e.target.value})}
            required
          />
          <Input
            label="Description"
            value={editingPlaylist.description || ''}
            onChange={(e) => setEditingPlaylist({...editingPlaylist, description: e.target.value})}
          />
          <div className="input-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={editingPlaylist.isPublic}
                onChange={(e) => setEditingPlaylist({...editingPlaylist, isPublic: e.target.checked})}
              />
              <span>Make playlist public</span>
            </label>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Playlists;
