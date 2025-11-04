const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// ==================== USER ENDPOINTS ====================

// Get all users
app.get('/api/users', (req, res) => {
  db.all('SELECT * FROM User ORDER BY id', [], (err, rows) => {
    if (err) {
      console.error('Error fetching users:', err.message);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
    res.json(rows);
  });
});

// Get user by ID
app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM User WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error fetching user:', err.message);
      return res.status(500).json({ error: 'Failed to fetch user' });
    }
    if (!row) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(row);
  });
});

// ==================== SPOTIFY ACCOUNT ENDPOINTS ====================

// Get all Spotify accounts
app.get('/api/spotify-accounts', (req, res) => {
  const query = `
    SELECT sa.*, u.displayName as userDisplayName
    FROM SpotifyAccount sa
    LEFT JOIN User u ON sa.userId = u.id
    ORDER BY sa.id
  `;
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching Spotify accounts:', err.message);
      return res.status(500).json({ error: 'Failed to fetch Spotify accounts' });
    }
    res.json(rows);
  });
});

// Get Spotify account by ID
app.get('/api/spotify-accounts/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT sa.*, u.displayName as userDisplayName
    FROM SpotifyAccount sa
    LEFT JOIN User u ON sa.userId = u.id
    WHERE sa.id = ?
  `;
  db.get(query, [id], (err, row) => {
    if (err) {
      console.error('Error fetching Spotify account:', err.message);
      return res.status(500).json({ error: 'Failed to fetch Spotify account' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Spotify account not found' });
    }
    res.json(row);
  });
});

// Create new Spotify account
app.post('/api/spotify-accounts', (req, res) => {
  const { spotifyUserId, displayName, userId, accountType, accessToken, refreshToken, tokenExpirationInstant, scope } = req.body;
  
  if (!spotifyUserId || !userId || !accessToken || !refreshToken || !tokenExpirationInstant) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `
    INSERT INTO SpotifyAccount (spotifyUserId, displayName, userId, accountType, accessToken, refreshToken, tokenExpirationInstant, scope)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(query, [spotifyUserId, displayName, userId, accountType, accessToken, refreshToken, tokenExpirationInstant, scope], function(err) {
    if (err) {
      console.error('Error creating Spotify account:', err.message);
      return res.status(500).json({ error: 'Failed to create Spotify account' });
    }
    
    db.get('SELECT * FROM SpotifyAccount WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        console.error('Error fetching created account:', err.message);
        return res.status(500).json({ error: 'Account created but failed to fetch' });
      }
      res.status(201).json(row);
    });
  });
});

// Update Spotify account
app.put('/api/spotify-accounts/:id', (req, res) => {
  const { id } = req.params;
  const { displayName, accountType, accessToken, refreshToken, tokenExpirationInstant, scope } = req.body;
  
  const query = `
    UPDATE SpotifyAccount 
    SET displayName = COALESCE(?, displayName),
        accountType = COALESCE(?, accountType),
        accessToken = COALESCE(?, accessToken),
        refreshToken = COALESCE(?, refreshToken),
        tokenExpirationInstant = COALESCE(?, tokenExpirationInstant),
        scope = COALESCE(?, scope),
        updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  db.run(query, [displayName, accountType, accessToken, refreshToken, tokenExpirationInstant, scope, id], function(err) {
    if (err) {
      console.error('Error updating Spotify account:', err.message);
      return res.status(500).json({ error: 'Failed to update Spotify account' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Spotify account not found' });
    }
    
    db.get('SELECT * FROM SpotifyAccount WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('Error fetching updated account:', err.message);
        return res.status(500).json({ error: 'Account updated but failed to fetch' });
      }
      res.json(row);
    });
  });
});

// Delete Spotify account
app.delete('/api/spotify-accounts/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM SpotifyAccount WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Error deleting Spotify account:', err.message);
      return res.status(500).json({ error: 'Failed to delete Spotify account' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Spotify account not found' });
    }
    
    res.json({ message: 'Spotify account deleted successfully', id: parseInt(id) });
  });
});

// ==================== PLAYLIST ENDPOINTS ====================

// Get all playlists
app.get('/api/playlists', (req, res) => {
  const query = `
    SELECT p.*, sa.displayName as accountDisplayName, sa.spotifyUserId,
           COUNT(DISTINCT pt.id) as trackCount
    FROM Playlist p
    LEFT JOIN SpotifyAccount sa ON p.spotifyAccountId = sa.id
    LEFT JOIN PlaylistTrack pt ON p.id = pt.playlistId
    GROUP BY p.id
    ORDER BY p.id
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching playlists:', err.message);
      return res.status(500).json({ error: 'Failed to fetch playlists' });
    }
    res.json(rows);
  });
});

