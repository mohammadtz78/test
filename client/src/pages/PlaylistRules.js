import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { playlistRulesAPI, spotifyAccountsAPI } from '../services/api';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import './PlaylistRules.css';

const PlaylistRules = () => {
  const navigate = useNavigate();
  const [rules, setRules] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [newRule, setNewRule] = useState({
    spotifyAccountId: '',
    name: '',
    ruleType: 'auto-add',
    criteriaJson: '{}',
    isActive: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [rulesData, accountsData] = await Promise.all([
        playlistRulesAPI.getAll(),
        spotifyAccountsAPI.getAll()
      ]);
      setRules(rulesData);
      setAccounts(accountsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRule = async () => {
    try {
      setLoading(true);
      await playlistRulesAPI.create(newRule);
      setShowCreateModal(false);
      setNewRule({
        spotifyAccountId: '',
        name: '',
        ruleType: 'auto-add',
        criteriaJson: '{}',
        isActive: true
      });
      await fetchData();
      alert('Rule created successfully!');
    } catch (err) {
      console.error('Error creating rule:', err);
      alert('Failed to create rule: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRule = async () => {
    try {
      setLoading(true);
      await playlistRulesAPI.update(editingRule.id, {
        name: editingRule.name,
        ruleType: editingRule.ruleType,
        criteriaJson: editingRule.criteriaJson,
        isActive: editingRule.isActive
      });
      setShowEditModal(false);
      setEditingRule(null);
      await fetchData();
      alert('Rule updated successfully!');
    } catch (err) {
      console.error('Error updating rule:', err);
      alert('Failed to update rule: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRule = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete rule "${name}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await playlistRulesAPI.delete(id);
      await fetchData();
      alert('Rule deleted successfully!');
    } catch (err) {
      console.error('Error deleting rule:', err);
      alert('Failed to delete rule: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (rule) => {
    try {
      setLoading(true);
      await playlistRulesAPI.update(rule.id, {
        isActive: !rule.isActive
      });
      await fetchData();
    } catch (err) {
      console.error('Error toggling rule:', err);
      alert('Failed to toggle rule: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (rule) => {
    setEditingRule({...rule});
    setShowEditModal(true);
  };

  if (loading && rules.length === 0) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading rules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <Button type="ghost" onClick={() => navigate('/playlists')}>
            ← Back to Playlists
          </Button>
          <h1 className="page-title">Playlist Automation Rules</h1>
          <p className="page-subtitle">Create and manage automated playlist rules</p>
        </div>
        <Button 
          type="primary" 
          onClick={() => setShowCreateModal(true)}
          icon="+"
        >
          Create Rule
        </Button>
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {rules.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">⚡</span>
          <h3>No automation rules</h3>
          <p>Create your first automation rule to manage playlists automatically</p>
          <Button type="primary" onClick={() => setShowCreateModal(true)}>
            Create Rule
          </Button>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Rule Name</th>
                <th>Type</th>
                <th>Account</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id}>
                  <td><strong>{rule.name}</strong></td>
                  <td>{rule.ruleType}</td>
                  <td>{rule.accountDisplayName || 'Unknown'}</td>
                  <td>
                    <button
                      className="toggle-button"
                      onClick={() => handleToggleActive(rule)}
                      title={rule.isActive ? 'Deactivate' : 'Activate'}
                    >
                      <span className={`badge ${rule.isActive ? 'badge-success' : 'badge-neutral'}`}>
                        {rule.isActive ? '✓ Active' : '✕ Inactive'}
                      </span>
                    </button>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="icon-button"
                        onClick={() => openEditModal(rule)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button 
                        className="icon-button danger"
                        onClick={() => handleDeleteRule(rule.id, rule.name)}
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
        title="Create Automation Rule"
        size="medium"
        footer={
          <>
            <Button type="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleCreateRule}>
              Create
            </Button>
          </>
        }
      >
        <Input
          label="Rule Name"
          value={newRule.name}
          onChange={(e) => setNewRule({...newRule, name: e.target.value})}
          required
          placeholder="My Automation Rule"
        />
        <div className="input-group">
          <label className="input-label">Spotify Account</label>
          <select
            className="input"
            value={newRule.spotifyAccountId}
            onChange={(e) => setNewRule({...newRule, spotifyAccountId: e.target.value})}
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
        <div className="input-group">
          <label className="input-label">Rule Type</label>
          <select
            className="input"
            value={newRule.ruleType}
            onChange={(e) => setNewRule({...newRule, ruleType: e.target.value})}
            required
          >
            <option value="auto-add">Auto-add</option>
            <option value="sync">Sync</option>
            <option value="filter">Filter</option>
          </select>
        </div>
        <Input
          label="Criteria (JSON)"
          value={newRule.criteriaJson}
          onChange={(e) => setNewRule({...newRule, criteriaJson: e.target.value})}
          placeholder='{"condition": "value"}'
        />
        <div className="input-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={newRule.isActive}
              onChange={(e) => setNewRule({...newRule, isActive: e.target.checked})}
            />
            <span>Activate rule immediately</span>
          </label>
        </div>
      </Modal>

      {editingRule && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Automation Rule"
          size="medium"
          footer={
            <>
              <Button type="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button type="primary" onClick={handleUpdateRule}>
                Save Changes
              </Button>
            </>
          }
        >
          <Input
            label="Rule Name"
            value={editingRule.name}
            onChange={(e) => setEditingRule({...editingRule, name: e.target.value})}
            required
          />
          <div className="input-group">
            <label className="input-label">Rule Type</label>
            <select
              className="input"
              value={editingRule.ruleType}
              onChange={(e) => setEditingRule({...editingRule, ruleType: e.target.value})}
              required
            >
              <option value="auto-add">Auto-add</option>
              <option value="sync">Sync</option>
              <option value="filter">Filter</option>
            </select>
          </div>
          <Input
            label="Criteria (JSON)"
            value={editingRule.criteriaJson}
            onChange={(e) => setEditingRule({...editingRule, criteriaJson: e.target.value})}
          />
          <div className="input-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={editingRule.isActive}
                onChange={(e) => setEditingRule({...editingRule, isActive: e.target.checked})}
              />
              <span>Rule is active</span>
            </label>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PlaylistRules;
