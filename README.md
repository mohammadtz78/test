# Hello World Page

A full-stack application built with React, Node.js, and SQLite that displays a "Hello World" message from a system settings database.

## 🚀 Quick Start

### One-Command Setup

#### Windows Users
Simply double-click or run:
```bash
start.bat
```

#### Mac/Linux Users
```bash
chmod +x start.sh
./start.sh
```

The script will automatically:
1. ✅ Install all dependencies
2. ✅ Initialize the SQLite database
3. ✅ Start both frontend and backend servers
4. ✅ Open your browser to http://localhost:3000

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[START_HERE.md](START_HERE.md)** | 👋 **New here? Start with this!** Complete welcome guide |
| **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** | 📋 Comprehensive project overview and details |
| **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** | ⚡ Quick commands and troubleshooting |
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | 🏗️ Technical architecture and design |
| **[CONTRIBUTING.md](CONTRIBUTING.md)** | 🤝 How to contribute to the project |
| **[CHANGELOG.md](CHANGELOG.md)** | 📝 Version history and changes |
| **[FILE_TREE.txt](FILE_TREE.txt)** | 📂 Complete file structure overview |

## ✨ Features

- 🎨 Modern UI with custom design theme
- 🔄 Real-time data fetching from SQLite database
- 📱 Responsive design (works on all devices)
- 🚀 Easy one-command startup
- 💾 System settings management via REST API
- 🔔 Toast notifications for user feedback
- ⚡ Loading states and error handling
- 🎯 Clean, well-documented code

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Axios for API calls
- Modern CSS with custom design system

**Backend:**
- Node.js with Express
- SQLite database
- OData-style REST endpoints
- CORS enabled

## 📁 Project Structure

```
hello-world-page/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── styles/        # CSS stylesheets
│   │   └── App.js         # Main app component
│   └── package.json
│
├── server/                # Node.js backend application
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── routes/        # API routes
│   │   └── index.js       # Server entry point
│   └── package.json
│
├── start.bat              # Windows startup script
├── start.sh               # Unix/Mac startup script
└── README.md              # This file
```

## 🌐 Application URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health
- **System Settings:** http://localhost:5000/api/SystemSetting

## 📝 Available Scripts

### Root Level Commands
```bash
# Install all dependencies
npm run install:all

# Run both client and server
npm run dev

# Run only client (port 3000)
npm run client

# Run only server (port 5000)
npm run server

# Build for production
npm run build
```

## 🔌 API Endpoints

### Get Hello World Message
```bash
GET http://localhost:5000/api/SystemSetting/HelloWorld
```

### Get All Settings
```bash
GET http://localhost:5000/api/SystemSetting
```

### Create New Setting
```bash
POST http://localhost:5000/api/SystemSetting
Content-Type: application/json

{
  "settingName": "NewSetting",
  "settingValue": "Value",
  "description": "Optional description"
}
```

### Update Setting
```bash
PUT http://localhost:5000/api/SystemSetting/:settingName
Content-Type: application/json

{
  "settingValue": "Updated Value",
  "description": "Updated description"
}
```

### Delete Setting
```bash
DELETE http://localhost:5000/api/SystemSetting/:settingName
```

## 💾 Database

The application uses SQLite with the following schema:

**SystemSetting Table:**
- `id` - INTEGER PRIMARY KEY (auto-increment)
- `settingName` - TEXT UNIQUE NOT NULL
- `settingValue` - TEXT NOT NULL
- `description` - TEXT NULLABLE

Sample data is automatically inserted on first run.

## 🐛 Troubleshooting

### Port Already in Use
Close any applications using ports 3000 or 5000, or modify the ports in the configuration files.

### Dependencies Not Installing
```bash
# Clean install
npm install
cd client && npm install
cd ../server && npm install
```

### Database Issues
```bash
# Delete and recreate database
rm server/database.sqlite
cd server && node src/init-db.js
```

For more troubleshooting tips, see [QUICK_REFERENCE.md](QUICK_REFERENCE.md).

## 🎨 Design System

The application follows a custom design system with:

- **Primary Color:** #5E6AD2
- **Typography:** SF Mono (body) and SF Pro Display (headings)
- **Component Templates:** Modern buttons, forms, cards, and tables
- **Responsive Layout:** Mobile-first approach with topbar navigation

## 🚀 Development

### Running in Development Mode
```bash
npm run dev
```
This starts both client (port 3000) and server (port 5000) with hot-reloading.

### Building for Production
```bash
npm run build
npm start
```

## 📖 Learn More

- **React:** https://react.dev
- **Express:** https://expressjs.com
- **SQLite:** https://www.sqlite.org
- **Node.js:** https://nodejs.org

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 What's Next?

After getting the application running, you can:

1. **Explore the code** - Well-commented and organized
2. **Try the API** - Test all CRUD operations
3. **Customize the UI** - Modify colors, styles, and components
4. **Add features** - Authentication, routing, more pages
5. **Deploy** - Take it to production!

## 💡 Key Features Implemented

✅ Full-stack architecture  
✅ RESTful API design  
✅ Database integration  
✅ Modern UI components  
✅ Error handling  
✅ Loading states  
✅ Toast notifications  
✅ Responsive design  
✅ Production-ready code structure  
✅ Comprehensive documentation  

## 🎉 Success!

If you see the "Hello World" message displayed on http://localhost:3000, everything is working correctly!

---

**Built with ❤️ using React, Node.js, and SQLite**

*For detailed information, please read [START_HERE.md](START_HERE.md) or [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)*
