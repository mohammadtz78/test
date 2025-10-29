#!/bin/bash
###########################################
# Database Migration Script for Unix/Linux/Mac
###########################################
# This script updates the SystemSetting table
# to change the AppName from "Hello World Page" to "Koni"
###########################################

echo ""
echo "========================================="
echo "   Database Migration Tool"
echo "========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org/"
    echo ""
    exit 1
fi

# Check if server directory exists
if [ ! -d "server" ]; then
    echo "[ERROR] Server directory not found!"
    echo "Please run this script from the project root directory."
    echo ""
    exit 1
fi

# Navigate to server directory
cd server

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "[INFO] Installing server dependencies..."
    echo ""
    npm install
    if [ $? -ne 0 ]; then
        echo "[ERROR] Failed to install dependencies"
        echo ""
        cd ..
        exit 1
    fi
    echo ""
fi

# Check if migrations tracking directory exists
if [ ! -d "migrations" ]; then
    mkdir migrations
fi

# Check if this migration has already been run
if [ -f "migrations/.migration_001_appname_to_koni" ]; then
    echo "[INFO] Migration 001 (AppName to Koni) has already been applied."
    echo "No action needed."
    echo ""
    cd ..
    exit 0
fi

echo "[INFO] Running migration: Update AppName to 'Koni'"
echo ""

# Create the migration script
cat > temp_migrate.js << 'EOF'
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('[ERROR] Failed to connect to database:', err.message);
    process.exit(1);
  }
});

console.log('[INFO] Connected to database');
console.log('[INFO] Updating AppName from "Hello World Page" to "Koni"...');

db.run(
  'UPDATE SystemSetting SET settingValue = ? WHERE settingName = ?',
  ['Koni', 'AppName'],
  function(err) {
    if (err) {
      console.error('[ERROR] Migration failed:', err.message);
      db.close();
      process.exit(1);
    }

    if (this.changes === 0) {
      console.log('[WARNING] No rows were updated. The AppName setting may not exist.');
    } else {
      console.log('[SUCCESS] AppName updated successfully! Changed', this.changes, 'row(s)');
    }

    db.close((err) => {
      if (err) {
        console.error('[ERROR] Failed to close database:', err.message);
        process.exit(1);
      }
      console.log('[INFO] Database connection closed');
    });
  }
);
EOF

# Run the migration
node temp_migrate.js
MIGRATION_RESULT=$?

# Clean up temporary file
rm temp_migrate.js

if [ $MIGRATION_RESULT -eq 0 ]; then
    # Mark migration as completed
    touch migrations/.migration_001_appname_to_koni
    echo ""
    echo "========================================="
    echo "   Migration completed successfully!"
    echo "========================================="
    echo ""
    cd ..
    exit 0
else
    echo ""
    echo "========================================="
    echo "   Migration failed!"
    echo "========================================="
    echo ""
    cd ..
    exit 1
fi
