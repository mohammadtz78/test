const sqlite3 = require('sqlite3').verbose();
const path = require('path');

/**
 * Database Configuration
 * SQLite database configuration for the Hello World Page application
 */

// Database file path - stored in the server root directory
const DB_PATH = path.resolve(__dirname, '../../database.sqlite');

/**
 * Get database connection
 * @returns {sqlite3.Database} SQLite database instance
 */
function getDatabase() {
  return new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('Error connecting to database:', err.message);
      throw err;
    }
    console.log('Connected to SQLite database');
  });
}

/**
 * Create SystemSetting table if it doesn't exist
 * @param {sqlite3.Database} db - Database instance
 * @returns {Promise<void>}
 */
function createTables(db) {
  return new Promise((resolve, reject) => {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS SystemSetting (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        settingName TEXT UNIQUE NOT NULL,
        settingValue TEXT NOT NULL,
        description TEXT
      )
    `;

    db.run(createTableSQL, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
        reject(err);
      } else {
        console.log('SystemSetting table ready');
        resolve();
      }
    });
  });
}

/**
 * Insert initial data if table is empty
 * @param {sqlite3.Database} db - Database instance
 * @returns {Promise<void>}
 */
function insertInitialData(db) {
  return new Promise((resolve, reject) => {
    // Check if data already exists
    db.get('SELECT COUNT(*) as count FROM SystemSetting', [], (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (row.count > 0) {
        console.log('Database already has data, skipping initial data insertion');
        resolve();
        return;
      }

      // Insert initial data
      const insertSQL = `
        INSERT INTO SystemSetting (settingName, settingValue, description)
        VALUES (?, ?, ?)
      `;

      const initialData = [
        ['HelloWorld', 'Hello World! Welcome to the System Settings Management Application.', 'The main Hello World message displayed on the home page'],
        ['AppName', 'Hello World Page', 'The application name'],
        ['Version', '1.0.0', 'Current application version'],
        ['Theme', 'Modern', 'UI theme name']
      ];

      let completed = 0;
      let hasError = false;

      initialData.forEach((data) => {
        db.run(insertSQL, data, (err) => {
          if (err && !hasError) {
            hasError = true;
            console.error('Error inserting initial data:', err.message);
            reject(err);
          }
          completed++;
          if (completed === initialData.length && !hasError) {
            console.log('Initial data inserted successfully');
            resolve();
          }
        });
      });
    });
  });
}

/**
 * Initialize database with tables and initial data
 * @returns {Promise<sqlite3.Database>}
 */
async function initializeDatabase() {
  const db = getDatabase();
  
  try {
    await createTables(db);
    await insertInitialData(db);
    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

module.exports = {
  getDatabase,
  initializeDatabase,
  DB_PATH
};
