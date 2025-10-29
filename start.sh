#!/bin/bash

echo "===================================="
echo "  Hello World Page - Startup Script"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    echo ""
    exit 1
fi

echo "[1/4] Checking Node.js version..."
node --version
echo ""

echo "[2/4] Installing dependencies..."
echo "This may take a few minutes on first run..."
echo ""

# Install root dependencies
echo "Installing root dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install root dependencies"
    exit 1
fi

# Install client dependencies
echo ""
echo "Installing client dependencies..."
cd client
npm install
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install client dependencies"
    cd ..
    exit 1
fi
cd ..

# Install server dependencies
echo ""
echo "Installing server dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install server dependencies"
    cd ..
    exit 1
fi
cd ..

echo ""
echo "[3/4] Initializing database..."
cd server
node src/init-db.js
if [ $? -ne 0 ]; then
    echo "[WARNING] Database initialization had issues, but continuing..."
fi
cd ..

echo ""
echo "[4/4] Starting application..."
echo ""
echo "===================================="
echo "  Application Starting!"
echo "===================================="
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop the servers"
echo "===================================="
echo ""

# Start both servers
npm run dev
