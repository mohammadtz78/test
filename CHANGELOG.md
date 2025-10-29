# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2024-01-20

### Fixed

#### Critical Migration Script Fix
- **Fixed** `migrate.bat` syntax error: "has was unexpected at this time"
- **Root Cause**: Improper escaping of JavaScript arrow function syntax (`=>`) in Windows batch file
- **Solution**: Implemented proper escape sequences (`^^^=^^^>`) for special characters
- **Impact**: Migration script now works flawlessly on all Windows versions

### Changed
- Improved `migrate.bat` script structure with `setlocal EnableDelayedExpansion`
- Enhanced echo block organization using parentheses with single redirect
- Better error messages and console output formatting

### Added
- **MIGRATION_FIX.md**: Comprehensive documentation of the fix and escape sequences
- **MIGRATION_QUICKSTART.md**: Quick reference guide for running migrations
- Detailed troubleshooting section for batch file special characters
- Prevention tips for future batch file development
- Testing verification steps

### Technical Details
- **Escape Sequences**: Arrow functions now properly escaped in batch files
- **Special Characters**: All JavaScript special chars (`()`, `>`, `|`, `&`) properly handled
- **Idempotency**: Migration scripts remain safe to run multiple times
- **Cross-Platform**: Both Windows and Unix scripts verified working

## [1.1.0] - 2024-01-15

### Added

#### Database Migration System
- Migration scripts for Windows (`migrate.bat`) and Unix/Mac (`migrate.sh`)
- Migration tracking system to prevent duplicate migrations
- Idempotent migration execution (safe to run multiple times)
- Clear migration status messages and error handling
- Migration documentation in README

#### Migration 001
- Update AppName setting from "Hello World Page" to "Koni"
- Automated database value update
- Migration tracking via marker files in `server/migrations/`

### Changed
- **Breaking**: Application name changed from "Hello World Page" to "Koni" in database
- Enhanced README with comprehensive database migration section
- Updated troubleshooting guide with migration-related issues

### Documentation
- Added "Database Migration" section to README
- Documented when migrations are needed
- Provided step-by-step migration instructions
- Added migration failure recovery guide
- Updated project structure to include migrations directory

## [1.0.0] - 2024-01-01

### Added

#### Frontend
- React 18 application with modern UI
- Navigation component with fixed topbar
- Hello World page component with data fetching
- Loading spinner component
- Toast notification system
- Custom design system implementation
- Responsive design for mobile and desktop
- Error handling with retry functionality
- System information display

#### Backend
- Node.js Express server
- SQLite database integration
- OData-style REST API endpoints
- SystemSetting entity with CRUD operations
- Database initialization script
- CORS support for cross-origin requests
- Error handling middleware
- Request logging
- Health check endpoint

#### Development Tools
- Automatic startup scripts for Windows (start.bat)
- Automatic startup scripts for Unix/Mac (start.sh)
- Concurrent development server execution
- Hot reload for frontend and backend
- Comprehensive .gitignore
- Development documentation

#### Documentation
- Comprehensive README with quick start guide
- API documentation
- Design system documentation
- Project structure overview
- Troubleshooting guide
- Contributing guidelines
- MIT License

### Features

- **System Settings Management**: Store and retrieve system configuration
- **Hello World Display**: Fetch and display message from database
- **Real-time Updates**: Automatic data fetching on page load
- **Error Recovery**: Retry mechanism for failed requests
- **User Feedback**: Toast notifications for success and error states
- **Loading States**: Visual feedback during data operations
- **Responsive Design**: Works on all screen sizes
- **Modern UI**: Custom design system with SF fonts
- **Easy Setup**: One-command startup for the entire stack

### Technical Details

- **Frontend**: React 18, Axios, Modern CSS
- **Backend**: Node.js, Express 4.x, SQLite3
- **Database**: SQLite with SystemSetting table
- **API Style**: OData-inspired REST endpoints
- **Design**: Custom design system with consistent theming
- **Deployment**: Development and production build scripts

## [Unreleased]

### Planned Features
- User authentication and authorization
- Multiple pages and routing
- Settings management UI
- Database backup functionality
- Advanced filtering and search
- Export/import functionality
- Dark mode support
- Internationalization (i18n)
- More comprehensive migration system with rollback support
- Migration versioning system
- Automated migration testing
