# 🎨 Visual Migration Guide

## 🚦 Migration Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     START MIGRATION                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Is Node.js Installed?                                       │
│  └─ Check: node --version                                    │
└─────────────────────────────────────────────────────────────┘
        │                                    │
        │ YES                               │ NO
        ▼                                    ▼
    Continue                    ┌──────────────────────────┐
                               │ ❌ ERROR                  │
                               │ Install Node.js first     │
                               │ nodejs.org                │
                               └──────────────────────────┘
                                        │
                                        └─► EXIT (1)
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│  Are Dependencies Installed?                                 │
│  └─ Check: server/node_modules exists                        │
└─────────────────────────────────────────────────────────────┘
        │                                    │
        │ YES                               │ NO
        ▼                                    ▼
    Continue                    ┌──────────────────────────┐
                               │ 📦 Installing...          │
                               │ npm install               │
                               └──────────────────────────┘
                                        │
                                        ▼
                                   Installed ✅
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│  Has Migration Already Run?                                  │
│  └─ Check: server/migrations/.migration_001_*                │
└─────────────────────────────────────────────────────────────┘
        │                                    │
        │ NO                                │ YES
        ▼                                    ▼
    Continue                    ┌──────────────────────────┐
                               │ ℹ️  Already Applied       │
                               │ No action needed          │
                               └──────────────────────────┘
                                        │
                                        └─► EXIT (0)
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│  Connect to Database                                         │
│  └─ Open: server/database.sqlite                             │
└─────────────────────────────────────────────────────────────┘
        │                          
        │ ✅ Connected             
        ▼                          
┌─────────────────────────────────────────────────────────────┐
│  Run Migration SQL                                           │
│  UPDATE SystemSetting                                        │
│  SET settingValue = 'Koni'                                   │
│  WHERE settingName = 'AppName'                               │
└─────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│  Was Update Successful?                                      │
└─────────────────────────────────────────────────────────────┘
        │                                    │
        │ YES                               │ NO
        ▼                                    ▼
┌──────────────────────┐          ┌──────────────────────────┐
│ ✅ SUCCESS            │          │ ❌ ERROR                  │
│ 1 row(s) updated     │          │ Check database           │
└──────────────────────┘          │ Check permissions        │
        │                          └──────────────────────────┘
        ▼                                    │
┌──────────────────────┐                    └─► EXIT (1)
│ Mark as Complete     │
│ Create marker file   │
└──────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│  Close Database Connection                                   │
└─────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│           🎉 MIGRATION COMPLETED SUCCESSFULLY! 🎉            │
└─────────────────────────────────────────────────────────────┘
        │
        └─► EXIT (0)
```

---

## 🎬 Step-by-Step Visual Guide

### Step 1: Locate Migration Script

```
📁 Your Project
├── 📄 migrate.bat    ← Windows users: Double-click this!
├── 📄 migrate.sh     ← Mac/Linux users: Run this!
├── 📄 start.bat
├── 📄 start.sh
└── 📁 server/
```

### Step 2: Run the Script

#### 🪟 Windows
```
┌─────────────────────────────────────┐
│  Double-Click migrate.bat           │
│           OR                         │
│  Right-Click → "Run as Administrator"│
└─────────────────────────────────────┘
```

#### 🍎 Mac/Linux
```
┌─────────────────────────────────────┐
│  Terminal:                          │
│  $ chmod +x migrate.sh              │
│  $ ./migrate.sh                     │
└─────────────────────────────────────┘
```

### Step 3: Watch the Magic Happen

```
┌─────────────────────────────────────────────────┐
│ =========================================       │
│   Database Migration Tool                       │
│ =========================================       │
│                                                 │
│ [INFO] Running migration: Update AppName...    │
│ [INFO] Connected to database                   │
│ [INFO] Updating AppName...                     │
│ [SUCCESS] AppName updated successfully!        │
│ [INFO] Database connection closed              │
│                                                 │
│ =========================================       │
│   Migration completed successfully!             │
│ =========================================       │
└─────────────────────────────────────────────────┘
                     ▼
              Press any key...
```

---

## 🎨 Before & After Visualization

### Database State: Before Migration

```sql
┌────┬──────────┬─────────────────────┬─────────────┐
│ id │ name     │ value               │ description │
├────┼──────────┼─────────────────────┼─────────────┤
│ 1  │ AppName  │ Hello World Page    │ App name    │
└────┴──────────┴─────────────────────┴─────────────┘
```

### Database State: After Migration

```sql
┌────┬──────────┬───────────┬─────────────┐
│ id │ name     │ value     │ description │
├────┼──────────┼───────────┼─────────────┤
│ 1  │ AppName  │ Koni      │ App name    │ ← Updated!
└────┴──────────┴───────────┴─────────────┘
```

---

## 🎯 Success Indicators

### ✅ Everything Went Well

```
┌─────────────────────────────────────┐
│ ✅ Green [SUCCESS] messages         │
│ ✅ "Migration completed successfully"│
│ ✅ No error messages                │
│ ✅ Exit code: 0                     │
└─────────────────────────────────────┘
```

### ⚠️ Warning: Already Applied

```
┌─────────────────────────────────────┐
│ ℹ️  Blue [INFO] message             │
│ ℹ️  "Already been applied"          │
│ ℹ️  "No action needed"              │
│ ✅ This is normal!                  │
└─────────────────────────────────────┘
```

### ❌ Something Went Wrong

```
┌─────────────────────────────────────┐
│ ❌ Red [ERROR] messages             │
│ ❌ Non-zero exit code               │
│ 📖 Check troubleshooting guide      │
└─────────────────────────────────────┘
```

---

## 🗺️ File Structure After Migration

```
📁 Project Root
├── 📄 migrate.bat
├── 📄 migrate.sh
└── 📁 server/
    ├── 📄 database.sqlite         ← Updated!
    └── 📁 migrations/
        └── 📄 .migration_001_appname_to_koni  ← New marker file!
