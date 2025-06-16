# 🚀 Quick Start Commands - Interactive Resume Maker

## 📋 Manual Step-by-Step Commands

### 1. Start Backend (Terminal/CMD 1)
```bash
cd f:\Interavtive_Resume\Interactive-Resume-Maker\BackEnd
mvn spring-boot:run
```
**Wait for**: `Started ResumeForestApplication` message
**URL**: http://localhost:8080

---

### 2. Start Login Frontend (Terminal/CMD 2)
```bash
cd f:\Interavtive_Resume\Interactive-Resume-Maker\FrontEnd\Login
python -m http.server 3000
```
**URL**: http://localhost:3000

---

### 3. Start 3D Forest Scene (Terminal/CMD 3)
```bash
cd f:\Interavtive_Resume\Interactive-Resume-Maker\FrontEnd\Forest_Drive
npm install
npm start
```
**URL**: http://localhost:8081

---

## 🎯 Test URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Login Page** | http://localhost:3000/Login_Page.html | User authentication |
| **Dashboard** | http://localhost:3000/dashboard.html | Main user dashboard |
| **3D Resume** | http://localhost:8081 | Interactive 3D experience |
| **API Test** | http://localhost:8080/api/users/me | Backend API check |
| **MongoDB Test** | file:///f:/Interavtive_Resume/Interactive-Resume-Maker/mongodb-integration-test.html | Database integration test |

---

## ⚡ One-Line Starters

### Windows PowerShell (All in one command)
```powershell
Start-Process cmd -ArgumentList "/k", "cd /d f:\Interavtive_Resume\Interactive-Resume-Maker\BackEnd && mvn spring-boot:run" ; Start-Sleep 5 ; Start-Process cmd -ArgumentList "/k", "cd /d f:\Interavtive_Resume\Interactive-Resume-Maker\FrontEnd\Login && python -m http.server 3000" ; Start-Sleep 3 ; Start-Process cmd -ArgumentList "/k", "cd /d f:\Interavtive_Resume\Interactive-Resume-Maker\FrontEnd\Forest_Drive && npm start"
```

### Linux/macOS (Background processes)
```bash
cd f:/Interavtive_Resume/Interactive-Resume-Maker/BackEnd && mvn spring-boot:run & cd ../FrontEnd/Login && python3 -m http.server 3000 & cd ../Forest_Drive && npm start &
```

---

## 🔧 Alternative Methods

### Backend Alternatives
```bash
# Method 1: Maven
mvn spring-boot:run

# Method 2: JAR file
mvn clean package -DskipTests
java -jar target/resume-forest-1.0.0.jar

# Method 3: IDE
# Open BackEnd folder in IntelliJ/Eclipse and run main class
```

### Frontend Alternatives
```bash
# Method 1: Python HTTP Server
python -m http.server 3000

# Method 2: Node.js HTTP Server
npx http-server -p 3000

# Method 3: VS Code Live Server
# Install Live Server extension, right-click HTML file, "Open with Live Server"
```

### 3D Scene Alternatives
```bash
# Method 1: NPM Start
npm start

# Method 2: Webpack directly
npx webpack serve --mode development

# Method 3: Manual build + serve
npm run build
npx http-server dist -p 8081
```

---

## 🛑 Stop Services

### Windows
```cmd
# Find and kill processes
tasklist | findstr "java"
tasklist | findstr "python"
tasklist | findstr "node"

# Kill by PID
taskkill /F /PID <PID_NUMBER>

# Kill by port
netstat -ano | findstr :8080
netstat -ano | findstr :3000
netstat -ano | findstr :8081
```

### Linux/macOS
```bash
# Kill by port
sudo lsof -ti:8080 | xargs kill -9
sudo lsof -ti:3000 | xargs kill -9
sudo lsof -ti:8081 | xargs kill -9

# Kill by process name
pkill -f "spring-boot"
pkill -f "http.server"
pkill -f "webpack"
```

---

## 🧪 Verification Steps

1. **Backend Health Check**
   ```bash
   curl http://localhost:8080/api/users/me
   # Should return 401 (needs auth) or user data
   ```

2. **Frontend Accessibility**
   ```bash
   curl http://localhost:3000
   # Should return HTML content
   ```

3. **3D Scene Loading**
   ```bash
   curl http://localhost:8081
   # Should return HTML with 3D scene
   ```

4. **End-to-End Test**
   - Visit: http://localhost:3000/Login_Page.html
   - Register/Login
   - Go to Dashboard
   - Click "View 3D Resume"
   - Edit resume sections
   - Verify changes persist

---

## 📱 Development Tips

- **Use separate terminals** for each service to monitor logs
- **Check browser console** for JavaScript errors
- **Monitor backend logs** for API errors
- **Use MongoDB Compass** to verify database changes
- **Clear browser cache** if experiencing issues

---

## 🚨 Emergency Reset

If something goes wrong:

```bash
# 1. Kill all processes
# Windows: Ctrl+C in all terminals
# Linux/macOS: pkill -f "java|python|node"

# 2. Clear browser data
# Clear localStorage, cookies, cache

# 3. Restart services one by one
# Follow the manual steps above

# 4. Check logs for errors
# Backend: BackEnd/logs/
# Frontend: Browser console (F12)
# 3D Scene: Terminal output
```
