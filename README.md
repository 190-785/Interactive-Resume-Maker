# 🌟 Interactive Resume Maker

> A comprehensive full-stack web application for creating and managing interactive 3D resumes with a unique forest-themed experience.

## 📋 Project Overview

The Interactive Resume Maker is a modern web application that allows users to create, edit, and showcase their resumes in an immersive 3D forest environment. Built with cutting-edge technologies, it provides a unique and engaging way to present professional information.

### ✨ Key Features

- 🎨 **3D Interactive Interface** - Navigate through a beautiful forest environment
- 🔐 **Secure Authentication** - JWT-based user authentication system  
- 📝 **Real-time Editing** - Auto-save functionality with instant feedback
- 🗄️ **Database Integration** - MongoDB for reliable data storage
- 👤 **User Management** - Registration, login, and profile management
- 🔒 **Data Security** - BCrypt password hashing and user data isolation
- 📱 **Responsive Design** - Works across different devices and browsers

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (Port 3000)   │◄──►│   (Port 8080)   │◄──►│   MongoDB       │
│                 │    │                 │    │   (Port 27017)  │
│ • Three.js      │    │ • Spring Boot   │    │ • User Data     │
│ • JavaScript    │    │ • JWT Auth      │    │ • Resume Data   │
│ • Webpack       │    │ • REST APIs     │    │ • Collections   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 🔧 Technology Stack

#### Backend
- **Framework**: Spring Boot 2.7.5
- **Language**: Java 17
- **Database**: MongoDB
- **Security**: Spring Security + JWT
- **Build Tool**: Maven
- **Authentication**: BCrypt Password Encoding

#### Frontend
- **3D Graphics**: Three.js
- **Language**: JavaScript ES6+
- **Bundler**: Webpack
- **Dev Server**: Webpack Dev Server
- **Styling**: CSS3

#### Database
- **Primary DB**: MongoDB 4.4+
- **Collections**: users, resumes
- **Features**: Document-based storage, flexible schema

## 📁 Project Structure

```
Interactive-Resume-Maker/
├── BackEnd/                          # Spring Boot Backend
│   ├── src/main/java/com/resumeforest/
│   │   ├── controllers/              # REST API Controllers
│   │   ├── models/                   # Data Models (User, Resume)
│   │   ├── services/                 # Business Logic
│   │   ├── repositories/             # Data Access Layer
│   │   ├── security/                 # JWT & Security Config
│   │   └── config/                   # Application Configuration
│   ├── src/main/resources/
│   │   └── application.properties    # App Configuration
│   └── pom.xml                       # Maven Dependencies
├── FrontEnd/
│   ├── Forest_Drive/                 # 3D Resume Interface
│   │   ├── src/
│   │   │   ├── js/                   # JavaScript Modules
│   │   │   ├── css/                  # Stylesheets
│   │   │   ├── assets/               # 3D Models & Textures
│   │   │   └── index.html            # Main Application
│   │   ├── webpack.config.js         # Webpack Configuration
│   │   └── package.json              # Dependencies
│   └── Login/                        # Authentication UI
│       ├── js/                       # Auth Logic
│       ├── css/                      # Auth Styling
│       └── *.html                    # Login/Register Pages
└── README.md                         # This file
```

## 🚀 Quick Start Guide

### 📋 Prerequisites

Before starting, ensure you have the following installed:

