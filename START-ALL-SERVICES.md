# 🚀 Interactive Resume Maker - Complete Startup Guide

## 📋 Prerequisites
- **Java 11+** installed
- **Maven 3.6+** installed  
- **Node.js 16+** installed
- **MongoDB** running (local or cloud)
- **Modern web browser** (Chrome, Firefox, Edge)

---

## 🗄️ 1. Start MongoDB Database

### Option A: Local MongoDB
```bash
# Start MongoDB service (Windows)
net start MongoDB

# Start MongoDB service (macOS/Linux)
sudo systemctl start mongod
# OR
mongod --dbpath /path/to/your/data/directory
```

### Option B: MongoDB Cloud (Atlas)
- Ensure your connection string is configured in `application.properties`
- No local setup needed

---

## 🔧 2. Start Backend (Spring Boot API)

### Navigate to Backend Directory
```bash
cd f:\Interavtive_Resume\Interactive-Resume-Maker\BackEnd
```

### Option A: Using Maven
```bash
# Clean and compile
mvn clean compile

# Run the application
mvn spring-boot:run
```

### Option B: Using JAR file
```bash
# Build JAR (if not already built)
mvn clean package -DskipTests

# Run the JAR
java -jar target/resume-forest-1.0.0.jar
```

### ✅ Backend Running Confirmation
- Backend will start on: **http://localhost:8080**
- Look for: `Started ResumeForestApplication in X.XXX seconds`
- Test API: http://localhost:8080/api/users/me

---

## 🌐 3. Start Frontend (Login System)

### Navigate to Login Directory
```bash
cd f:\Interavtive_Resume\Interactive-Resume-Maker\FrontEnd\Login
```

### Option A: Simple HTTP Server (Python)
```bash
# Python 3
python -m http.server 3000

# Python 2
python -m SimpleHTTPServer 3000
```

### Option B: Node.js HTTP Server
```bash
# Install http-server globally (one time)
npm install -g http-server

# Start server
http-server -p 3000
```

### Option C: Live Server (VS Code Extension)
- Install "Live Server" extension in VS Code
- Right-click on `Login_Page.html`
- Select "Open with Live Server"

### ✅ Frontend Running Confirmation
- Login system accessible at: **http://localhost:3000**
- Test: Open http://localhost:3000/Login_Page.html

---

## 🌲 4. Start 3D Forest Scene (Webpack Dev Server)

### Navigate to Forest Drive Directory
```bash
cd f:\Interavtive_Resume\Interactive-Resume-Maker\FrontEnd\Forest_Drive
```

### Install Dependencies (First Time Only)
```bash
npm install
```

### Start Development Server
```bash
npm start
# OR
npx webpack serve --mode development
```

### ✅ 3D Scene Running Confirmation
- 3D Forest scene accessible at: **http://localhost:8081**
- Look for: `webpack compiled successfully`
- Test: Open http://localhost:8081

---

## 🔗 5. Complete System Integration Test

### Full System URLs
1. **Backend API**: http://localhost:8080
2. **Login Frontend**: http://localhost:3000
3. **3D Forest Scene**: http://localhost:8081
4. **MongoDB Test**: http://localhost:3000/mongodb-integration-test.html

### Test Flow
1. Open **Login**: http://localhost:3000/Login_Page.html
2. Register/Login with credentials
3. Access **Dashboard**: http://localhost:3000/dashboard.html
4. Click "View 3D Resume" → redirects to Forest Drive
5. **Edit resume** sections in 3D scene
6. **Verify data** persists in MongoDB

---

## 🛠️ 6. Troubleshooting Commands

### Check Ports
```bash
# Windows
netstat -an | findstr :8080
netstat -an | findstr :3000
netstat -an | findstr :8081

# macOS/Linux
lsof -i :8080
lsof -i :3000
lsof -i :8081
```

### Kill Process on Port
```bash
# Windows
taskkill /F /PID <PID_NUMBER>

# macOS/Linux
kill -9 <PID_NUMBER>
```

### Backend Logs
```bash
# Check application logs
tail -f BackEnd/logs/resumeforest-debug.log
```

### MongoDB Connection Test
```bash
# Connect to MongoDB
mongo
# OR for newer versions
mongosh

# List databases
show dbs

# Use resume database
use resumeforest

# List collections
show collections

# Find all users
db.users.find()

# Find all resumes
db.resumes.find()
```

---

## 🚨 Common Issues & Solutions

### Port Already in Use
```bash
# Change ports in configuration files:
# Backend: BackEnd/src/main/resources/application.properties
# Frontend: FrontEnd/Forest_Drive/webpack.config.js
```

### CORS Issues
- Ensure backend CORS is configured for frontend URLs
- Check `@CrossOrigin` annotations in controllers

### MongoDB Connection Failed
- Verify MongoDB is running
- Check connection string in `application.properties`
- Ensure database user has proper permissions

### JWT Authentication Issues
- Clear browser localStorage
- Re-login to get fresh token
- Check token expiration in backend logs

---

## 📊 System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   Frontend      │    │   Backend API    │    │     Database        │
│  (Port 3000)    │────│  (Port 8080)     │────│    MongoDB          │
│                 │    │                  │    │                     │
│ • Login System  │    │ • JWT Auth       │    │ • Users Collection  │
│ • Dashboard     │    │ • Resume CRUD    │    │ • Resume Collection │
│ • User Profile  │    │ • User Management│    │                     │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
         │
         │
         ▼
┌─────────────────────────────────────────────┐
│         3D Forest Scene                     │
│        (Port 8081)                          │
│                                             │
│ • Interactive 3D Environment               │
│ • Resume Content Display                   │
│ • Real-time Editing                        │
│ • MongoDB Integration                      │
└─────────────────────────────────────────────┘
```

---

## 🎯 Development Workflow

1. **Start Backend First** (Port 8080)
2. **Start Login Frontend** (Port 3000)  
3. **Start 3D Scene** (Port 8081)
4. **Test Complete Flow**
5. **Monitor Logs** for issues

## 📝 Environment Variables (Optional)

Create `.env` files for configuration:

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/resumeforest
JWT_SECRET=your-secret-key-here
SERVER_PORT=8080
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8080
REACT_APP_FRONTEND_URL=http://localhost:3000
```

Happy coding! 🎉
