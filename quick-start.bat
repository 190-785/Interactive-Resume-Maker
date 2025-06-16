@echo off
REM Quick startup commands for Interactive Resume Maker
REM Copy and paste these commands in your command prompt

echo 🚀 Quick Start Commands for Interactive Resume Maker
echo =====================================================

REM Option 1: Automated Startup
echo.
echo OPTION 1: Automated Startup (Recommended)
echo ===========================================
echo cd "f:\Interavtive_Resume\Interactive-Resume-Maker"
echo start-all-windows.bat

REM Option 2: Manual Startup
echo.
echo OPTION 2: Manual Startup
echo =========================

echo.
echo 1. Start Backend (Terminal 1):
echo cd "f:\Interavtive_Resume\Interactive-Resume-Maker\BackEnd"
echo mvn spring-boot:run

echo.
echo 2. Start 3D Scene (Terminal 2):
echo cd "f:\Interavtive_Resume\Interactive-Resume-Maker\FrontEnd\Forest_Drive"
echo npm install    REM First time only
echo npm run dev

echo.
echo 3. Open Login Page:
echo start "" "file:///f:/Interavtive_Resume/Interactive-Resume-Maker/FrontEnd/Login/Login_Page.html"

echo.
echo 🌐 Service URLs:
echo ================
echo Login:     file:///f:/Interavtive_Resume/Interactive-Resume-Maker/FrontEnd/Login/Login_Page.html
echo 3D Scene:  http://localhost:3000
echo Backend:   http://localhost:8080
echo Test Page: file:///f:/Interavtive_Resume/Interactive-Resume-Maker/mongodb-integration-test.html

echo.
echo 🔧 Troubleshooting:
echo ==================
echo Clear webpack cache:
echo cd "f:\Interavtive_Resume\Interactive-Resume-Maker\FrontEnd\Forest_Drive"
echo rmdir /s /q dist
echo rmdir /s /q node_modules\.cache
echo npm run dev

echo.
echo Kill processes on ports:
echo netstat -ano ^| findstr :8080
echo taskkill /PID [PID] /F
echo netstat -ano ^| findstr :3000  
echo taskkill /PID [PID] /F

pause
