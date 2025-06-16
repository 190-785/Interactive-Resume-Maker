@echo off
echo ========================================
echo  Interactive Resume Maker - Windows Startup
echo ========================================
echo.

echo [1/4] Checking prerequisites...
where java >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Java not found. Please install Java 11+
    pause
    exit /b 1
)

where mvn >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Maven not found. Please install Maven 3.6+
    pause
    exit /b 1
)

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not found. Please install Node.js 16+
    pause
    exit /b 1
)

echo Prerequisites OK!
echo.

echo [2/4] Starting Backend (Spring Boot)...
echo Opening new window for Backend...
start "Backend Server" cmd /k "cd /d f:\Interavtive_Resume\Interactive-Resume-Maker\BackEnd && echo Starting Backend on port 8080... && mvn spring-boot:run"

echo Waiting for backend to start...
timeout /t 10 /nobreak >nul

echo [3/4] Starting Login Frontend...
echo Opening new window for Frontend...
start "Frontend Server" cmd /k "cd /d f:\Interavtive_Resume\Interactive-Resume-Maker\FrontEnd\Login && echo Starting Frontend on port 3000... && python -m http.server 3000"

echo Waiting for frontend to start...
timeout /t 5 /nobreak >nul

echo [4/4] Starting 3D Forest Scene...
echo Opening new window for 3D Scene...
start "3D Scene Server" cmd /k "cd /d f:\Interavtive_Resume\Interactive-Resume-Maker\FrontEnd\Forest_Drive && echo Installing dependencies if needed... && npm install && echo Starting 3D Scene on port 8081... && npm start"

echo.
echo ========================================
echo  All services are starting up!
echo ========================================
echo.
echo Backend API:      http://localhost:8080
echo Login Frontend:   http://localhost:3000
echo 3D Forest Scene:  http://localhost:8081
echo.
echo Opening test URLs in browser...
timeout /t 10 /nobreak >nul

start http://localhost:3000/Login_Page.html
timeout /t 3 /nobreak >nul
start http://localhost:8081

echo.
echo Services started! Check the opened windows for status.
echo Press any key to close this window...
pause >nul
