@echo off
REM =========================================
REM Database Migration Script for Windows
REM =========================================
REM This script updates the SystemSetting table
REM to change the AppName from "Hello World Page" to "Koni"
REM =========================================

echo.
echo =========================================
echo   Database Migration Tool
echo =========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Check if server directory exists
if not exist "server" (
    echo [ERROR] Server directory not found!
    echo Please run this script from the project root directory.
    echo.
    pause
    exit /b 1
)

REM Navigate to server directory
cd server

REM Check if node_modules exists, if not install dependencies
if not exist "node_modules" (
    echo [INFO] Installing server dependencies...
    echo.
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install dependencies
        echo.
        cd ..
        pause
        exit /b 1
    )
    echo.
)

REM Check if migrations tracking directory exists
if not exist "migrations" (
    mkdir migrations
)

REM Check if this migration has already been run
if exist "migrations\.migration_001_appname_to_koni" (
    echo [INFO] Migration 001 (AppName to Koni) has already been applied.
    echo No action needed.
    echo.
    cd ..
    pause
    exit /b 0
)

echo [INFO] Running migration: Update AppName to 'Koni'
echo.

REM Create the migration script
echo const sqlite3 = require('sqlite3').verbose(); > temp_migrate.js
echo const path = require('path'); >> temp_migrate.js
echo. >> temp_migrate.js
echo const DB_PATH = path.resolve(__dirname, 'database.sqlite'); >> temp_migrate.js
echo. >> temp_migrate.js
echo const db = new sqlite3.Database(DB_PATH, (err) =^> { >> temp_migrate.js
echo   if (err) { >> temp_migrate.js
echo     console.error('[ERROR] Failed to connect to database:', err.message); >> temp_migrate.js
echo     process.exit(1); >> temp_migrate.js
echo   } >> temp_migrate.js
echo }); >> temp_migrate.js
echo. >> temp_migrate.js
echo console.log('[INFO] Connected to database'); >> temp_migrate.js
echo console.log('[INFO] Updating AppName from "Hello World Page" to "Koni"...'); >> temp_migrate.js
echo. >> temp_migrate.js
echo db.run( >> temp_migrate.js
echo   'UPDATE SystemSetting SET settingValue = ? WHERE settingName = ?', >> temp_migrate.js
echo   ['Koni', 'AppName'], >> temp_migrate.js
echo   function(err) { >> temp_migrate.js
echo     if (err) { >> temp_migrate.js
echo       console.error('[ERROR] Migration failed:', err.message); >> temp_migrate.js
echo       db.close(); >> temp_migrate.js
echo       process.exit(1); >> temp_migrate.js
echo     } >> temp_migrate.js
echo. >> temp_migrate.js
echo     if (this.changes === 0) { >> temp_migrate.js
echo       console.log('[WARNING] No rows were updated. The AppName setting may not exist.'); >> temp_migrate.js
echo     } else { >> temp_migrate.js
echo       console.log('[SUCCESS] AppName updated successfully! Changed', this.changes, 'row(s)'); >> temp_migrate.js
echo     } >> temp_migrate.js
echo. >> temp_migrate.js
echo     db.close((err) =^> { >> temp_migrate.js
echo       if (err) { >> temp_migrate.js
echo         console.error('[ERROR] Failed to close database:', err.message); >> temp_migrate.js
echo         process.exit(1); >> temp_migrate.js
echo       } >> temp_migrate.js
echo       console.log('[INFO] Database connection closed'); >> temp_migrate.js
echo     }); >> temp_migrate.js
echo   } >> temp_migrate.js
echo ); >> temp_migrate.js

REM Run the migration
node temp_migrate.js
set MIGRATION_RESULT=%ERRORLEVEL%

REM Clean up temporary file
del temp_migrate.js

if %MIGRATION_RESULT% EQU 0 (
    REM Mark migration as completed
    echo. > migrations\.migration_001_appname_to_koni
    echo.
    echo =========================================
    echo   Migration completed successfully!
    echo =========================================
    echo.
    cd ..
    pause
    exit /b 0
) else (
    echo.
    echo =========================================
    echo   Migration failed!
    echo =========================================
    echo.
    cd ..
    pause
    exit /b 1
)
