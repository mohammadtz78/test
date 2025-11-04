# Spotify Account Manager

A comprehensive multi-account Spotify management application that allows users to manage multiple Spotify accounts, sync playlists, track listening history, manage subscriptions, and automate playlist management.

## Features

- **Multi-Account Management**: Link and manage multiple Spotify accounts from a single dashboard
- **Playlist Management**: View, create, copy, move, and synchronize playlists across accounts
- **Listening History**: Track and analyze listening activity across all linked accounts
- **Automated Rules**: Create automation rules for dynamic playlist management
- **Device Management**: View and manage active Spotify streaming sessions
- **Subscription Overview**: Monitor subscription status and billing for all accounts
- **Data Export**: Export listening history and playlist data

## Tech Stack

- **Frontend**: React 18 with React Router
- **Backend**: Node.js with Express
- **Database**: SQLite
- **UI Components**: Custom components with modern styling

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Quick Start

### Windows

Simply double-click `start.bat` or run from command prompt:

```bash
start.bat
```

### Mac/Linux

Make the script executable and run:

```bash
chmod +x start.sh
./start.sh
```

The startup script will:
1. Check for Node.js and npm installation
2. Install all dependencies (root, client, and server)
3. Start both the client and server concurrently

### Manual Setup

If you prefer manual setup:

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..

# Install server dependencies
cd server
npm install
cd ..

# Run the application
npm run dev
```

## Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## Project Structure

```
spotify-account-manager/
├── client/                 # React frontend application
│   ├── public/            # Static files
│   ├── src/               # Source files
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── App.js         # Main App component
│   │   └── index.js       # Entry point
│   └── package.json       # Client dependencies
├── server/                # Node.js backend application
│   ├── database.js        # Database initialization
│   ├── index.js           # Express server and API routes
│   └── package.json       # Server dependencies
├── package.json           # Root dependencies (concurrently)
├── start.bat              # Windows startup script
├── start.sh               # Unix startup script
└── README.md              # This file
```

## Available Scripts

- `npm run dev` - Run both client and server concurrently
- `npm run client` - Run only the React frontend
- `npm run server` - Run only the Node.js backend
- `npm run install-all` - Install dependencies for root, client, and server

## API Endpoints

### Spotify Accounts
- `GET /api/spotify-accounts` - Get all linked Spotify accounts
- `GET /api/spotify-accounts/:id` - Get specific account details
- `POST /api/spotify-accounts` - Link new Spotify account
- `PUT /api/spotify-accounts/:id` - Update account details
- `DELETE /api/spotify-accounts/:id` - Unlink Spotify account

### Playlists
- `GET /api/playlists` - Get all playlists across accounts
- `GET /api/playlists/:id` - Get specific playlist details
- `POST /api/playlists` - Create new playlist
- `PUT /api/playlists/:id` - Update playlist
- `DELETE /api/playlists/:id` - Delete playlist
- `POST /api/playlists/:id/copy` - Copy playlist to another account
- `POST /api/playlists/:id/move` - Move playlist to another account

### Listening Activity
- `GET /api/listening-activity` - Get listening history
- `GET /api/listening-activity/reports` - Get listening reports
- `POST /api/listening-activity` - Record new listening event

### Devices
- `GET /api/devices` - Get all active devices
- `DELETE /api/devices/:id` - Disconnect device

### Subscriptions
- `GET /api/subscriptions` - Get all subscriptions
- `GET /api/subscriptions/:id` - Get specific subscription details

### Playlist Rules
- `GET /api/playlist-rules` - Get all automation rules
- `GET /api/playlist-rules/:id` - Get specific rule
- `POST /api/playlist-rules` - Create new rule
- `PUT /api/playlist-rules/:id` - Update rule
- `DELETE /api/playlist-rules/:id` - Delete rule

## Database Schema

The application uses SQLite with the following main tables:

- **User**: Application users
- **SpotifyAccount**: Linked Spotify accounts with OAuth tokens
- **Track**: Track information from Spotify
- **Playlist**: User playlists
- **PlaylistTrack**: Tracks within playlists
- **ListeningActivity**: Listening history entries
- **Device**: Active Spotify devices
- **Subscription**: Subscription information
- **PlaylistRule**: Automation rules for playlists

## Troubleshooting

### Port Already in Use

If you see an error about ports 3000 or 5000 already being in use:

1. Find and stop the process using the port:
   - Windows: `netstat -ano | findstr :3000` then `taskkill /PID <PID> /F`
   - Mac/Linux: `lsof -ti:3000 | xargs kill`

2. Or change the port in the respective package.json file

### Dependencies Installation Failed

If dependency installation fails:

1. Clear npm cache: `npm cache clean --force`
2. Delete all node_modules folders
3. Delete package-lock.json files
4. Run `npm run install-all` again

### Database Errors

If you encounter database errors:

1. Stop the server
2. Delete the database file: `server/database.sqlite`
3. Restart the application - the database will be recreated with sample data

### Cannot Start Application

If the startup script fails:

1. Verify Node.js is installed: `node --version`
2. Verify npm is installed: `npm --version`
3. Try manual setup (see Manual Setup section)
4. Check console output for specific error messages

## Development

### Adding New Features

1. **Backend**: Add API endpoints in `server/index.js`
2. **Database**: Update schema in `server/database.js`
3. **Frontend**: Create components in `client/src/components/`
4. **API Service**: Add API calls in `client/src/services/api.js`
5. **Pages**: Create pages in `client/src/pages/`
6. **Routing**: Update routes in `client/src/App.js`

### Code Style

- Use camelCase for variables and functions
- Use PascalCase for React components
- Add comments for complex logic
- Follow React best practices and hooks guidelines

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Support

For issues, questions, or contributions, please refer to the project documentation or create an issue in the repository.
