@echo off
title Forest Drive 3D Resume - Server Manager
color 0A

echo ================================================================
echo            🌲 FOREST DRIVE 3D RESUME - SERVER MANAGER 🌲
echo ================================================================
echo.
echo This window will manage your 3D Resume servers automatically.
echo Keep this window open while using the application.
echo.
echo 📍 Dashboard: http://localhost:3000
echo 🌲 3D Scene: http://localhost:8080 (auto-managed)
echo.

REM Change to project directory
cd /d "F:\Interavtive_Resume\Interactive-Resume-Maker"

REM Start the Forest Drive manager (which will auto-start webpack)
echo 🚀 Starting Forest Drive Manager...
echo.

node FrontEnd/Forest_Drive/forest-drive-manager.js

echo.
echo 🔻 Forest Drive Manager stopped.
echo Press any key to restart or close to exit...
pause > nul
goto :eof
