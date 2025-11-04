import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Playlists from './pages/Playlists';
import PlaylistRules from './pages/PlaylistRules';
import Reports from './pages/Reports';
import Devices from './pages/Devices';
import Subscriptions from './pages/Subscriptions';
import Settings from './pages/Settings';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/playlists/rules" element={<PlaylistRules />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
