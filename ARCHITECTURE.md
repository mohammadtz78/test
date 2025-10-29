# Application Architecture

## System Overview

The Hello World Page is a full-stack web application following a three-tier architecture:

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT TIER                          │
│                    (React App)                           │
│                   Port: 3000                             │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ HTTP/REST API
                       │ (axios)
                       │
┌──────────────────────▼──────────────────────────────────┐
│                   SERVER TIER                            │
│              (Node.js + Express)                         │
│                   Port: 5000                             │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ SQL Queries
                       │ (sqlite3)
                       │
┌──────────────────────▼──────────────────────────────────┐
│                    DATA TIER                             │
│                 (SQLite Database)                        │
│              File: database.sqlite                       │
└─────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Component Hierarchy

```
App (Root Component)
│
├── Navigation
│   └── Fixed Topbar with branding and links
│
└── HelloWorldPage
    ├── LoadingSpinner (conditional)
    ├── ErrorDisplay (conditional)
    ├── MessageDisplay (conditional)
    │   ├── Badge (Success indicator)
    │   ├── Message Icon
    │   ├── Message Text
    │   └── Description
    │
    ├── InfoSection
    │   └── InfoGrid
    │       ├── InfoCard (Status)
    │       ├── InfoCard (Database)
    │       ├── InfoCard (Backend)
    │       └── InfoCard (Frontend)
    │
    └── Toast (conditional)
        ├── Toast Header
        └── Toast Message
```

### Data Flow (Frontend)

```
┌──────────────────┐
│  HelloWorldPage  │
│   (Component)    │
└────────┬─────────┘
         │
         │ useEffect (on mount)
         │
         ▼
┌────────────────────┐
│ fetchHelloWorld    │
│  Message()         │
└─────────┬──────────┘
          │
          │ axios.get()
          │
          ▼
┌─────────────────────┐
│  Backend API Call   │
│  /api/SystemSetting │
│     /HelloWorld     │
└─────────┬───────────┘
          │
          ├─── Success ──────► setMessage()
          │                    └─► Show Success Toast
          │
          └─── Error ────────► setError()
                                └─► Show Error Toast
```

### State Management

```javascript
// HelloWorldPage Component State
{
  message: string,        // The Hello World message
  loading: boolean,       // Loading state
  error: string | null,   // Error message
  showToast: boolean,     // Toast visibility
  toastConfig: {          // Toast configuration
    message: string,
    type: 'success' | 'error' | 'warning' | 'info'
  }
}
```

---

## Backend Architecture

### Server Structure

```
Express Application
│
├── Middleware Stack
│   ├── CORS (Enable cross-origin)
│   ├── express.json() (Parse JSON)
│   ├── express.urlencoded() (Parse forms)
│   └── Request Logger
│
├── Routes
│   ├── GET /health (Health check)
│   ├── GET / (API info)
│   ├── /api/SystemSetting/* (Settings routes)
│   │   ├── GET / (List all)
│   │   ├── GET /:settingName (Get one)
│   │   ├── POST / (Create)
│   │   ├── PUT /:settingName (Update)
│   │   └── DELETE /:settingName (Delete)
│   └── 404 Handler
│
└── Error Handler (Catch-all)
```

### Request Flow (Backend)

```
┌────────────────┐
│  HTTP Request  │
└────────┬───────┘
         │
         ▼
┌────────────────┐
│  CORS Check    │
└────────┬───────┘
         │
         ▼
┌────────────────┐
│  JSON Parser   │
└────────┬───────┘
         │
         ▼
┌────────────────┐
│  Route Match   │
└────────┬───────┘
         │
         ▼
┌──────────────────────┐
│  Route Handler       │
│  (systemSettings.js) │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Database Query      │
│  (SQLite)            │
└──────────┬───────────┘
           │
           ├─── Success ──► JSON Response (200)
           │
           └─── Error ───► Error Response (4xx/5xx)
```

### Database Layer

```
Database Configuration (config/database.js)
│
├── getDatabase()
│   └── Returns SQLite connection
│
├── createTables()
│   └── CREATE TABLE IF NOT EXISTS SystemSetting
│
├── insertInitialData()
│   └── INSERT default settings
│
└── initializeDatabase()
    └── Orchestrates setup
```

---

## Database Schema

### SystemSetting Table

```sql
CREATE TABLE SystemSetting (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  settingName TEXT UNIQUE NOT NULL,
  settingValue TEXT NOT NULL,
  description TEXT
);

-- Index on settingName for fast lookups
CREATE UNIQUE INDEX idx_setting_name ON SystemSetting(settingName);
```

