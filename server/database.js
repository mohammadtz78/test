const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database with tables and sample data
function initializeDatabase() {
  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON', (err) => {
    if (err) {
      console.error('Error enabling foreign keys:', err.message);
    } else {
      console.log('Foreign keys enabled');
    }
  });

  db.serialize(() => {
    // Create User table
    db.run(`
      CREATE TABLE IF NOT EXISTS User (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        displayName TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('Error creating User table:', err.message);
      else console.log('User table ready');
    });

    // Create SpotifyAccount table
    db.run(`
      CREATE TABLE IF NOT EXISTS SpotifyAccount (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        spotifyUserId TEXT UNIQUE NOT NULL,
        displayName TEXT,
        userId INTEGER NOT NULL,
        accountType TEXT,
        accessToken TEXT NOT NULL,
        refreshToken TEXT NOT NULL,
        tokenExpirationInstant TEXT NOT NULL,
        scope TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
      )
    `, (err) => {
      if (err) console.error('Error creating SpotifyAccount table:', err.message);
      else console.log('SpotifyAccount table ready');
    });

    // Create Track table
    db.run(`
      CREATE TABLE IF NOT EXISTS Track (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        spotifyTrackId TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        artist TEXT NOT NULL,
        album TEXT NOT NULL,
        durationMs INTEGER NOT NULL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('Error creating Track table:', err.message);
      else console.log('Track table ready');
    });

    // Create Playlist table
    db.run(`
      CREATE TABLE IF NOT EXISTS Playlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        spotifyPlaylistId TEXT NOT NULL,
        spotifyAccountId INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        isPublic INTEGER NOT NULL DEFAULT 0,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (spotifyAccountId) REFERENCES SpotifyAccount(id) ON DELETE CASCADE
      )
    `, (err) => {
      if (err) console.error('Error creating Playlist table:', err.message);
      else console.log('Playlist table ready');
    });

    // Create PlaylistTrack table
    db.run(`
      CREATE TABLE IF NOT EXISTS PlaylistTrack (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        playlistId INTEGER NOT NULL,
        trackId INTEGER NOT NULL,
        addedAtInstant TEXT NOT NULL,
        position INTEGER,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (playlistId) REFERENCES Playlist(id) ON DELETE CASCADE,
        FOREIGN KEY (trackId) REFERENCES Track(id) ON DELETE CASCADE
      )
    `, (err) => {
      if (err) console.error('Error creating PlaylistTrack table:', err.message);
      else console.log('PlaylistTrack table ready');
    });

    // Create ListeningActivity table
    db.run(`
      CREATE TABLE IF NOT EXISTS ListeningActivity (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        spotifyAccountId INTEGER NOT NULL,
        trackId INTEGER NOT NULL,
        listenedAtInstant TEXT NOT NULL,
        durationPlayedMs INTEGER NOT NULL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (spotifyAccountId) REFERENCES SpotifyAccount(id) ON DELETE CASCADE,
        FOREIGN KEY (trackId) REFERENCES Track(id) ON DELETE CASCADE
      )
    `, (err) => {
      if (err) console.error('Error creating ListeningActivity table:', err.message);
      else console.log('ListeningActivity table ready');
    });

    // Create Device table
    db.run(`
      CREATE TABLE IF NOT EXISTS Device (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        spotifyDeviceId TEXT NOT NULL,
        spotifyAccountId INTEGER NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        isActive INTEGER NOT NULL DEFAULT 0,
        volumePercent INTEGER,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (spotifyAccountId) REFERENCES SpotifyAccount(id) ON DELETE CASCADE
      )
    `, (err) => {
      if (err) console.error('Error creating Device table:', err.message);
      else console.log('Device table ready');
    });

    // Create Subscription table
    db.run(`
      CREATE TABLE IF NOT EXISTS Subscription (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        spotifyAccountId INTEGER UNIQUE NOT NULL,
        planName TEXT NOT NULL,
        productType TEXT NOT NULL,
        currency TEXT,
        nextBillingAmount REAL,
        billingDate TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (spotifyAccountId) REFERENCES SpotifyAccount(id) ON DELETE CASCADE
      )
    `, (err) => {
      if (err) console.error('Error creating Subscription table:', err.message);
      else console.log('Subscription table ready');
    });

    // Create PlaylistRule table
    db.run(`
      CREATE TABLE IF NOT EXISTS PlaylistRule (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        spotifyAccountId INTEGER NOT NULL,
        name TEXT NOT NULL,
        ruleType TEXT NOT NULL,
        criteriaJson TEXT NOT NULL,
        isActive INTEGER NOT NULL DEFAULT 1,
        lastExecutedAtInstant TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (spotifyAccountId) REFERENCES SpotifyAccount(id) ON DELETE CASCADE
      )
    `, (err) => {
      if (err) console.error('Error creating PlaylistRule table:', err.message);
      else console.log('PlaylistRule table ready');
    });

    // Insert sample data
    insertSampleData();
  });
}