// Get playlist by ID
app.get('/api/playlists/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT p.*, sa.displayName as accountDisplayName, sa.spotifyUserId,
           COUNT(DISTINCT pt.id) as trackCount
    FROM Playlist p
    LEFT JOIN SpotifyAccount sa ON p.spotifyAccountId = sa.id
    LEFT JOIN PlaylistTrack pt ON p.id = pt.playlistId
    WHERE p.id = ?
    GROUP BY p.id
  `;
  
  db.get(query, [id], (err, row) => {
    if (err) {
      console.error('Error fetching playlist:', err.message);
      return res.status(500).json({ error: 'Failed to fetch playlist' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    res.json(row);
  });
});

// Get tracks in a playlist
app.get('/api/playlists/:id/tracks', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT pt.*, t.spotifyTrackId, t.name, t.artist, t.album, t.durationMs
    FROM PlaylistTrack pt
    JOIN Track t ON pt.trackId = t.id
    WHERE pt.playlistId = ?
    ORDER BY pt.position, pt.addedAtInstant
  `;
  
  db.all(query, [id], (err, rows) => {
    if (err) {
      console.error('Error fetching playlist tracks:', err.message);
      return res.status(500).json({ error: 'Failed to fetch playlist tracks' });
    }
    res.json(rows);
  });
});

// Create new playlist
app.post('/api/playlists', (req, res) => {
  const { spotifyPlaylistId, spotifyAccountId, name, description, isPublic } = req.body;
  
  if (!spotifyPlaylistId || !spotifyAccountId || !name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `
    INSERT INTO Playlist (spotifyPlaylistId, spotifyAccountId, name, description, isPublic)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  db.run(query, [spotifyPlaylistId, spotifyAccountId, name, description, isPublic ? 1 : 0], function(err) {
    if (err) {
      console.error('Error creating playlist:', err.message);
      return res.status(500).json({ error: 'Failed to create playlist' });
    }
    
    db.get('SELECT * FROM Playlist WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        console.error('Error fetching created playlist:', err.message);
        return res.status(500).json({ error: 'Playlist created but failed to fetch' });
      }
      res.status(201).json(row);
    });
  });
});

// Update playlist
app.put('/api/playlists/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, isPublic } = req.body;
  
  const query = `
    UPDATE Playlist 
    SET name = COALESCE(?, name),
        description = COALESCE(?, description),
        isPublic = COALESCE(?, isPublic),
        updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  db.run(query, [name, description, isPublic !== undefined ? (isPublic ? 1 : 0) : null, id], function(err) {
    if (err) {
      console.error('Error updating playlist:', err.message);
      return res.status(500).json({ error: 'Failed to update playlist' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    
    db.get('SELECT * FROM Playlist WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('Error fetching updated playlist:', err.message);
        return res.status(500).json({ error: 'Playlist updated but failed to fetch' });
      }
      res.json(row);
    });
  });
});

// Delete playlist
app.delete('/api/playlists/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM Playlist WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Error deleting playlist:', err.message);
      return res.status(500).json({ error: 'Failed to delete playlist' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    
    res.json({ message: 'Playlist deleted successfully', id: parseInt(id) });
  });
});

// Add track to playlist
app.post('/api/playlists/:id/tracks', (req, res) => {
  const { id } = req.params;
  const { trackId, position } = req.body;
  
  if (!trackId) {
    return res.status(400).json({ error: 'Missing trackId' });
  }

  const query = `
    INSERT INTO PlaylistTrack (playlistId, trackId, addedAtInstant, position)
    VALUES (?, ?, datetime('now'), ?)
  `;
  
  db.run(query, [id, trackId, position], function(err) {
    if (err) {
      console.error('Error adding track to playlist:', err.message);
      return res.status(500).json({ error: 'Failed to add track to playlist' });
    }
    
    res.status(201).json({ message: 'Track added to playlist', id: this.lastID });
  });
});

// Remove track from playlist
app.delete('/api/playlists/:playlistId/tracks/:trackId', (req, res) => {
  const { playlistId, trackId } = req.params;
  
  db.run('DELETE FROM PlaylistTrack WHERE playlistId = ? AND trackId = ?', [playlistId, trackId], function(err) {
    if (err) {
      console.error('Error removing track from playlist:', err.message);
      return res.status(500).json({ error: 'Failed to remove track from playlist' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Track not found in playlist' });
    }
    
    res.json({ message: 'Track removed from playlist' });
  });
});

// ==================== TRACK ENDPOINTS ====================

// Get all tracks
app.get('/api/tracks', (req, res) => {
  db.all('SELECT * FROM Track ORDER BY id', [], (err, rows) => {
    if (err) {
      console.error('Error fetching tracks:', err.message);
      return res.status(500).json({ error: 'Failed to fetch tracks' });
    }
    res.json(rows);
  });
});

// Get track by ID
app.get('/api/tracks/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM Track WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error fetching track:', err.message);
      return res.status(500).json({ error: 'Failed to fetch track' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Track not found' });
    }
    res.json(row);
  });
});

