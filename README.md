# Hello World Page

A full-stack application built with React, Node.js, and SQLite that displays a "Hello World" message from a system settings database.

## Features

- 🎨 Modern UI with custom design theme
- 🔄 Real-time data fetching from SQLite database
- 📱 Responsive design
- 🚀 Easy one-command startup
- 💾 System settings management

## Tech Stack

**Frontend:**
- React 18
- Axios for API calls
- Modern CSS with custom design system

**Backend:**
- Node.js with Express
- SQLite database
- OData-style endpoints
- CORS enabled

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation & Running

#### Windows Users

Simply double-click the `start.bat` file or run from command prompt:

```bash
start.bat
```

#### Mac/Linux Users

Make the script executable and run it:

```bash
chmod +x start.sh
./start.sh
```

#### Manual Start (Alternative)

If you prefer to run commands manually:

```bash
# Install all dependencies
npm run install:all

# Run the application
npm run dev
```

### What the startup script does:

1. ✅ Installs all dependencies for root, client, and server
2. ✅ Initializes the SQLite database with sample data
3. ✅ Starts both the frontend and backend servers concurrently
4. ✅ Opens your browser automatically to http://localhost:3000

The backend server runs on `http://localhost:5000`

## Database Migration

### When Migrations Are Needed

Database migrations are needed when:
- Schema changes are made (tables, columns, indexes)
- Data needs to be updated or transformed
- Initial data needs to be modified

### How to Run Migrations

**Important:** Always backup your database before running migrations!

#### Windows Users

Double-click `migrate.bat` or run from command prompt:

```bash
migrate.bat
```

#### Mac/Linux Users

Make the script executable (first time only) and run:

```bash
chmod +x migrate.sh
./migrate.sh
```

### What the Migration Script Does

1. ✅ Checks if Node.js and dependencies are installed
2. ✅ Verifies if migrations have already been applied (idempotent)
3. ✅ Connects to the SQLite database
4. ✅ Applies schema or data changes
5. ✅ Tracks completed migrations to prevent duplicate execution
6. ✅ Provides clear success or error messages

### Current Migrations

- **Migration 001:** Updates the AppName setting from "Hello World Page" to "Koni"

### If Migration Fails

If a migration fails:

1. **Check the error message** - It will tell you what went wrong
2. **Verify database access** - Ensure no other process is using the database
3. **Check dependencies** - Run `npm install` in the server directory
4. **Restore from backup** - If you have a backup, restore it and try again
5. **Manual fix** - You can manually update the database using an SQLite browser tool

### Migration Tracking

Migrations are tracked in the `server/migrations/` directory. Each completed migration creates a marker file (e.g., `.migration_001_appname_to_koni`) to prevent re-running the same migration.

## Project Structure

```
hello-world-page/
├── client/                 # React frontend application
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── styles/        # CSS stylesheets
│   │   ├── App.js         # Main application component
│   │   └── index.js       # Application entry point
│   └── package.json       # Frontend dependencies
│
├── server/                # Node.js backend application
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── routes/        # API routes
│   │   ├── init-db.js     # Database initialization
│   │   └── index.js       # Server entry point
│   ├── migrations/        # Migration tracking directory
│   └── package.json       # Backend dependencies
│
├── .gitignore            # Git ignore rules
├── package.json          # Root package.json with scripts
├── start.bat             # Windows startup script
├── start.sh              # Unix/Mac startup script
├── migrate.bat           # Windows migration script
├── migrate.sh            # Unix/Mac migration script
└── README.md             # This file
```

## API Endpoints

### Get Hello World Message

```
GET http://localhost:5000/api/SystemSetting/HelloWorld
```

Returns the Hello World message from the system settings.

### Get All Settings

```
GET http://localhost:5000/api/SystemSetting
```

Returns all system settings from the database.

## Design System

The application uses a custom design system with:

- **Primary Color:** #5E6AD2
- **Typography:** SF Mono for body, SF Pro Display for headings
- **Component Templates:** Modern buttons, forms, cards, and tables
- **Responsive Layout:** Mobile-first approach with topbar navigation

## Development

### Running in Development Mode

```bash
npm run dev
```

This will start both the client (port 3000) and server (port 5000) with hot-reloading enabled.

### Building for Production

```bash
# Build the React frontend
npm run build

# Start the production server
npm start
```

## Database

The application uses SQLite with the following schema:

**SystemSetting Table:**
- `id` (INTEGER PRIMARY KEY)
- `settingName` (TEXT UNIQUE, REQUIRED)
- `settingValue` (TEXT, REQUIRED)
- `description` (TEXT, OPTIONAL)

Sample data is automatically inserted on first run.

## Troubleshooting

### Port Already in Use

If you get an error that port 3000 or 5000 is already in use:

1. Close any applications using those ports
2. Or modify the ports in:
   - Client: `client/package.json` (change PORT environment variable)
   - Server: `server/src/index.js` (change PORT constant)

### Dependencies Not Installing

Try manually installing dependencies:

```bash
npm install
cd client && npm install
cd ../server && npm install
```

### Database Issues

Delete the `server/database.sqlite` file and restart the application. The database will be recreated with fresh data.

### Migration Issues

If migrations fail or behave unexpectedly:

1. Check the `server/migrations/` directory for marker files
2. Delete marker files to re-run specific migrations (use with caution)
3. Manually verify database state using an SQLite browser tool
4. Check server logs for detailed error messages

## License

MIT License - feel free to use this project for learning and development.

## Support

For issues and questions, please check the troubleshooting section or review the code comments for detailed implementation notes.
