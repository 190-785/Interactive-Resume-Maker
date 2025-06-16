# 🚀 Interactive Resume Maker - Startup Commands

## Complete System Startup (Recommended)

### Windows
```batch
# Navigate to project root
cd "f:\Interavtive_Resume\Interactive-Resume-Maker"

# Run the automated startup script
start-all-windows.bat
```

### Unix/Linux/Mac
```bash
# Navigate to project root
cd "/f/Interavtive_Resume/Interactive-Resume-Maker"

# Make script executable
chmod +x start-all-unix.sh

# Run the automated startup script
./start-all-unix.sh
```

---

## Manual Startup (Step by Step)

### 1. Start MongoDB (Required)
```bash
# Make sure MongoDB is running on localhost:27017
mongod
```

### 2. Start Backend Server (Spring Boot) - Port 8080
```bash
# Navigate to backend directory
cd BackEnd

# Start using Maven
mvn spring-boot:run

# Alternative: Using java -jar (if you have built the jar)
# java -jar target/resume-forest-1.0.0.jar
```

### 3. Start 3D Forest Scene Server (Webpack Dev Server) - Port 3000
```bash
# Navigate to Forest Drive directory
cd FrontEnd/Forest_Drive

# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Alternative: Using webpack directly
# npx webpack serve --config webpack.config.js
```

### 4. Open Login Page
```
# Open in browser:
file:///f:/Interavtive_Resume/Interactive-Resume-Maker/FrontEnd/Login/Login_Page.html
```

---

## Quick Commands Reference

### Backend Commands
```bash
# Build only
mvn clean compile

# Run tests
mvn test

# Build JAR file
mvn clean package

# Run with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Frontend Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Clean build
rm -rf dist/ && npm run build
```

### Scene Server Commands
```bash
# Start with hot reload
npm run dev

# Start without opening browser
npm run dev -- --open false

# Start on different port
npm run dev -- --port 3001
```

---

## Service URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Login Page** | `file:///[path]/FrontEnd/Login/Login_Page.html` | User authentication |
| **Dashboard** | `file:///[path]/FrontEnd/Login/dashboard.html` | User dashboard |
| **3D Forest Scene** | `http://localhost:3000` | Interactive resume experience |
| **Backend API** | `http://localhost:8080/api` | REST API endpoints |
| **MongoDB Test** | `file:///[path]/mongodb-integration-test.html` | Database integration testing |

---

## Port Configuration

| Port | Service | Configuration File |
|------|---------|-------------------|
| **8080** | Backend (Spring Boot) | `BackEnd/src/main/resources/application.properties` |
| **3000** | 3D Scene (Webpack) | `FrontEnd/Forest_Drive/webpack.config.js` |
| **27017** | MongoDB | MongoDB configuration |

---

## Troubleshooting

### Common Issues

#### 1. "LoginBridge is not a constructor"
```bash
# Fix: Ensure webpack copies the loginBridge.js file
cd FrontEnd/Forest_Drive
npm run build
npm run dev
```

#### 2. "Failed to load resource: 404 Not Found"
```bash
# Fix: Clear webpack cache and rebuild
cd FrontEnd/Forest_Drive
rm -rf dist/
rm -rf node_modules/.cache/
npm run dev
```

#### 3. "Port already in use"
```bash
# Windows: Kill process using port
netstat -ano | findstr :8080
taskkill /PID [PID] /F

# Unix/Linux/Mac: Kill process using port
lsof -ti:8080 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

#### 4. "MongoDB connection failed"
```bash
# Start MongoDB service
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

#### 5. Maven/Java Issues
```bash
# Check Java version (needs 11+)
java -version

# Check Maven version
mvn -version

# Clean Maven cache
mvn clean install -U
```

#### 6. Node.js/npm Issues
```bash
# Check Node.js version (needs 14+)
node --version

# Check npm version
npm --version

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules/
npm install
```

---

## Development Workflow

### Typical Development Session
1. **Start all services** using startup script
2. **Open login page** and authenticate
3. **Access dashboard** and launch Forest Drive
4. **Edit resume** in 3D environment
5. **Verify changes** are saved to MongoDB
6. **Test different browsers** for compatibility

### Making Changes
- **Backend changes**: Restart Spring Boot server
- **Frontend changes**: Webpack hot reload (automatic)
- **Database changes**: Restart MongoDB if needed

### Testing
- **Unit tests**: `mvn test` (backend)
- **Integration tests**: Use `mongodb-integration-test.html`
- **Manual testing**: Follow complete user flow

---

## Quick Start Checklist

- [ ] MongoDB is running on port 27017
- [ ] Java 11+ is installed
- [ ] Maven is installed
- [ ] Node.js 14+ is installed
- [ ] npm is installed
- [ ] All dependencies are installed (`npm install`)
- [ ] Backend starts successfully on port 8080
- [ ] Frontend starts successfully on port 3000
- [ ] Login page opens in browser
- [ ] User can authenticate and access dashboard
- [ ] 3D scene loads without errors
- [ ] Edit functionality works and saves to MongoDB

---

## Support

### Log Files
- **Backend logs**: Console output from Maven
- **Frontend logs**: Browser developer console
- **MongoDB logs**: MongoDB log files

### Debug URLs
- **Backend health**: `http://localhost:8080/actuator/health`
- **API endpoints**: `http://localhost:8080/api/*`
- **Webpack bundle**: `http://localhost:3000/bundle.js`

### Contact
For issues or questions, check the project documentation or create an issue in the repository.
