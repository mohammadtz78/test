import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handler
const handleError = (error) => {
  console.error('API Error:', error);
  if (error.response) {
    throw new Error(error.response.data.error || 'Server error occurred');
  } else if (error.request) {
    throw new Error('No response from server. Please check if the server is running.');
  } else {
    throw new Error('Error setting up request: ' + error.message);
  }
};

// ==================== USER API ====================
export const usersAPI = {
  getAll: async () => {
    try {
      const response = await apiClient.get('/users');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

// ==================== SPOTIFY ACCOUNT API ====================
export const spotifyAccountsAPI = {
  getAll: async () => {
    try {
      const response = await apiClient.get('/spotify-accounts');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/spotify-accounts/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  create: async (data) => {
    try {
      const response = await apiClient.post('/spotify-accounts', data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/spotify-accounts/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/spotify-accounts/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

// ==================== PLAYLIST API ====================
export const playlistsAPI = {
  getAll: async () => {
    try {
      const response = await apiClient.get('/playlists');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/playlists/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  getTracks: async (id) => {
    try {
      const response = await apiClient.get(`/playlists/${id}/tracks`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  create: async (data) => {
    try {
      const response = await apiClient.post('/playlists', data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/playlists/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/playlists/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  addTrack: async (playlistId, trackId, position) => {
    try {
      const response = await apiClient.post(`/playlists/${playlistId}/tracks`, {
        trackId,
        position,
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  removeTrack: async (playlistId, trackId) => {
    try {
      const response = await apiClient.delete(`/playlists/${playlistId}/tracks/${trackId}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

// ==================== TRACK API ====================
export const tracksAPI = {
  getAll: async () => {
    try {
      const response = await apiClient.get('/tracks');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/tracks/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  create: async (data) => {
    try {
      const response = await apiClient.post('/tracks', data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

// ==================== LISTENING ACTIVITY API ====================
export const listeningActivityAPI = {
  getAll: async () => {
    try {
      const response = await apiClient.get('/listening-activity');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  getByAccount: async (accountId) => {
    try {
      const response = await apiClient.get(`/listening-activity/account/${accountId}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  create: async (data) => {
    try {
      const response = await apiClient.post('/listening-activity', data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/listening-activity/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

// ==================== DEVICE API ====================
export const devicesAPI = {
  getAll: async () => {
    try {
      const response = await apiClient.get('/devices');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  getByAccount: async (accountId) => {
    try {
      const response = await apiClient.get(`/devices/account/${accountId}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  create: async (data) => {
    try {
      const response = await apiClient.post('/devices', data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/devices/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/devices/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

// ==================== SUBSCRIPTION API ====================
export const subscriptionsAPI = {
  getAll: async () => {
    try {
      const response = await apiClient.get('/subscriptions');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/subscriptions/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/subscriptions/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

// ==================== PLAYLIST RULE API ====================
export const playlistRulesAPI = {
  getAll: async () => {
    try {
      const response = await apiClient.get('/playlist-rules');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/playlist-rules/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  create: async (data) => {
    try {
      const response = await apiClient.post('/playlist-rules', data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/playlist-rules/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/playlist-rules/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

// ==================== DASHBOARD API ====================
export const dashboardAPI = {
  getOverview: async (userId) => {
    try {
      const response = await apiClient.get('/dashboard', {
        params: { userId },
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

export default {
  users: usersAPI,
  spotifyAccounts: spotifyAccountsAPI,
  playlists: playlistsAPI,
  tracks: tracksAPI,
  listeningActivity: listeningActivityAPI,
  devices: devicesAPI,
  subscriptions: subscriptionsAPI,
  playlistRules: playlistRulesAPI,
  dashboard: dashboardAPI,
};
