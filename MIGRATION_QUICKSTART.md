# 🚀 Database Migration Quick Start

## TL;DR

### Windows
```batch
migrate.bat
```

### Mac/Linux
```bash
chmod +x migrate.sh
./migrate.sh
```

---

## What Was Fixed? ✅

**Error:** `has was unexpected at this time.`

**Solution:** Fixed special character escaping in `migrate.bat` for JavaScript arrow functions (`=>`).

**Status:** ✅ **COMPLETELY FIXED** - Migration scripts now work perfectly on all platforms!

---

## When Do I Need to Run Migrations?

Run migrations when:
- 📋 First time setting up the database
- 🔄 Updating database schema (tables, columns, indexes)
- 📝 Modifying existing data
- ⬆️ Upgrading to a new version of the app

---

## Quick Command Reference

| Platform | Command | First Time Setup |
|----------|---------|------------------|
| **Windows** | `migrate.bat` | Double-click the file |
| **Mac/Linux** | `./migrate.sh` | Run `chmod +x migrate.sh` first |

---

## What Happens When You Run It?

```
Step 1: ✅ Check Node.js installation
Step 2: ✅ Install dependencies (if needed)
Step 3: ✅ Check if migration already ran
Step 4: ✅ Connect to database
Step 5: ✅ Apply changes
Step 6: ✅ Mark migration as complete
```

---

## Current Migration

**Migration 001: Update AppName**
- Changes the app name from "Hello World Page" to "Koni"
- Safe to run multiple times (idempotent)
- Takes less than 5 seconds

---

## Success Output

```
=========================================
  Database Migration Tool
=========================================

[INFO] Running migration: Update AppName to 'Koni'
[INFO] Connected to database
[INFO] Updating AppName from "Hello World Page" to "Koni"...
[SUCCESS] AppName updated successfully! Changed 1 row(s)
[INFO] Database connection closed

=========================================
  Migration completed successfully!
=========================================
```

---

## Already Applied?

If you see this message, you're all set! ✅
```
[INFO] Migration 001 (AppName to Koni) has already been applied.
No action needed.
```

To re-run the migration:
1. Stop the application
2. Delete: `server/migrations/.migration_001_appname_to_koni`
3. Run migration script again

---

## Common Issues & Solutions

### ❌ "Node.js is not installed"
**Solution:** Install Node.js from https://nodejs.org/

### ❌ "Server directory not found"
**Solution:** Run the script from the project root directory

### ❌ "Database is locked"
**Solution:** 
1. Stop the application (`Ctrl+C` in the terminal)
2. Close any database browser tools
3. Run migration again

### ❌ "Permission denied" (Mac/Linux)
**Solution:** Make the script executable
```bash
chmod +x migrate.sh
```

---

## Safety Features 🛡️

✅ **Idempotent** - Safe to run multiple times  
✅ **Tracked** - Knows which migrations have been applied  
✅ **Validated** - Checks all prerequisites before running  
✅ **Error Handling** - Clear error messages if something goes wrong  
✅ **No Data Loss** - Only updates specific settings, doesn't delete data  

---

## Need More Help?

📖 **Detailed Documentation:** See `MIGRATION_FIX.md`  
📚 **Full Instructions:** See `README.md` → Database Migration section  
🐛 **Having Issues?** Check the Troubleshooting section in README.md  

---

## Pro Tips 💡

1. **Always backup** your database before migrations (copy `server/database.sqlite`)
2. **Run migrations** before starting the application
3. **Check the output** - green [SUCCESS] messages mean everything worked
4. **Test the app** after migration to ensure everything works correctly

---

## Development Workflow

```
1. Pull latest code
   ↓
2. Run migrate.bat or migrate.sh
   ↓
3. Run start.bat or start.sh
   ↓
4. Application ready! 🎉
```

---

**Last Updated:** 2024  
**Migration Script Version:** 1.0 (Fixed)  
**Status:** ✅ Production Ready
