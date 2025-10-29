# Database Migration Guide

This guide provides detailed information about database migrations in the Hello World Page (Koni) application.

## Table of Contents

- [Overview](#overview)
- [Migration Scripts](#migration-scripts)
- [How to Run Migrations](#how-to-run-migrations)
- [Migration Tracking](#migration-tracking)
- [Available Migrations](#available-migrations)
- [Creating New Migrations](#creating-new-migrations)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Overview

Database migrations are automated scripts that modify the database schema or data in a controlled and version-tracked manner. They ensure that all environments (development, staging, production) have the same database structure and critical data updates.

### Why Use Migrations?

- **Version Control**: Track database changes alongside code changes
- **Consistency**: Ensure all team members and environments have the same database structure
- **Safety**: Prevent duplicate execution with idempotent design
- **Automation**: Apply changes automatically without manual SQL execution
- **Documentation**: Each migration documents what changed and when

## Migration Scripts

The project includes two migration scripts:

### Windows: `migrate.bat`
- Runs on Windows systems
- Execute by double-clicking or running `migrate.bat` in command prompt

### Unix/Mac/Linux: `migrate.sh`
- Runs on Unix-based systems (Mac, Linux)
- Requires execution permission: `chmod +x migrate.sh`
- Execute with: `./migrate.sh`

### What Migration Scripts Do

1. **Check Prerequisites**
   - Verify Node.js installation
   - Verify project structure
   - Check for required dependencies

2. **Install Dependencies** (if needed)
   - Automatically installs npm packages
   - Only runs if `node_modules` directory is missing

3. **Track Execution**
   - Check if migration has already been applied
   - Create marker files to prevent duplicate execution
   - Store markers in `server/migrations/` directory

4. **Apply Changes**
   - Execute database updates
   - Provide clear progress messages
   - Handle errors gracefully

5. **Cleanup**
   - Remove temporary files
   - Close database connections
   - Exit with appropriate status code

## How to Run Migrations

### Prerequisites

- Node.js installed (v14 or higher)
- Project dependencies installed (script handles this automatically)
- Database file exists (`server/database.sqlite`)

### Step-by-Step Instructions

#### Windows

1. **Open Command Prompt** or navigate to project root in File Explorer
2. **Run the script:**
   ```bash
   migrate.bat
   ```
   Or simply double-click `migrate.bat` in File Explorer

3. **Wait for completion**
   - Script will show progress messages
   - Wait for "Migration completed successfully!" message

#### Mac/Linux

1. **Open Terminal** and navigate to project root
2. **Make script executable** (first time only):
   ```bash
   chmod +x migrate.sh
   ```

3. **Run the script:**
   ```bash
   ./migrate.sh
   ```

4. **Wait for completion**
   - Script will show progress messages
   - Wait for "Migration completed successfully!" message

### What to Expect

#### Successful Migration

```
=========================================
   Database Migration Tool
=========================================

[INFO] Installing server dependencies...
[INFO] Running migration: Update AppName to 'Koni'
[INFO] Connected to database
[INFO] Updating AppName from "Hello World Page" to "Koni"...
[SUCCESS] AppName updated successfully! Changed 1 row(s)
[INFO] Database connection closed

=========================================
   Migration completed successfully!
=========================================
```

#### Already Applied

```
=========================================
   Database Migration Tool
=========================================

[INFO] Migration 001 (AppName to Koni) has already been applied.
No action needed.
```

#### Error Example

```
[ERROR] Failed to connect to database: SQLITE_CANTOPEN
[ERROR] Migration failed!
```

## Migration Tracking

### How It Works

1. **Marker Files**: Each migration creates a hidden marker file in `server/migrations/`
2. **Naming Convention**: `.migration_[number]_[description]`
3. **Check Before Run**: Scripts check for marker files before executing
4. **Idempotent**: Safe to run multiple times without side effects

### Marker File Location

```
server/
  └── migrations/
      └── .migration_001_appname_to_koni
```

### Checking Migration Status

To see which migrations have been applied:

**Windows (PowerShell):**
```powershell
Get-ChildItem server/migrations -Force
```

**Mac/Linux:**
```bash
ls -la server/migrations/
```

### Resetting Migrations (Advanced)

⚠️ **Warning**: Only do this if you know what you're doing!

To re-run a migration:

1. **Backup your database** first:
   ```bash
   # Windows
   copy server\database.sqlite server\database.backup.sqlite
   
   # Mac/Linux
   cp server/database.sqlite server/database.backup.sqlite
   ```

2. **Delete the marker file:**
   ```bash
   # Windows
   del server\migrations\.migration_001_appname_to_koni
   
   # Mac/Linux
   rm server/migrations/.migration_001_appname_to_koni
   ```

3. **Re-run the migration script**

## Available Migrations

### Migration 001: Update AppName to Koni

**File**: `.migration_001_appname_to_koni`

**Purpose**: Updates the application name from "Hello World Page" to "Koni"

**Changes**:
- Updates `SystemSetting` table
- Changes `settingValue` where `settingName = 'AppName'`
- New value: "Koni"

**SQL Equivalent**:
```sql
UPDATE SystemSetting 
SET settingValue = 'Koni' 
WHERE settingName = 'AppName';
```

**Impact**: 
- Updates 1 row in database
- Non-breaking change
- Visible in application name display

## Creating New Migrations

### When to Create a Migration

Create a migration when you need to:
- Add, remove, or modify database tables
- Add, remove, or modify columns
- Add or modify indexes
- Update existing data
- Change constraints or foreign keys

### Migration Naming Convention

Use descriptive names:
- `.migration_002_add_user_table`
- `.migration_003_add_email_column`
- `.migration_004_update_default_theme`

### Steps to Create a New Migration

1. **Update migration scripts** (`migrate.bat` and `migrate.sh`)
2. **Add new migration check** after existing migrations
3. **Write migration SQL** or database operations
4. **Add marker file creation** after successful execution
5. **Test thoroughly** on development database
6. **Document in CHANGELOG.md** and this guide

### Example Migration Template

```javascript
// Check if migration has been applied
if exist "migrations\.migration_002_add_user_table" (
    echo [INFO] Migration 002 already applied
) else (
    echo [INFO] Running Migration 002: Add User Table
    
    // Create migration script
    echo const db = new sqlite3.Database(DB_PATH); > temp_migrate_002.js
    echo db.run('CREATE TABLE IF NOT EXISTS User (...)', (err) => { >> temp_migrate_002.js
    echo   if (err) process.exit(1); >> temp_migrate_002.js
    echo   console.log('[SUCCESS] User table created'); >> temp_migrate_002.js
    echo }); >> temp_migrate_002.js
    
    // Execute migration
    node temp_migrate_002.js
    
    // Mark as complete
    if %ERRORLEVEL% EQU 0 (
        echo. > migrations\.migration_002_add_user_table
    )
)
```

## Troubleshooting

### Migration Won't Run

**Problem**: Script exits immediately or shows permission errors

**Solutions**:
- **Windows**: Run Command Prompt as Administrator
- **Mac/Linux**: Check file permissions with `ls -l migrate.sh`
- **Mac/Linux**: Make executable with `chmod +x migrate.sh`

### Database Locked Error

**Problem**: `SQLITE_BUSY` or database locked message

**Solutions**:
1. Stop the development server (`Ctrl+C` in terminal)
2. Close any database browser tools
3. Wait a few seconds and try again
4. Check for zombie processes using the database

### Node.js Not Found

**Problem**: `node is not recognized` or `command not found`

**Solutions**:
1. Install Node.js from [nodejs.org](https://nodejs.org/)
2. Restart terminal/command prompt after installation
3. Verify installation: `node --version`

### Dependencies Not Installing

**Problem**: npm install fails in migration script

**Solutions**:
1. Check internet connection
2. Clear npm cache: `npm cache clean --force`
3. Delete `server/node_modules` and `server/package-lock.json`
4. Manually install: `cd server && npm install`

### Migration Runs But No Changes

**Problem**: Success message but data unchanged

**Possible Causes**:
1. Migration already applied (check marker files)
2. WHERE clause doesn't match any rows
3. Database file is different than expected

**Solutions**:
1. Check marker files in `server/migrations/`
2. Verify database location: `server/database.sqlite`
3. Manually inspect database with SQLite browser
4. Check migration SQL for correct conditions

### Accidental Re-run Needed

**Problem**: Need to run migration again after fixing an issue

**Solutions**:
1. Backup database first!
2. Delete the marker file (see [Resetting Migrations](#resetting-migrations-advanced))
3. Re-run the migration script

### Database Corruption

**Problem**: Database file is corrupted or unreadable

**Solutions**:
1. Stop all applications using the database
2. Restore from backup if available
3. Recreate database: Delete `database.sqlite` and run `start.bat`/`start.sh`
4. Re-run all migrations in order

## Best Practices

### Before Running Migrations

1. ✅ **Always backup your database**
   ```bash
   # Windows
   copy server\database.sqlite server\database.backup.sqlite
   
   # Mac/Linux
   cp server/database.sqlite server/database.backup.sqlite
   ```

2. ✅ **Stop the development server**
   - Close running instances of `start.bat`/`start.sh`
   - Ensure no active connections to database

3. ✅ **Test on development first**
   - Never run untested migrations on production
   - Verify results before deploying

### During Migrations

1. ✅ **Read all output messages**
   - Check for warnings and errors
   - Verify expected number of changed rows

2. ✅ **Don't interrupt the process**
   - Let migration complete fully
   - Interruption may leave database in inconsistent state

### After Migrations

1. ✅ **Verify the changes**
   - Check that expected data was modified
   - Test application functionality
   - Review logs for any issues

2. ✅ **Commit marker files to git**
   - Ensures team members know which migrations are applied
   - Keeps migration history synchronized

3. ✅ **Update documentation**
   - Document what changed
   - Update version numbers
   - Add to CHANGELOG.md

### Writing Migrations

1. ✅ **Keep migrations small**
   - One logical change per migration
   - Easier to debug and rollback if needed

2. ✅ **Make migrations idempotent**
   - Safe to run multiple times
   - Use `IF NOT EXISTS` for schema changes
   - Check conditions before data updates

3. ✅ **Test thoroughly**
   - Test on fresh database
   - Test on database with existing data
   - Test rollback if supported

4. ✅ **Document clearly**
   - Explain what the migration does
   - Note any dependencies
   - Document expected results

## Additional Resources

- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Node.js SQLite3 Module](https://github.com/TryGhost/node-sqlite3)
- [Database Migration Best Practices](https://www.liquibase.org/get-started/best-practices)

## Getting Help

If you encounter issues not covered in this guide:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the main [README.md](README.md) troubleshooting section
3. Check migration script output for specific error messages
4. Examine the database with an SQLite browser tool
5. Review git commit history for related changes

---

**Last Updated**: 2024-01-15  
**Version**: 1.1.0
