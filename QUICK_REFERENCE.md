# Quick Reference Guide

## 🚀 One-Command Startup

### Windows
```bash
start.bat
```

### Mac/Linux
```bash
chmod +x start.sh
./start.sh
```

---

## 🌐 URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:5000 |
| Health Check | http://localhost:5000/health |
| API Root | http://localhost:5000/api/SystemSetting |

---

## 📝 Common Commands

### Installation
```bash
# Install all dependencies
npm run install:all

# Install client only
cd client && npm install

# Install server only
cd server && npm install
```

### Running
```bash
# Start everything
npm run dev

# Start client only
npm run client

# Start server only
npm run server
```

### Building
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Database
```bash
# Initialize database
cd server && npm run init-db

# Delete database
rm server/database.sqlite
```

---

## 🔌 API Quick Reference

### Get Hello World Message
```bash
curl http://localhost:5000/api/SystemSetting/HelloWorld
```

### List All Settings
```bash
curl http://localhost:5000/api/SystemSetting
```

### Create Setting
```bash
curl -X POST http://localhost:5000/api/SystemSetting \
  -H "Content-Type: application/json" \
  -d '{"settingName":"Test","settingValue":"Value","description":"Test setting"}'
```

### Update Setting
```bash
curl -X PUT http://localhost:5000/api/SystemSetting/Test \
  -H "Content-Type: application/json" \
  -d '{"settingValue":"Updated Value","description":"Updated"}'
```

### Delete Setting
```bash
curl -X DELETE http://localhost:5000/api/SystemSetting/Test
```

---

## 🎨 Design System Quick Reference

### Colors
```css
--primary: #5E6AD2;
--secondary: #8B5CF6;
--accent: #10B981;
--background: #FAFAFA;
--surface: #FFFFFF;
--text-primary: #111827;
--text-secondary: #6B7280;
--border: #E5E7EB;
--error: #EF4444;
--success: #10B981;
```

### Typography
```css
/* Headings */
font-family: 'SF Pro Display', sans-serif;
font-weight: 600-700;

/* Body */
font-family: 'SF Mono', monospace;
font-weight: 400-500;

/* Sizes */
font-size: 12px - 36px;
```

### Spacing
```css
xs:  4px
sm:  8px
md:  16px
lg:  24px
xl:  32px
2xl: 48px
```

---

## 📁 Project Structure

```
hello-world-page/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   └── styles/
│   └── public/
├── server/          # Node.js backend
│   └── src/
│       ├── config/
│       └── routes/
├── start.bat        # Windows startup
├── start.sh         # Unix startup
└── README.md        # Documentation
```

---

## 🐛 Quick Troubleshooting

### Port Conflict
```bash
# Kill process on port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill -9

# Kill process on port 5000 (Mac/Linux)
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Clean Restart
```bash
# Remove all node_modules
rm -rf node_modules client/node_modules server/node_modules

# Reinstall
npm run install:all

# Reset database
rm server/database.sqlite
cd server && node src/init-db.js
```

### Dependencies Issue
```bash
# Clear npm cache
npm cache clean --force

# Reinstall
npm run install:all
```

---

## 🧪 Testing Commands

### Frontend Tests
```bash
cd client
npm test              # Run tests
npm test -- --coverage # With coverage
```

### Test Single File
```bash
npm test -- App.test.js
```

---

## 📦 File Locations

### Important Files
```
Configuration:
├── package.json (root, client, server)
├── .gitignore
└── .env.example

Frontend:
├── client/src/index.js (entry)
├── client/src/App.js (root component)
└── client/public/index.html (HTML template)

Backend:
├── server/src/index.js (server entry)
├── server/src/config/database.js (DB config)
└── server/src/routes/systemSettings.js (API routes)

