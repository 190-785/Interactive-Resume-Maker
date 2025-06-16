@echo off
title Forest Drive 3D Resume - Quick Setup
color 0A

echo ================================================================
echo            🌲 FOREST DRIVE 3D RESUME - QUICK START 🌲
echo ================================================================
echo.

REM Change to project root
cd /d "F:\Interavtive_Resume\Interactive-Resume-Maker"

echo 📁 Current directory: %CD%
echo.

echo 📦 Installing dependencies (if needed)...
if not exist "node_modules" (
    echo Installing root dependencies...
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo ❌ Failed to install root dependencies
        echo Please install Node.js from https://nodejs.org/
        pause
        exit /b 1
    )
)

echo.
echo 📦 Installing Forest Drive dependencies...
cd FrontEnd\Forest_Drive
if not exist "node_modules" (
    echo Installing Forest Drive dependencies...
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo ❌ Failed to install Forest Drive dependencies
        pause
        exit /b 1
    )
)

echo.
echo ✅ Dependencies ready!
echo.

echo 🚀 Starting the webpack development server...
echo.
echo ⚠️  IMPORTANT INSTRUCTIONS:
echo 1. Keep this window OPEN while using the 3D resume
echo 2. Your 3D resume will be available at: http://localhost:3000
echo 3. Dashboard will be available at: file:///F:/Interavtive_Resume/Interactive-Resume-Maker/FrontEnd/Login/dashboard.html
echo 4. Press Ctrl+C to stop the server when done
echo.

REM Start webpack dev server with explicit configuration
echo Starting webpack development server...
npx webpack serve --config webpack.config.js --mode development --port 3000 --open

echo.
echo 🔻 Server stopped. Press any key to exit...
pause > nul