// Create new track
app.post('/api/tracks', (req, res) => {
  const { spotifyTrackId, name, artist, album, durationMs } = req.body;
  
  if (!spotifyTrackId || !name || !artist || !album || !durationMs) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `
    INSERT INTO Track (spotifyTrackId, name, artist, album, durationMs)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  db.run(query, [spotifyTrackId, name, artist, album, durationMs], function(err) {
    if (err) {
      console.error('Error creating track:', err.message);
      return res.status(500).json({ error: 'Failed to create track' });
    }
    
    db.get('SELECT * FROM Track WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        console.error('Error fetching created track:', err.message);
        return res.status(500).json({ error: 'Track created but failed to fetch' });
      }
      res.status(201).json(row);
    });
  });
});

// ==================== LISTENING ACTIVITY ENDPOINTS ====================

// Get all listening activity
app.get('/api/listening-activity', (req, res) => {
  const query = `
    SELECT la.*, t.name as trackName, t.artist, t.album, 
           sa.displayName as accountDisplayName
    FROM ListeningActivity la
    JOIN Track t ON la.trackId = t.id
    JOIN SpotifyAccount sa ON la.spotifyAccountId = sa.id
    ORDER BY la.listenedAtInstant DESC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching listening activity:', err.message);
      return res.status(500).json({ error: 'Failed to fetch listening activity' });
    }
    res.json(rows);
  });
});

// Get listening activity by account
app.get('/api/listening-activity/account/:accountId', (req, res) => {
  const { accountId } = req.params;
  const query = `
    SELECT la.*, t.name as trackName, t.artist, t.album
    FROM ListeningActivity la
    JOIN Track t ON la.trackId = t.id
    WHERE la.spotifyAccountId = ?
    ORDER BY la.listenedAtInstant DESC
  `;
  
  db.all(query, [accountId], (err, rows) => {
    if (err) {
      console.error('Error fetching listening activity:', err.message);
      return res.status(500).json({ error: 'Failed to fetch listening activity' });
    }
    res.json(rows);
  });
});

// Create listening activity record
app.post('/api/listening-activity', (req, res) => {
  const { spotifyAccountId, trackId, listenedAtInstant, durationPlayedMs } = req.body;
  
  if (!spotifyAccountId || !trackId || !listenedAtInstant || !durationPlayedMs) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `
    INSERT INTO ListeningActivity (spotifyAccountId, trackId, listenedAtInstant, durationPlayedMs)
    VALUES (?, ?, ?, ?)
  `;
  
  db.run(query, [spotifyAccountId, trackId, listenedAtInstant, durationPlayedMs], function(err) {
    if (err) {
      console.error('Error creating listening activity:', err.message);
      return res.status(500).json({ error: 'Failed to create listening activity' });
    }
    
    res.status(201).json({ message: 'Listening activity recorded', id: this.lastID });
  });
});

// Delete listening activity
app.delete('/api/listening-activity/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM ListeningActivity WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Error deleting listening activity:', err.message);
      return res.status(500).json({ error: 'Failed to delete listening activity' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Listening activity not found' });
    }
    
    res.json({ message: 'Listening activity deleted successfully', id: parseInt(id) });
  });
});

// ==================== DEVICE ENDPOINTS ====================