Database:
└── server/database.sqlite (auto-created)
```

---

## 🔧 Configuration

### Change Ports

**Frontend (client/package.json):**
```json
"scripts": {
  "start": "PORT=3001 react-scripts start"
}
```

**Backend (server/src/index.js):**
```javascript
const PORT = process.env.PORT || 5001;
```

### Environment Variables

Create `server/.env`:
```bash
PORT=5000
NODE_ENV=development
DB_PATH=./database.sqlite
```

---

## 📊 Database Schema Quick View

```sql
SystemSetting
├── id (INTEGER, PRIMARY KEY)
├── settingName (TEXT, UNIQUE, NOT NULL)
├── settingValue (TEXT, NOT NULL)
└── description (TEXT, NULLABLE)
```

### Default Data
- HelloWorld: Main greeting message
- AppName: "Hello World Page"
- Version: "1.0.0"
- Theme: "Modern"

---

## 🎯 Component Quick Reference

### Import Components
```javascript
import Navigation from './components/Navigation';
import LoadingSpinner from './components/LoadingSpinner';
import Toast from './components/Toast';
import HelloWorldPage from './components/HelloWorldPage';
```

### Usage Examples

**LoadingSpinner:**
```jsx
<LoadingSpinner text="Loading..." small={false} />
```

**Toast:**
```jsx
<Toast 
  message="Success!" 
  type="success" 
  duration={5000}
  onClose={() => setShowToast(false)}
/>
```

---

## 🔐 Security Checklist

### Before Production
- [ ] Change CORS to specific origins
- [ ] Add authentication
- [ ] Implement rate limiting
- [ ] Use HTTPS
- [ ] Add input validation
- [ ] Set secure headers
- [ ] Update SQLite to PostgreSQL/MySQL
- [ ] Add environment variables
- [ ] Enable logging
- [ ] Set up monitoring

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| README.md | Main documentation |
| PROJECT_SUMMARY.md | Comprehensive overview |
| ARCHITECTURE.md | Technical architecture |
| CONTRIBUTING.md | Contribution guidelines |
| CHANGELOG.md | Version history |
| QUICK_REFERENCE.md | This file |

---

## 🚢 Deployment Checklist

### Pre-Deployment
- [ ] Run all tests
- [ ] Build production bundle
- [ ] Update environment variables
- [ ] Review security settings
- [ ] Check CORS configuration
- [ ] Verify database connection
- [ ] Test API endpoints

### Deployment Steps
1. Build frontend: `npm run build`
2. Set environment variables
3. Deploy backend to hosting service
4. Deploy frontend to static hosting
5. Update API URLs
6. Test production site
7. Monitor for errors

---

## 💡 Quick Tips

### Development
```bash
# Watch for file changes
nodemon server/src/index.js

# React dev server auto-reloads
npm run client

# Run both with one command
npm run dev
```

### Debugging
```bash
# Enable verbose logging
DEBUG=* npm run dev

# Check backend logs
cd server && npm run dev

# Check frontend console
Open browser DevTools (F12)
```

### Performance
```bash
# Analyze bundle size
cd client && npm run build
npx source-map-explorer 'build/static/js/*.js'
```

---

## 🔗 Useful Resources

### Official Documentation
- React: https://react.dev
- Express: https://expressjs.com
- SQLite: https://www.sqlite.org
- Node.js: https://nodejs.org

### Tools
- Postman: API testing
- VS Code: Code editor
- React DevTools: Browser extension
- npm: Package manager

---

## ⚡ Performance Tips

### Frontend
- Use React.memo for expensive components
- Implement code splitting
- Optimize images
- Use production build
- Enable caching

### Backend
- Add database indexes
- Implement caching
- Use connection pooling
- Optimize queries
- Enable compression

---

## 🎓 Learning Resources

### Next Steps
1. Add user authentication
2. Implement routing (React Router)
3. Add more CRUD operations
4. Create additional pages
5. Implement state management (Redux/Context)
6. Add form validation
7. Implement file uploads
8. Add search functionality

### Tutorials
- React documentation
- Express.js guides
- SQL tutorials
- REST API best practices
- Design patterns

---

## 📞 Getting Help

### Check First
1. Read error messages carefully
2. Check console logs (F12 in browser)
3. Review README.md
4. Check ARCHITECTURE.md
5. Look at code comments

### Common Solutions
- Restart servers
- Clear npm cache
- Reinstall dependencies
- Check port availability
- Verify Node.js version

---

## 🎉 Success Indicators

Application is working correctly if:
- ✅ Frontend loads at http://localhost:3000
- ✅ "Hello World!" message appears
- ✅ No errors in browser console
- ✅ Backend responds at http://localhost:5000
- ✅ Database file exists at server/database.sqlite
- ✅ API calls return data
- ✅ Toast notifications appear

---

**Keep this guide handy for quick reference during development!** 🚀
