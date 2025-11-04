@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Spotify Account Manager - Startup
echo ========================================
echo.

REM Check for Node.js
echo [1/6] Checking Node.js installation...
call node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)
call node --version
echo [OK] Node.js is installed
echo.

REM Check for npm
echo [2/6] Checking npm installation...
call npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed!
    echo Please reinstall Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)
call npm --version
echo [OK] npm is installed
echo.

REM Install root dependencies
echo [3/6] Installing root dependencies...
call npm install || (
    echo [ERROR] Failed to install root dependencies
    echo.
    pause
    exit /b 1
)
echo [OK] Root dependencies installed
echo.

REM Install client dependencies
echo [4/6] Installing client dependencies...
cd client
call npm install || (
    echo [ERROR] Failed to install client dependencies
    cd ..
    pause
    exit /b 1
)
cd ..
echo [OK] Client dependencies installed
echo.

REM Install server dependencies
echo [5/6] Installing server dependencies...
cd server
call npm install || (
    echo [ERROR] Failed to install server dependencies
    cd ..
    pause
    exit /b 1
)
cd ..
echo [OK] Server dependencies installed
echo.

REM Start the application
echo [6/6] Starting Spotify Account Manager...
echo.
echo ========================================
echo Application is starting...
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Press Ctrl+C to stop the application
echo ========================================
echo.

call npm run dev