// Get all devices
app.get('/api/devices', (req, res) => {
  const query = `
    SELECT d.*, sa.displayName as accountDisplayName
    FROM Device d
    JOIN SpotifyAccount sa ON d.spotifyAccountId = sa.id
    ORDER BY d.isActive DESC, d.id
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching devices:', err.message);
      return res.status(500).json({ error: 'Failed to fetch devices' });
    }
    res.json(rows);
  });
});

// Get devices by account
app.get('/api/devices/account/:accountId', (req, res) => {
  const { accountId } = req.params;
  const query = `
    SELECT * FROM Device 
    WHERE spotifyAccountId = ?
    ORDER BY isActive DESC, id
  `;
  
  db.all(query, [accountId], (err, rows) => {
    if (err) {
      console.error('Error fetching devices:', err.message);
      return res.status(500).json({ error: 'Failed to fetch devices' });
    }
    res.json(rows);
  });
});

// Create new device
app.post('/api/devices', (req, res) => {
  const { spotifyDeviceId, spotifyAccountId, name, type, isActive, volumePercent } = req.body;
  
  if (!spotifyDeviceId || !spotifyAccountId || !name || !type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `
    INSERT INTO Device (spotifyDeviceId, spotifyAccountId, name, type, isActive, volumePercent)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  db.run(query, [spotifyDeviceId, spotifyAccountId, name, type, isActive ? 1 : 0, volumePercent], function(err) {
    if (err) {
      console.error('Error creating device:', err.message);
      return res.status(500).json({ error: 'Failed to create device' });
    }
    
    db.get('SELECT * FROM Device WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        console.error('Error fetching created device:', err.message);
        return res.status(500).json({ error: 'Device created but failed to fetch' });
      }
      res.status(201).json(row);
    });
  });
});

// Update device
app.put('/api/devices/:id', (req, res) => {
  const { id } = req.params;
  const { name, isActive, volumePercent } = req.body;
  
  const query = `
    UPDATE Device 
    SET name = COALESCE(?, name),
        isActive = COALESCE(?, isActive),
        volumePercent = COALESCE(?, volumePercent),
        updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  db.run(query, [name, isActive !== undefined ? (isActive ? 1 : 0) : null, volumePercent, id], function(err) {
    if (err) {
      console.error('Error updating device:', err.message);
      return res.status(500).json({ error: 'Failed to update device' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Device not found' });
    }
    
    db.get('SELECT * FROM Device WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('Error fetching updated device:', err.message);
        return res.status(500).json({ error: 'Device updated but failed to fetch' });
      }
      res.json(row);
    });
  });
});

// Delete device
app.delete('/api/devices/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM Device WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Error deleting device:', err.message);
      return res.status(500).json({ error: 'Failed to delete device' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Device not found' });
    }
    
    res.json({ message: 'Device deleted successfully', id: parseInt(id) });
  });
});

// ==================== SUBSCRIPTION ENDPOINTS ====================

// Get all subscriptions
app.get('/api/subscriptions', (req, res) => {
  const query = `
    SELECT s.*, sa.displayName as accountDisplayName, sa.spotifyUserId
    FROM Subscription s
    JOIN SpotifyAccount sa ON s.spotifyAccountId = sa.id
    ORDER BY s.id
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching subscriptions:', err.message);
      return res.status(500).json({ error: 'Failed to fetch subscriptions' });
    }
    res.json(rows);
  });
});

// Get subscription by ID
app.get('/api/subscriptions/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT s.*, sa.displayName as accountDisplayName, sa.spotifyUserId
    FROM Subscription s
    JOIN SpotifyAccount sa ON s.spotifyAccountId = sa.id
    WHERE s.id = ?
  `;
  
  db.get(query, [id], (err, row) => {
    if (err) {
      console.error('Error fetching subscription:', err.message);
      return res.status(500).json({ error: 'Failed to fetch subscription' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    res.json(row);
  });
});

// Update subscription
app.put('/api/subscriptions/:id', (req, res) => {
  const { id } = req.params;
  const { planName, productType, currency, nextBillingAmount, billingDate } = req.body;
  
  const query = `
    UPDATE Subscription 
    SET planName = COALESCE(?, planName),
        productType = COALESCE(?, productType),
        currency = COALESCE(?, currency),
        nextBillingAmount = COALESCE(?, nextBillingAmount),
        billingDate = COALESCE(?, billingDate),
        updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  db.run(query, [planName, productType, currency, nextBillingAmount, billingDate, id], function(err) {
    if (err) {
      console.error('Error updating subscription:', err.message);
      return res.status(500).json({ error: 'Failed to update subscription' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    
    db.get('SELECT * FROM Subscription WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('Error fetching updated subscription:', err.message);
        return res.status(500).json({ error: 'Subscription updated but failed to fetch' });
      }
      res.json(row);
    });
  });
});

// ==================== PLAYLIST RULE ENDPOINTS ====================

