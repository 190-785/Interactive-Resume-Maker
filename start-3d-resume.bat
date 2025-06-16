@echo off
title Forest Drive 3D Resume Server
color 0A

echo ================================================================
echo            🌲 FOREST DRIVE 3D RESUME SERVER 🌲
echo ================================================================
echo.
echo This will start your 3D Forest Resume server
echo Keep this window open while using the application
echo.

cd /d "F:\Interavtive_Resume\Interactive-Resume-Maker"

echo 🚀 Starting webpack development server...
echo.
echo 📱 Once started, your 3D resume will be available at:
echo    http://localhost:3000
echo.
echo 🎮 Dashboard available at:
echo    file:///F:/Interavtive_Resume/Interactive-Resume-Maker/FrontEnd/Login/dashboard.html
echo.
echo ⚠️  Keep this window OPEN while using the application
echo ⚠️  Press Ctrl+C to stop the server
echo.

REM Start webpack directly with the correct config
npx webpack serve --config FrontEnd/Forest_Drive/webpack.config.js --mode development --port 3000 --open

echo.
echo 🔻 Server stopped. Press any key to exit...
pause > nul