### Entity Relationship

```
┌─────────────────────────────────────┐
│         SystemSetting               │
├─────────────────────────────────────┤
│ 🔑 id: INTEGER (PK)                 │
│ 🔒 settingName: TEXT (UNIQUE)       │
│ 📝 settingValue: TEXT               │
│ 💬 description: TEXT (NULLABLE)     │
└─────────────────────────────────────┘

Constraints:
- Primary Key: id (auto-increment)
- Unique: settingName
- Not Null: settingName, settingValue
```

---

## API Architecture

### OData-Style REST API

```
Base URL: http://localhost:5000/api

┌─────────────────────────────────────────────────────┐
│  Resource: SystemSetting                            │
├─────────────────────────────────────────────────────┤
│                                                      │
│  GET    /SystemSetting           List all settings  │
│  GET    /SystemSetting/:name     Get one setting    │
│  POST   /SystemSetting           Create setting     │
│  PUT    /SystemSetting/:name     Update setting     │
│  DELETE /SystemSetting/:name     Delete setting     │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Response Format

#### Success Response (List)
```json
{
  "value": [
    {
      "id": 1,
      "settingName": "HelloWorld",
      "settingValue": "Hello World!",
      "description": "Main message"
    }
  ],
  "count": 1
}
```

#### Success Response (Single Item)
```json
{
  "settingName": "HelloWorld",
  "settingValue": "Hello World!",
  "description": "Main message"
}
```

#### Error Response
```json
{
  "error": "Error Type",
  "message": "Detailed error message"
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid input data |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate settingName |
| 500 | Server Error | Database or server error |

---

## Design System Architecture

### CSS Architecture

```
Global Styles (index.css)
│
├── CSS Reset
├── Base Typography
├── Global Variables
└── Utility Classes
    │
    ├── Component Styles
    │   ├── Navigation.css
    │   ├── LoadingSpinner.css
    │   ├── Toast.css
    │   └── HelloWorldPage.css
    │
    └── App.css (Root component styles)
```

### Design Tokens

```javascript
// Colors
const colors = {
  primary: '#5E6AD2',
  secondary: '#8B5CF6',
  accent: '#10B981',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    disabled: '#D1D5DB'
  },
  border: '#E5E7EB',
  error: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
  info: '#3B82F6'
};

// Typography
const typography = {
  fontFamily: {
    body: 'SF Mono, monospace',
    heading: 'SF Pro Display, sans-serif'
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px'
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  }
};

// Spacing
const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px'
};
```

---

## Security Architecture

### Current Security Measures

1. **CORS Configuration**
   - Enabled for all origins in development
   - Should be restricted in production

2. **Input Validation**
   - Required field checks
   - Data type validation
   - SQL injection prevention (parameterized queries)

3. **Error Handling**
   - Generic error messages to clients
   - Detailed logging on server
   - No sensitive data in responses

### Future Security Enhancements

```
┌─────────────────────────────────────┐
│  Authentication & Authorization     │
├─────────────────────────────────────┤
│  - JWT tokens                       │
│  - User sessions                    │
│  - Role-based access control        │
│  - Rate limiting                    │
│  - Input sanitization               │
│  - HTTPS enforcement                │
└─────────────────────────────────────┘
```

---

## Deployment Architecture

### Development Setup

```
┌──────────────────────┐
│   Developer Machine  │
├──────────────────────┤
│                      │
│  ┌────────────────┐  │
│  │  start.bat/.sh │  │
│  └────────┬───────┘  │
│           │          │
│  ┌────────▼───────┐  │
│  │   npm install  │  │
│  └────────┬───────┘  │
│           │          │
│  ┌────────▼───────┐  │
│  │   npm run dev  │  │
│  └────────┬───────┘  │
│           │          │
│  ┌────────▼────────────────┐
│  │  concurrently           │
│  │  ├─ Client (port 3000) │
│  │  └─ Server (port 5000) │
│  └─────────────────────────┘
│                      │
└──────────────────────┘
```

### Production Deployment (Recommended)

```
┌───────────────────────────────────────┐
│          Cloud Provider               │
│        (AWS, Azure, Heroku)           │
├───────────────────────────────────────┤
│                                       │
│  ┌─────────────────────────────────┐ │
│  │       Frontend (Static)         │ │
│  │    (S3, Azure Blob, CDN)        │ │
│  │      Built React App            │ │
│  └─────────────────────────────────┘ │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │      Backend (Container)        │ │
│  │   (EC2, App Service, Dyno)      │ │
│  │   Node.js + Express Server      │ │
│  └─────────────────────────────────┘ │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │     Database (Managed)          │ │
│  │  (RDS, Azure DB, PostgreSQL)    │ │
│  │    (Upgraded from SQLite)       │ │
│  └─────────────────────────────────┘ │
│                                       │
└───────────────────────────────────────┘
```

---

## Performance Architecture

### Optimization Strategies

1. **Frontend Optimizations**
   ```
   - Code splitting (React.lazy)
   - Asset optimization
   - Caching strategies
   - Lazy loading images
   - Minification
   ```

2. **Backend Optimizations**
   ```
   - Database indexing
   - Query optimization
   - Response compression
   - Caching layer (Redis)
   - Connection pooling
   ```

3. **Network Optimizations**
   ```
   - HTTP/2
   - CDN for static assets
   - Gzip/Brotli compression
   - API response caching
   ```

---

## Scalability Architecture

### Horizontal Scaling Strategy

```
                    ┌─────────────┐
                    │Load Balancer│
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐       ┌────▼────┐       ┌────▼────┐
   │Server 1 │       │Server 2 │       │Server N │
   └────┬────┘       └────┬────┘       └────┬────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                    ┌──────▼──────┐
                    │   Database  │
                    │   Cluster   │
                    └─────────────┘
```

---

## Monitoring & Logging Architecture

### Logging Strategy

```
Application Logs
├── Frontend (Browser Console)
│   ├── User actions
│   ├── API calls
│   └── Errors
│
└── Backend (Server Logs)
    ├── Request logs
    ├── Database queries
    ├── Errors
    └── Performance metrics
```

### Monitoring Points

```
┌─────────────────────────────────────┐
│         Monitoring Dashboard        │
├─────────────────────────────────────┤
│  - Server uptime                    │
│  - Response times                   │
│  - Error rates                      │
│  - Database performance             │
│  - Memory usage                     │
│  - CPU usage                        │
│  - Active connections               │
└─────────────────────────────────────┘
```

---

## Testing Architecture

### Test Structure

```
Testing Pyramid
│
├── E2E Tests (Few)
│   └── Full user flows
│
├── Integration Tests (Some)
│   ├── API endpoint tests
│   └── Component integration
│
└── Unit Tests (Many)
    ├── Component tests
    ├── Function tests
    └── Utility tests
```

---

## Build Process

### Development Build Flow

```
┌──────────────┐
│ Source Code  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Webpack    │ ◄── React Scripts
└──────┬───────┘
       │
       ├─► Transpile (Babel)
       ├─► Bundle
       ├─► Hot Reload
       │
       ▼
┌──────────────┐
│ Dev Server   │
│  Port 3000   │
└──────────────┘
```

### Production Build Flow

```
┌──────────────┐
│ Source Code  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Webpack    │
└──────┬───────┘
       │
       ├─► Transpile
       ├─► Minify
       ├─► Optimize
       ├─► Bundle
       ├─► Hash filenames
       │
       ▼
┌──────────────┐
│ /build       │
│ (Static)     │
└──────────────┘
```

---

## Technology Decisions

### Why React?
- ✅ Component-based architecture
- ✅ Large ecosystem
- ✅ Virtual DOM performance
- ✅ Strong community support

### Why Express?
- ✅ Minimal and flexible
- ✅ Large middleware ecosystem
- ✅ Well-documented
- ✅ Easy to learn

### Why SQLite?
- ✅ Zero configuration
- ✅ Serverless
- ✅ Perfect for development
- ✅ Easy to upgrade to other SQL databases

### Why OData-style API?
- ✅ Consistent conventions
- ✅ Self-documenting
- ✅ Predictable structure
- ✅ Industry standard

---

## Future Architecture Considerations

### Microservices Architecture

```
┌────────────┐  ┌────────────┐  ┌────────────┐
│   Auth     │  │  Settings  │  │   Users    │
│  Service   │  │  Service   │  │  Service   │
└─────┬──────┘  └─────┬──────┘  └─────┬──────┘
      │               │               │
      └───────────────┼───────────────┘
                      │
              ┌───────▼────────┐
              │  API Gateway   │
              └───────┬────────┘
                      │
              ┌───────▼────────┐
              │   Frontend     │
              └────────────────┘
```

---

**This architecture document provides a comprehensive overview of the Hello World Page application structure and design decisions.**