// Get all playlist rules
app.get('/api/playlist-rules', (req, res) => {
  const query = `
    SELECT pr.*, sa.displayName as accountDisplayName
    FROM PlaylistRule pr
    JOIN SpotifyAccount sa ON pr.spotifyAccountId = sa.id
    ORDER BY pr.id
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching playlist rules:', err.message);
      return res.status(500).json({ error: 'Failed to fetch playlist rules' });
    }
    res.json(rows);
  });
});

// Get playlist rule by ID
app.get('/api/playlist-rules/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT pr.*, sa.displayName as accountDisplayName
    FROM PlaylistRule pr
    JOIN SpotifyAccount sa ON pr.spotifyAccountId = sa.id
    WHERE pr.id = ?
  `;
  
  db.get(query, [id], (err, row) => {
    if (err) {
      console.error('Error fetching playlist rule:', err.message);
      return res.status(500).json({ error: 'Failed to fetch playlist rule' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Playlist rule not found' });
    }
    res.json(row);
  });
});

// Create playlist rule
app.post('/api/playlist-rules', (req, res) => {
  const { spotifyAccountId, name, ruleType, criteriaJson, isActive } = req.body;
  
  if (!spotifyAccountId || !name || !ruleType || !criteriaJson) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `
    INSERT INTO PlaylistRule (spotifyAccountId, name, ruleType, criteriaJson, isActive)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  db.run(query, [spotifyAccountId, name, ruleType, criteriaJson, isActive !== undefined ? (isActive ? 1 : 0) : 1], function(err) {
    if (err) {
      console.error('Error creating playlist rule:', err.message);
      return res.status(500).json({ error: 'Failed to create playlist rule' });
    }
    
    db.get('SELECT * FROM PlaylistRule WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        console.error('Error fetching created rule:', err.message);
        return res.status(500).json({ error: 'Rule created but failed to fetch' });
      }
      res.status(201).json(row);
    });
  });
});

// Update playlist rule
app.put('/api/playlist-rules/:id', (req, res) => {
  const { id } = req.params;
  const { name, ruleType, criteriaJson, isActive, lastExecutedAtInstant } = req.body;
  
  const query = `
    UPDATE PlaylistRule 
    SET name = COALESCE(?, name),
        ruleType = COALESCE(?, ruleType),
        criteriaJson = COALESCE(?, criteriaJson),
        isActive = COALESCE(?, isActive),
        lastExecutedAtInstant = COALESCE(?, lastExecutedAtInstant),
        updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  db.run(query, [name, ruleType, criteriaJson, isActive !== undefined ? (isActive ? 1 : 0) : null, lastExecutedAtInstant, id], function(err) {
    if (err) {
      console.error('Error updating playlist rule:', err.message);
      return res.status(500).json({ error: 'Failed to update playlist rule' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Playlist rule not found' });
    }
    
    db.get('SELECT * FROM PlaylistRule WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('Error fetching updated rule:', err.message);
        return res.status(500).json({ error: 'Rule updated but failed to fetch' });
      }
      res.json(row);
    });
  });
});

// Delete playlist rule
app.delete('/api/playlist-rules/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM PlaylistRule WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Error deleting playlist rule:', err.message);
      return res.status(500).json({ error: 'Failed to delete playlist rule' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Playlist rule not found' });
    }
    
    res.json({ message: 'Playlist rule deleted successfully', id: parseInt(id) });
  });
});

// ==================== DASHBOARD VIEW ENDPOINT ====================

// Get dashboard overview
app.get('/api/dashboard', (req, res) => {
  const { userId } = req.query;
  
  const query = `
    SELECT 
      sa.id as spotifyAccountId,
      sa.displayName as spotifyDisplayName,
      sa.accountType,
      COUNT(DISTINCT p.id) as playlistCount,
      (
        SELECT t.name
        FROM ListeningActivity la
        JOIN Track t ON la.trackId = t.id
        WHERE la.spotifyAccountId = sa.id
        ORDER BY la.listenedAtInstant DESC
        LIMIT 1
      ) as lastListenedTrack,
      (
        SELECT t.artist
        FROM ListeningActivity la
        JOIN Track t ON la.trackId = t.id
        WHERE la.spotifyAccountId = sa.id
        ORDER BY la.listenedAtInstant DESC
        LIMIT 1
      ) as lastListenedArtist,
      (
        SELECT la.listenedAtInstant
        FROM ListeningActivity la
        WHERE la.spotifyAccountId = sa.id
        ORDER BY la.listenedAtInstant DESC
        LIMIT 1
      ) as lastListenedAtInstant
    FROM SpotifyAccount sa
    LEFT JOIN Playlist p ON sa.id = p.spotifyAccountId
    ${userId ? 'WHERE sa.userId = ?' : ''}
    GROUP BY sa.id
    ORDER BY sa.id
  `;
  
  db.all(query, userId ? [userId] : [], (err, rows) => {
    if (err) {
      console.error('Error fetching dashboard data:', err.message);
      return res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
    res.json(rows);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('API endpoints available at http://localhost:' + PORT + '/api');
});
