#!/bin/bash

echo "========================================"
echo "Spotify Account Manager - Startup"
echo "========================================"
echo ""

# Check for Node.js
echo "[1/6] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed!"
    echo "Please download and install Node.js from https://nodejs.org/"
    echo ""
    exit 1
fi
node --version
echo "[OK] Node.js is installed"
echo ""

# Check for npm
echo "[2/6] Checking npm installation..."
if ! command -v npm &> /dev/null; then
    echo "[ERROR] npm is not installed!"
    echo "Please reinstall Node.js from https://nodejs.org/"
    echo ""
    exit 1
fi
npm --version
echo "[OK] npm is installed"
echo ""

# Install root dependencies
echo "[3/6] Installing root dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install root dependencies"
    echo ""
    exit 1
fi
echo "[OK] Root dependencies installed"
echo ""

# Install client dependencies
echo "[4/6] Installing client dependencies..."
cd client
npm install
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install client dependencies"
    cd ..
    exit 1
fi
cd ..
echo "[OK] Client dependencies installed"
echo ""

# Install server dependencies
echo "[5/6] Installing server dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install server dependencies"
    cd ..
    exit 1
fi
cd ..
echo "[OK] Server dependencies installed"
echo ""

# Start the application
echo "[6/6] Starting Spotify Account Manager..."
echo ""
echo "========================================"
echo "Application is starting..."
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop the application"
echo "========================================"
echo ""

npm run dev