```

---

## 🎮 Interactive Decision Tree

```
                    Need to Migrate?
                          │
            ┌─────────────┼─────────────┐
            │             │             │
         First         Update       Modify
         Setup         Data         Schema
            │             │             │
            └─────────────┴─────────────┘
                          │
                    Run Migration
                          │
            ┌─────────────┼─────────────┐
            │                           │
         Windows                     Mac/Linux
            │                           │
      migrate.bat                   migrate.sh
            │                           │
            └─────────────┬─────────────┘
                          │
                   Check Output
                          │
            ┌─────────────┼─────────────┐
            │             │             │
         Success      Already         Error
            │          Applied          │
            │             │             │
         Done!         Done!      Troubleshoot
```

---

## 📊 Migration Timeline

```
Time: 0s                                                      5s
├──────────────────────────────────────────────────────────┤
│                                                            │
│ Check   Install   Check    Connect   Update   Mark   Done │
│ Node.js  Deps    Previous    DB      Data   Complete     │
│   │       │        │          │        │       │          │
│  0.5s    2s      0.5s       0.5s     0.5s    0.5s        │
│   ✓       ✓        ✓          ✓        ✓       ✓          │
└──────────────────────────────────────────────────────────┘

Total Duration: ~5 seconds (first time)
                ~2 seconds (subsequent runs, already applied)
```

---

## 🎓 Color-Coded Messages Guide

```
┌─────────────────────────────────────────────────────────┐
│ Message Types:                                          │
│                                                         │
│ [INFO]    ℹ️  Blue    - Informational                  │
│ [SUCCESS] ✅ Green   - Operation succeeded             │
│ [WARNING] ⚠️  Yellow  - Non-critical issue             │
│ [ERROR]   ❌ Red     - Operation failed                │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Re-running Migration

### Want to Run Again?

```
Step 1: Stop Application
┌─────────────────────┐
│ Ctrl + C            │
│ or close terminal   │
└─────────────────────┘
         │
         ▼
Step 2: Remove Marker File
┌──────────────────────────────────────────┐
│ Delete:                                  │
│ server/migrations/.migration_001_*       │
└──────────────────────────────────────────┘
         │
         ▼
Step 3: Run Migration Again
┌─────────────────────┐
│ migrate.bat / .sh   │
└─────────────────────┘
```

---

## 🛠️ Troubleshooting Flowchart

```
                    Error Occurred?
                          │
                    What Type?
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
   Node.js Not       Dependencies      Database
      Found             Failed           Locked
        │                 │                 │
        ▼                 ▼                 ▼
  Install Node    Run npm install    Stop App &
  from nodejs.org  in server/        Close DB Tools
        │                 │                 │
        └─────────────────┴─────────────────┘
                          │
                   Try Migration Again
```

---

## 📱 Quick Reference Card

```
╔════════════════════════════════════════════════════════╗
║           MIGRATION QUICK REFERENCE                    ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  Windows:     migrate.bat                             ║
║  Mac/Linux:   ./migrate.sh                            ║
║                                                        ║
║  Duration:    ~5 seconds                              ║
║  Safe:        Yes (idempotent)                        ║
║  Reversible:  Delete marker file                      ║
║                                                        ║
║  Success:     [SUCCESS] message + exit 0              ║
║  Already Run: [INFO] "already applied"                ║
║  Failure:     [ERROR] message + exit 1                ║
║                                                        ║
║  Help:        See MIGRATION_QUICKSTART.md             ║
║  Details:     See MIGRATION_FIX.md                    ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

---

## 🎁 Bonus: Command Line Tips

### Windows PowerShell Users
```powershell
# Run migration
.\migrate.bat

# Check if already applied
Test-Path server\migrations\.migration_001_*

# View migration status
Get-Content server\migrations\.migration_001_* -ErrorAction SilentlyContinue
```

### Unix/Linux/Mac Terminal Users
```bash
# Run migration
./migrate.sh

# Check if already applied
ls -la server/migrations/.migration_001_*

# View migration output with timestamp
./migrate.sh 2>&1 | ts
```

---

## 📸 Screenshot Examples

### Successful Migration Output
```
╔══════════════════════════════════════════════════════╗
║  C:\project> migrate.bat                             ║
║                                                      ║
║  =========================================           ║
║    Database Migration Tool                           ║
║  =========================================           ║
║                                                      ║
║  [INFO] Running migration: Update AppName to 'Koni' ║
║  [INFO] Connected to database                       ║
║  [INFO] Updating AppName from "Hello World Page"... ║
║  [SUCCESS] AppName updated successfully!            ║
║            Changed 1 row(s)                         ║
║  [INFO] Database connection closed                  ║
║                                                      ║
║  =========================================           ║
║    Migration completed successfully!                 ║
║  =========================================           ║
║                                                      ║
║  Press any key to continue...                       ║
╚══════════════════════════════════════════════════════╝
```

### Already Applied Output
```
╔══════════════════════════════════════════════════════╗
║  C:\project> migrate.bat                             ║
║                                                      ║
║  =========================================           ║
║    Database Migration Tool                           ║
║  =========================================           ║
║                                                      ║
║  [INFO] Migration 001 (AppName to Koni) has         ║
║         already been applied.                       ║
║  [INFO] No action needed.                           ║
║                                                      ║
║  Press any key to continue...                       ║
╚══════════════════════════════════════════════════════╝
```

---

**Made with ❤️ for easy migrations!**
