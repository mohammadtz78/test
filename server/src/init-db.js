/**
 * Database Initialization Script
 * Run this script to initialize the database with tables and sample data
 * Usage: node src/init-db.js
 */

const { initializeDatabase } = require('./config/database');

async function main() {
  console.log('=================================');
  console.log('  Database Initialization');
  console.log('=================================');
  console.log('');

  try {
    const db = await initializeDatabase();
    
    // Close the database connection
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
        process.exit(1);
      }
      console.log('');
      console.log('✅ Database initialized successfully!');
      console.log('=================================');
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.log('=================================');
    process.exit(1);
  }
}

main();