function insertSampleData() {
  db.serialize(() => {
    // Insert sample users
    db.run(`INSERT OR IGNORE INTO User (id, displayName) VALUES (1, 'John Doe')`, (err) => {
      if (err) console.error('Error inserting user:', err.message);
      else console.log('Sample user inserted');
    });

    db.run(`INSERT OR IGNORE INTO User (id, displayName) VALUES (2, 'Jane Smith')`, (err) => {
      if (err) console.error('Error inserting user:', err.message);
    });

    // Insert sample Spotify accounts
    db.run(`
      INSERT OR IGNORE INTO SpotifyAccount 
      (id, spotifyUserId, displayName, userId, accountType, accessToken, refreshToken, tokenExpirationInstant, scope) 
      VALUES 
      (1, 'spotify_user_001', 'John Personal', 1, 'Premium', 'access_token_001', 'refresh_token_001', '2024-12-31T23:59:59Z', 'user-read-playback-state user-modify-playback-state')
    `, (err) => {
      if (err) console.error('Error inserting Spotify account 1:', err.message);
      else console.log('Sample Spotify account 1 inserted');
    });

    db.run(`
      INSERT OR IGNORE INTO SpotifyAccount 
      (id, spotifyUserId, displayName, userId, accountType, accessToken, refreshToken, tokenExpirationInstant, scope) 
      VALUES 
      (2, 'spotify_user_002', 'John Work', 1, 'Premium', 'access_token_002', 'refresh_token_002', '2024-12-31T23:59:59Z', 'user-read-playback-state user-modify-playback-state')
    `, (err) => {
      if (err) console.error('Error inserting Spotify account 2:', err.message);
      else console.log('Sample Spotify account 2 inserted');
    });

    db.run(`
      INSERT OR IGNORE INTO SpotifyAccount 
      (id, spotifyUserId, displayName, userId, accountType, accessToken, refreshToken, tokenExpirationInstant, scope) 
      VALUES 
      (3, 'spotify_user_003', 'Jane Personal', 2, 'Free', 'access_token_003', 'refresh_token_003', '2024-12-31T23:59:59Z', 'user-read-playback-state')
    `, (err) => {
      if (err) console.error('Error inserting Spotify account 3:', err.message);
      else console.log('Sample Spotify account 3 inserted');
    });

    // Insert sample tracks
    db.run(`
      INSERT OR IGNORE INTO Track (id, spotifyTrackId, name, artist, album, durationMs) 
      VALUES (1, 'track_001', 'Bohemian Rhapsody', 'Queen', 'A Night at the Opera', 354000)
    `, (err) => {
      if (err) console.error('Error inserting track 1:', err.message);
      else console.log('Sample track 1 inserted');
    });

    db.run(`
      INSERT OR IGNORE INTO Track (id, spotifyTrackId, name, artist, album, durationMs) 
      VALUES (2, 'track_002', 'Imagine', 'John Lennon', 'Imagine', 183000)
    `, (err) => {
      if (err) console.error('Error inserting track 2:', err.message);
      else console.log('Sample track 2 inserted');
    });

    db.run(`
      INSERT OR IGNORE INTO Track (id, spotifyTrackId, name, artist, album, durationMs) 
      VALUES (3, 'track_003', 'Billie Jean', 'Michael Jackson', 'Thriller', 294000)
    `, (err) => {
      if (err) console.error('Error inserting track 3:', err.message);
      else console.log('Sample track 3 inserted');
    });

    db.run(`
      INSERT OR IGNORE INTO Track (id, spotifyTrackId, name, artist, album, durationMs) 
      VALUES (4, 'track_004', 'Hotel California', 'Eagles', 'Hotel California', 391000)
    `, (err) => {
      if (err) console.error('Error inserting track 4:', err.message);
      else console.log('Sample track 4 inserted');
    });

    db.run(`
      INSERT OR IGNORE INTO Track (id, spotifyTrackId, name, artist, album, durationMs) 
      VALUES (5, 'track_005', 'Stairway to Heaven', 'Led Zeppelin', 'Led Zeppelin IV', 482000)
    `, (err) => {
      if (err) console.error('Error inserting track 5:', err.message);
      else console.log('Sample track 5 inserted');
    });

    // Insert sample playlists
    db.run(`
      INSERT OR IGNORE INTO Playlist (id, spotifyPlaylistId, spotifyAccountId, name, description, isPublic) 
      VALUES (1, 'playlist_001', 1, 'My Favorites', 'Personal favorite tracks', 1)
    `, (err) => {
      if (err) console.error('Error inserting playlist 1:', err.message);
      else console.log('Sample playlist 1 inserted');
    });

    db.run(`
      INSERT OR IGNORE INTO Playlist (id, spotifyPlaylistId, spotifyAccountId, name, description, isPublic) 
      VALUES (2, 'playlist_002', 1, 'Workout Mix', 'High energy workout music', 0)
    `, (err) => {
      if (err) console.error('Error inserting playlist 2:', err.message);
      else console.log('Sample playlist 2 inserted');
    });

    db.run(`
      INSERT OR IGNORE INTO Playlist (id, spotifyPlaylistId, spotifyAccountId, name, description, isPublic) 
      VALUES (3, 'playlist_003', 2, 'Focus Music', 'Concentration and productivity', 1)
    `, (err) => {
      if (err) console.error('Error inserting playlist 3:', err.message);
      else console.log('Sample playlist 3 inserted');
    });

    db.run(`
      INSERT OR IGNORE INTO Playlist (id, spotifyPlaylistId, spotifyAccountId, name, description, isPublic) 
      VALUES (4, 'playlist_004', 3, 'Chill Vibes', 'Relaxing evening playlist', 1)
    `, (err) => {
      if (err) console.error('Error inserting playlist 4:', err.message);
      else console.log('Sample playlist 4 inserted');
    });

    // Insert playlist tracks
    db.run(`
      INSERT OR IGNORE INTO PlaylistTrack (playlistId, trackId, addedAtInstant, position) 
      VALUES (1, 1, '2024-01-15T10:30:00Z', 1)
    `, (err) => {
      if (err) console.error('Error inserting playlist track:', err.message);
      else console.log('Sample playlist track inserted');
    });

    db.run(`
      INSERT OR IGNORE INTO PlaylistTrack (playlistId, trackId, addedAtInstant, position) 
      VALUES (1, 2, '2024-01-15T10:31:00Z', 2)
    `);

    db.run(`
      INSERT OR IGNORE INTO PlaylistTrack (playlistId, trackId, addedAtInstant, position) 
      VALUES (1, 3, '2024-01-15T10:32:00Z', 3)
    `);

    db.run(`
      INSERT OR IGNORE INTO PlaylistTrack (playlistId, trackId, addedAtInstant, position) 
      VALUES (2, 3, '2024-01-16T09:00:00Z', 1)
    `);

    db.run(`
      INSERT OR IGNORE INTO PlaylistTrack (playlistId, trackId, addedAtInstant, position) 
      VALUES (2, 4, '2024-01-16T09:01:00Z', 2)
    `);

    db.run(`
      INSERT OR IGNORE INTO PlaylistTrack (playlistId, trackId, addedAtInstant, position) 
      VALUES (3, 5, '2024-01-17T14:00:00Z', 1)
    `);

    // Insert listening activity
    db.run(`
      INSERT OR IGNORE INTO ListeningActivity (spotifyAccountId, trackId, listenedAtInstant, durationPlayedMs) 
      VALUES (1, 1, '2024-01-20T15:30:00Z', 354000)
    `, (err) => {
      if (err) console.error('Error inserting listening activity:', err.message);
      else console.log('Sample listening activity inserted');
    });

    db.run(`
      INSERT OR IGNORE INTO ListeningActivity (spotifyAccountId, trackId, listenedAtInstant, durationPlayedMs) 
      VALUES (1, 2, '2024-01-20T16:00:00Z', 183000)
    `);

    db.run(`
      INSERT OR IGNORE INTO ListeningActivity (spotifyAccountId, trackId, listenedAtInstant, durationPlayedMs) 
      VALUES (1, 3, '2024-01-20T16:15:00Z', 294000)
    `);

    db.run(`
      INSERT OR IGNORE INTO ListeningActivity (spotifyAccountId, trackId, listenedAtInstant, durationPlayedMs) 
      VALUES (2, 5, '2024-01-20T10:00:00Z', 482000)
    `);

    // Insert devices
    db.run(`
      INSERT OR IGNORE INTO Device (id, spotifyDeviceId, spotifyAccountId, name, type, isActive, volumePercent) 
      VALUES (1, 'device_001', 1, 'Johns iPhone', 'Smartphone', 1, 75)
    `, (err) => {
      if (err) console.error('Error inserting device 1:', err.message);
      else console.log('Sample device 1 inserted');
    });

    db.run(`
      INSERT OR IGNORE INTO Device (id, spotifyDeviceId, spotifyAccountId, name, type, isActive, volumePercent) 
      VALUES (2, 'device_002', 1, 'Living Room Speaker', 'Speaker', 0, 50)
    `, (err) => {
      if (err) console.error('Error inserting device 2:', err.message);
      else console.log('Sample device 2 inserted');
    });

    db.run(`
      INSERT OR IGNORE INTO Device (id, spotifyDeviceId, spotifyAccountId, name, type, isActive, volumePercent) 
      VALUES (3, 'device_003', 2, 'MacBook Pro', 'Computer', 1, 60)
    `, (err) => {
      if (err) console.error('Error inserting device 3:', err.message);
      else console.log('Sample device 3 inserted');
    });

    // Insert subscriptions
    db.run(`
      INSERT OR IGNORE INTO Subscription (spotifyAccountId, planName, productType, currency, nextBillingAmount, billingDate) 
      VALUES (1, 'Premium Individual', 'Premium', 'USD', 9.99, '2024-02-01')
    `, (err) => {
      if (err) console.error('Error inserting subscription 1:', err.message);
      else console.log('Sample subscription 1 inserted');
    });

    db.run(`
      INSERT OR IGNORE INTO Subscription (spotifyAccountId, planName, productType, currency, nextBillingAmount, billingDate) 
      VALUES (2, 'Premium Individual', 'Premium', 'USD', 9.99, '2024-02-05')
    `, (err) => {
      if (err) console.error('Error inserting subscription 2:', err.message);
      else console.log('Sample subscription 2 inserted');
    });

    db.run(`
      INSERT OR IGNORE INTO Subscription (spotifyAccountId, planName, productType, currency) 
      VALUES (3, 'Free', 'Free', 'USD')
    `, (err) => {
      if (err) console.error('Error inserting subscription 3:', err.message);
      else console.log('Sample subscription 3 inserted');
    });

    // Insert playlist rules
    db.run(`
      INSERT OR IGNORE INTO PlaylistRule (id, spotifyAccountId, name, ruleType, criteriaJson, isActive) 
      VALUES (1, 1, 'Auto-add Recent Favorites', 'auto-add', '{"condition":"recently_liked","days":7}', 1)
    `, (err) => {
      if (err) console.error('Error inserting playlist rule 1:', err.message);
      else console.log('Sample playlist rule 1 inserted');
    });

    db.run(`
      INSERT OR IGNORE INTO PlaylistRule (id, spotifyAccountId, name, ruleType, criteriaJson, isActive) 
      VALUES (2, 1, 'Sync Work and Personal', 'sync', '{"sourcePlaylist":"playlist_001","targetPlaylist":"playlist_003"}', 1)
    `, (err) => {
      if (err) console.error('Error inserting playlist rule 2:', err.message);
      else console.log('Sample playlist rule 2 inserted');
    });

    console.log('Database initialization complete!');
  });
}

// Export database connection
module.exports = db;