- **Java JDK 17** or newer ([Download](https://adoptium.net/))
- **Node.js 16.x** or newer ([Download](https://nodejs.org/))
- **MongoDB 4.4** or newer ([Download](https://www.mongodb.com/try/download/community))
- **Maven 3.6** or newer ([Download](https://maven.apache.org/download.cgi))
- **Git** for version control ([Download](https://git-scm.com/))

### 🔧 System Setup (Step-by-Step)

#### Step 1: Clone the Repository
```powershell
git clone https://github.com/190-785/Interactive-Resume-Maker
cd Interactive-Resume-Maker
```

#### Step 2: Start MongoDB Database
```powershell
# Option 1: Windows Service (if MongoDB installed as service)
net start MongoDB

# Option 2: Manual start
mongod --dbpath="C:\data\db"

# Option 3: Using MongoDB Compass (GUI)
# Open MongoDB Compass and connect to mongodb://localhost:27017
```

**Verify MongoDB is running:**
```powershell
# Check if MongoDB is listening on port 27017
netstat -ano | findstr :27017
```

#### Step 3: Setup and Start Backend (Port 8080)
```powershell
# Navigate to backend directory
cd BackEnd

# Clean and compile the project
mvn clean compile

# Install dependencies and run tests (optional)
mvn test

# Start the Spring Boot application
mvn spring-boot:run

# Alternative: Run using Java directly
# mvn clean package
# java -jar target/resume-forest-1.0.0.jar
```

**Backend will start on:** `http://localhost:8080`

**Verify backend is running:**
```powershell
# Check if backend is listening on port 8080
netstat -ano | findstr :8080

# Test API health
curl http://localhost:8080/api/auth/check-username?username=test
```

#### Step 4: Setup Frontend - Login System (Port 5500)

The login system can be served using Live Server or any static file server:

```powershell
# Navigate to login directory
cd FrontEnd/Login

# Option 1: Using Live Server (VS Code Extension)
# Right-click on Login_Page.html -> "Open with Live Server"

# Option 2: Using Python (if installed)
python -m http.server 5500

# Option 3: Using Node.js http-server
npx http-server -p 5500
```

**Login System will be available at:** `http://localhost:5500/Login_Page.html`

#### Step 5: Setup Frontend - 3D Resume (Port 3000)
```powershell
# Navigate to 3D frontend directory
cd FrontEnd/Forest_Drive

# Install Node.js dependencies
npm install

# Start development server
npm run dev

# Alternative commands:
# npm start
# npx webpack serve
```

**3D Resume Interface will be available at:** `http://localhost:3000`

### 🌐 Application URLs

Once all services are running:

| Service | URL | Purpose |
|---------|-----|---------|
| **Backend API** | `http://localhost:8080` | REST API Server |
| **Login System** | `http://localhost:5500` | User Authentication |
| **3D Resume** | `http://localhost:3000` | Interactive Resume Interface |
| **MongoDB** | `mongodb://localhost:27017` | Database |

## 📖 Complete System Operation Guide

### 🔐 Step-by-Step User Journey

#### Phase 1: System Startup (First Time Setup)

1. **Verify All Services Are Running**
   ```powershell
   # Check if MongoDB is running
   netstat -ano | findstr :27017
   
   # Check if Backend is running
   netstat -ano | findstr :8080
   
   # Check if Frontend is running
   netstat -ano | findstr :3000
   ```

2. **Access the Application**
   - Open your web browser
   - Go to: `http://localhost:5500/Login_Page.html`

#### Phase 2: User Registration (New Users)

1. **Navigate to Registration Page**
   - Click "Sign Up" on the login page
   - Or directly go to: `http://localhost:5500/Register_Page.html`

2. **Fill Registration Form**
   - **Username**: Choose a unique username (4-20 characters)
   - **Email**: Enter a valid email address
   - **Full Name**: Enter your complete name
   - **Password**: Create a strong password (min 6 characters)
   - **Confirm Password**: Re-enter the same password

3. **Complete Registration**
   - Click "Sign Up" button
   - System will validate username and email uniqueness
   - On success, you'll be redirected to login page
   - On error, fix the indicated issues and try again

#### Phase 3: User Authentication (Returning Users)

1. **Access Login Page**
   - Go to: `http://localhost:5500/Login_Page.html`

2. **Enter Credentials**
   - **Username**: Your registered username
   - **Password**: Your account password

3. **Login Process**
   - Click "Sign In" button
   - System validates credentials and generates JWT token
   - On success, redirected to dashboard
   - On failure, check credentials and try again

#### Phase 4: Dashboard Navigation

1. **Dashboard Overview** (`http://localhost:5500/dashboard.html`)
   - View your profile information
   - See resume creation/edit options
   - Access different sections of the application

2. **Dashboard Features**
   - **Profile Management**: Update your personal information
   - **Resume Access**: Quick link to your 3D resume
   - **Settings**: Modify account preferences
   - **Logout**: Securely end your session

#### Phase 5: 3D Resume Experience

1. **Access 3D Resume Interface**
   - From dashboard, click "View/Edit Resume"
   - Or directly navigate to: `http://localhost:3000`
   - **Important**: Must be logged in for full functionality

2. **First-Time 3D Interface**
   - Wait for 3D environment to load (may take 10-15 seconds)
   - You'll see a forest environment with floating resume panels
   - Mouse cursor changes to indicate interactive areas

3. **3D Environment Navigation**
   - **Mouse Movement**: Look around the 3D forest
   - **Mouse Scroll**: Zoom in/out (if enabled)
   - **Click & Drag**: Rotate camera view
   - **Resume Panels**: Floating text panels in the environment

#### Phase 6: Resume Editing Workflow

1. **Viewing Resume Content**
   - Move mouse to look at different resume panels
   - Each panel represents a different resume section:
     - **About Me**: Personal introduction and summary
     - **Skills**: Technical and soft skills
     - **Experience**: Work history and positions
     - **Projects**: Portfolio and project descriptions
     - **Education**: Academic background

2. **Entering Edit Mode**
   - Click on any resume panel to focus on it
   - An "Edit" button will appear on the panel
   - Click "Edit" to enable editing mode
   - Text area will become editable

3. **Editing Content**
   - Click inside the text area
   - Type or modify your content
   - Use standard text editing controls (Ctrl+C, Ctrl+V, etc.)
   - **Auto-save**: Changes are automatically saved every 2 seconds
   - **Visual Feedback**: Saving indicator appears during save

4. **Finishing Edits**
   - Click "Save" button or outside the text area
   - Changes are immediately saved to database
   - Panel returns to display mode
   - Continue editing other sections as needed

#### Phase 7: Advanced Features

1. **Profile Management**
   - Go to: `http://localhost:5500/Profile.html`
   - Update personal information
   - Change password (if feature is enabled)
   - View account statistics

2. **Resume Management**
   - **Default Template**: First-time users get a default template
   - **Personal Data**: All edits are saved per user account
   - **Data Persistence**: Resume data persists across sessions
   - **Real-time Updates**: Changes reflect immediately

3. **Session Management**
   - **Auto-logout**: Sessions expire after 24 hours
   - **Token Renewal**: Login again when session expires
   - **Secure Logout**: Use logout button to end session properly

#### Phase 8: Troubleshooting During Operation

1. **If 3D Environment Doesn't Load**
   - Refresh the page (F5)
   - Check browser console for errors (F12)
   - Ensure you're logged in
   - Verify backend connection (check network tab)

2. **If Edits Don't Save**
   - Check internet connection
   - Verify you're still logged in
   - Look for error messages in browser console
   - Try logging out and back in

3. **If Login Fails**
   - Verify username and password
   - Check if backend server is running
   - Clear browser cache and cookies
   - Try registering a new account if needed

### 🎮 Detailed Controls and Features

#### 3D Environment Controls
- **Mouse Movement**: Free-look camera control
- **Left Click**: Select/interact with resume panels
- **Right Click**: Context menu (if enabled)
- **Scroll Wheel**: Zoom in/out of the environment
- **Keyboard Shortcuts**:
  - **ESC**: Exit edit mode
  - **Enter**: Save changes (in text areas)
  - **Tab**: Navigate between editable fields

#### Resume Panel Interactions
- **Hover Effect**: Panels highlight when mouse hovers over them
- **Click to Focus**: Single click to select a panel
- **Edit Button**: Appears on focused panels
- **Text Areas**: Expandable text input areas
- **Save Indicators**: Visual feedback during save operations

#### User Interface Elements
- **Dashboard Button**: Return to main dashboard
- **Logout Button**: Secure session termination
- **Edit/View Toggle**: Switch between edit and view modes
- **Status Messages**: Real-time feedback on operations
- **Loading Indicators**: Show during data operations

### 🔄 Complete User Workflow Example

Here's a complete example of a typical user session:

1. **Start Session**
   - Open browser → `http://localhost:5500/Login_Page.html`
   - Login with: username=`johndoe`, password=`mypassword`

2. **Navigate to Resume**
   - Dashboard → Click "View Resume" → Redirected to `http://localhost:3000`

3. **Edit About Me Section**
   - Look around 3D environment → Find "About Me" panel
   - Click on panel → Click "Edit" button
   - Type: "I am a passionate software developer with 3 years of experience..."
   - Wait for auto-save confirmation

4. **Edit Skills Section**
   - Navigate to "Skills" panel → Click "Edit"
   - Add skills: "JavaScript: Expert, Python: Intermediate, React: Advanced"
   - Click outside to save

5. **Review Changes**
   - Navigate around to view all updated panels
   - Check that changes are visible in display mode

6. **End Session**
   - Click "Dashboard" button → Return to dashboard
   - Click "Logout" → Secure session termination

### 🎯 Tips for Optimal Experience

1. **Performance Tips**
   - Use Chrome or Firefox for best 3D performance
   - Close unnecessary browser tabs
   - Ensure adequate system memory (4GB+ recommended)

2. **Content Tips**
   - Keep resume sections concise and professional
   - Use bullet points for better readability
   - Preview changes before finalizing

3. **Security Tips**
   - Always logout when using shared computers
   - Don't share your login credentials
   - Use strong, unique passwords

4. **Browser Compatibility**
   - **Best**: Chrome 90+, Firefox 85+, Edge 90+
   - **Good**: Safari 14+
   - **Not Recommended**: Internet Explorer

This comprehensive guide covers every aspect of operating the Interactive Resume Maker system, from initial setup to advanced usage patterns.

## 🔧 Development Setup

### Backend Development
```powershell
cd BackEnd

# Run in development mode with auto-reload
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Dspring.profiles.active=dev"

# Run tests
mvn test

# Package for production
mvn clean package
```

### Frontend Development
```powershell
cd FrontEnd/Forest_Drive

# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

### Database Management
```powershell
# Connect to MongoDB shell
mongosh

# Switch to application database
use resumeforest

# View collections
show collections

# View users
db.users.find().pretty()

# View resumes
db.resumes.find().pretty()
```
   mvn clean install
   ```

3. Run the Spring Boot application:
   ```powershell
   mvn spring-boot:run
   ```
   
   OR

   ```powershell
   java -jar target/resume-forest-1.0.0.jar
   ```

4. The backend API will be available at `http://localhost:8080`

### Frontend - Forest Drive (3D Experience)

1. Navigate to the Forest Drive directory:
   ```powershell
   cd FrontEnd/Forest_Drive
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Start the development server:
   ```powershell
   # Using the provided batch file (recommended)
   .\start-server.bat

   # OR using webpack directly
   npx webpack serve --config webpack.config.js
   ```

   The `start-server.bat` file handles all webpack configuration and starts the development server automatically, making it the simplest way to run the application.

4. Access the 3D Forest Drive experience at `http://localhost:3000` (or the port specified in your configuration)

### Frontend - Login System

1. The login system can be accessed directly by opening the HTML files in a browser:
   - `FrontEnd/Login/Login_Page.html`
   - `FrontEnd/Login/Register_Page.html`
   - `FrontEnd/Login/dashboard.html`
   - `FrontEnd/Login/Profile.html`

2. For local development with backend connectivity:
   - Use a local server like Live Server in VS Code
   - Or set up a simple HTTP server:
     ```powershell
     cd FrontEnd/Login
     npx http-server
     ```

## Running Components Individually

### Running Backend Only

1. Navigate to the `BackEnd` directory
2. Start the Spring Boot application:
   ```powershell
   mvn spring-boot:run
   ```
3. Test the API endpoints using Postman or curl:
   ```powershell
   Invoke-RestMethod -Uri "http://localhost:8080/api/resume" -Method Get
   ```

### Running Forest Drive Frontend Only

1. Navigate to `FrontEnd/Forest_Drive`
2. To run with mock data (without backend):
   - Open `src/js/apiService.js` and set `useMockData` to `true` 
   - This configuration allows the 3D experience to run with sample data without requiring the backend

3. Start the server using the provided batch file (recommended method):
   ```powershell
   .\start-server.bat
   ```
   
   This batch file handles all webpack configuration and starts the development server automatically.

4. Alternatively, you can manually run the webpack dev server:
   ```powershell
   npx webpack serve --config webpack.config.js
   ```

### Running Login System Only

The login system can be run independently by:
1. Opening the HTML files directly in a browser
2. Modify `FrontEnd/Login/js/login.js` to use mock authentication if needed

## Connecting Frontend to Backend

### API Configuration

1. Frontend to Backend connection is configured in:
   - `FrontEnd/Forest_Drive/src/js/apiService.js`
   - `FrontEnd/Login/js/login.js` and other JS files

2. Default API URL is set to `http://localhost:8080`. To change this:
   - Update the `API_BASE_URL` in `FrontEnd/Forest_Drive/src/js/constants.js`
   - Update the API URL variables in the Login system JS files

### Backend to Database Connection

1. MongoDB connection settings are in `BackEnd/src/main/resources/application.properties`
2. Default configuration:
   ```properties
   spring.data.mongodb.host=localhost
   spring.data.mongodb.port=27017
   spring.data.mongodb.database=resumeforest
   ```

## Development Guide

### Modifying the 3D Experience

1. Main scene setup is in `FrontEnd/Forest_Drive/src/js/sceneSetup.js`
2. Resume content rendering is managed in `resumeContent.js`
3. Vehicle controls are defined in `vehicle.js`

### Customizing Resume Data

1. Resume data structure is defined in the backend models
2. To add new resume sections, update both:
   - Backend models in `BackEnd/src/main/java/com/resumeforest/model/`
   - Frontend rendering in `FrontEnd/Forest_Drive/src/js/resumeContent.js`

### Login System Integration

1. Authentication tokens from the login system are used for API authorization
2. Ensure CORS is properly configured in the backend to allow frontend connections

## 🚨 Troubleshooting Guide

### Common Issues and Solutions

#### MongoDB Connection Issues
```powershell
# Issue: Can't connect to MongoDB
# Solution 1: Check if MongoDB service is running
Get-Service -Name "MongoDB"

# Solution 2: Start MongoDB manually
mongod --dbpath="C:\data\db" --port 27017

# Solution 3: Check if port is being used
netstat -ano | findstr :27017
```

#### Backend Startup Issues
```powershell
# Issue: Port 8080 already in use
# Solution: Find and kill process using port 8080
netstat -ano | findstr :8080
taskkill /PID <process_id> /F

# Issue: Java version mismatch
# Solution: Check Java version
java -version
# Should be 17 or higher
```

#### Frontend Issues
```powershell
# Issue: Node.js dependencies issues
# Solution: Clear cache and reinstall
cd FrontEnd/Forest_Drive
rm -rf node_modules
rm package-lock.json
npm cache clean --force
npm install

# Issue: Port 3000 already in use
# Solution: Use different port
npm run dev -- --port 3001
```

#### CORS Issues
```
# Issue: Frontend can't connect to backend
# Solution: Verify CORS configuration in backend
# Check: BackEnd/src/main/java/com/resumeforest/config/CorsConfig.java
# Ensure frontend origins are allowed
```

#### JWT Token Issues
```javascript
// Issue: Token expired or invalid
// Solution: Clear localStorage and login again
localStorage.removeItem('jwtToken');
// Then login again
```

## 🧪 Testing the Application

### Backend API Testing
```powershell
# Test user registration
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123","name":"Test User"}'

# Test user login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# Test protected endpoint (replace TOKEN with actual JWT)
curl -X GET http://localhost:8080/api/resumes/me \
  -H "Authorization: Bearer TOKEN"
```

### Database Verification
```javascript
// Connect to MongoDB shell
mongosh

// Switch to application database
use resumeforest

// Check users collection
db.users.find().pretty()

// Check resumes collection
db.resumes.find().pretty()
```

## 📊 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/api/auth/register` | Register new user | `{username, email, password, name}` |
| POST | `/api/auth/login` | User login | `{username, password}` |
| GET | `/api/auth/user/me` | Get current user info | None (requires JWT) |
| GET | `/api/auth/check-username` | Check username availability | Query param: `username` |
| GET | `/api/auth/check-email` | Check email availability | Query param: `email` |

### Resume Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/api/resumes/me` | Get user's resume | None (requires JWT) |
| POST | `/api/resumes/me` | Create/Update resume | Resume data object |
| GET | `/api/resumes/default-template` | Get default template | None |

### Example API Responses

**Login Success Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "userId": "user123",
  "username": "john_doe",
  "email": "john@example.com",
  "fullName": "John Doe"
}
```

**Resume Data Structure:**
```json
{
  "id": "resume123",
  "userId": "user123",
  "resumeName": "Primary Resume",
  "aboutMe": "Software Developer with 5 years experience...",
  "skills": {
    "JavaScript": "Expert",
    "Java": "Intermediate",
    "MongoDB": "Intermediate"
  },
  "experience": {
    "Company A": "Senior Developer (2020-2023)",
    "Company B": "Junior Developer (2018-2020)"
  },
  "projects": {
    "Project 1": "Description of project 1",
    "Project 2": "Description of project 2"
  },
  "education": {
    "University": "Computer Science Degree"
  }
}
```

## 🔐 Security Features

### Password Security
- **BCrypt Hashing**: Passwords are hashed using BCrypt with salt
- **Strength**: Default cost factor of 10 (2^10 iterations)
- **Storage**: Only hashed passwords stored in database

### JWT Security
- **Algorithm**: HS512 (HMAC with SHA-512)
- **Expiration**: 24 hours (86400000ms)
- **Secret Key**: Base64 encoded secret stored in application.properties
- **Validation**: Every API request validates token signature

### Data Protection
- **User Isolation**: Each user's data completely separated by userId
- **Input Validation**: Server-side validation using Bean Validation
- **CORS Protection**: Configured origins to prevent unauthorized access

## 🚀 Production Deployment

### Environment Variables
```bash
# Backend configuration
SPRING_PROFILES_ACTIVE=prod
MONGODB_URI=mongodb://production-server:27017/resumeforest
JWT_SECRET=your-production-secret-key
JWT_EXPIRATION=86400000

# Security settings
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

### Docker Deployment (Optional)
```dockerfile
# Backend Dockerfile
FROM openjdk:17-jre-slim
COPY target/resume-forest-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

```dockerfile
# Frontend Dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
EXPOSE 80
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👥 Authors

- **Development Team** - Initial work and ongoing development

## 🙏 Acknowledgments

- Three.js community for 3D graphics capabilities
- Spring Boot team for the excellent framework
- MongoDB for flexible data storage
- Open source community for various libraries and tools used

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting Guide](#-troubleshooting-guide)
2. Review the [API Documentation](#-api-documentation)
3. Check application logs in `BackEnd/logs/`
4. Open an issue in the repository

**Happy Resume Building! 🚀**
