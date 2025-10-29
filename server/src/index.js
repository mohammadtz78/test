const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./config/database');
const systemSettingsRoutes = require('./routes/systemSettings');

/**
 * Hello World Page - Backend Server
 * Express server with SQLite database
 */

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Hello World Page API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/SystemSetting', systemSettingsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Hello World Page API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      systemSettings: '/api/SystemSetting',
      helloWorld: '/api/SystemSetting/HelloWorld'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.url} not found`,
    availableEndpoints: {
      health: '/health',
      systemSettings: '/api/SystemSetting',
      helloWorld: '/api/SystemSetting/HelloWorld'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Initialize database and start server
async function startServer() {
  try {
    console.log('=================================');
    console.log('  Hello World Page - Server');
    console.log('=================================');
    console.log('');
    
    // Initialize database
    console.log('Initializing database...');
    const db = await initializeDatabase();
    
    // Store database instance in app for use in routes
    app.set('db', db);
    
    // Start server
    app.listen(PORT, () => {
      console.log('');
      console.log('✅ Server started successfully!');
      console.log('=================================');
      console.log(`Server running on: http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`API endpoint: http://localhost:${PORT}/api/SystemSetting`);
      console.log('=================================');
      console.log('');
      console.log('Press Ctrl+C to stop the server');
    });
  } catch (error) {
    console.error('');
    console.error('❌ Failed to start server:', error.message);
    console.error('=================================');
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nShutting down server...');
  const db = app.get('db');
  if (db) {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed');
      }
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

// Start the server
startServer();
