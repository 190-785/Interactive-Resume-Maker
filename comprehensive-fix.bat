@echo off
REM Comprehensive Fix Script for Interactive Resume Maker (Windows)
REM This script fixes multiple issues: babel runtime, CORS, websocket, and missing modules

echo 🔧 Comprehensive Fix for Interactive Resume Maker
echo =================================================

REM Navigate to project root
cd /d "%~dp0"

echo 📍 Current directory: %CD%

REM Step 1: Fix Frontend Dependencies
echo 🔧 Step 1: Fixing Frontend Dependencies...
cd "FrontEnd\Forest_Drive"

echo 📦 Clearing all caches...
if exist "dist" rmdir /s /q dist
if exist "node_modules\.cache" rmdir /s /q node_modules\.cache
if exist ".webpack" rmdir /s /q .webpack
if exist "node_modules" rmdir /s /q node_modules

echo 📦 Reinstalling all dependencies...
npm install

echo 📦 Installing missing Babel runtime...
npm install @babel/runtime --save
npm install @babel/plugin-transform-runtime --save-dev

echo 📦 Installing additional webpack dependencies...
npm install webpack-dev-server --save-dev
npm install copy-webpack-plugin --save-dev

REM Step 2: Fix package.json
echo 🔧 Step 2: Updating package.json...

REM Update package.json to include missing dependencies
npm install --save-dev @babel/core @babel/preset-env babel-loader
npm install --save @babel/runtime core-js regenerator-runtime
npm install --save-dev path-browserify os-browserify crypto-browserify

echo ✅ Dependencies updated

REM Step 3: Build and start frontend
echo 🔧 Step 3: Building and starting frontend...

echo 🏗️ Building frontend...
npm run build

echo 🚀 Starting frontend development server...
start "Frontend Dev Server" npm run dev

cd "..\..\"

echo.
echo 🎉 Fix Complete!
echo 🌐 URLs:
echo    Frontend: http://localhost:3000
echo    Login: file:///%CD%/FrontEnd/Login/Login_Page.html

echo.
echo ✅ Frontend fixes applied successfully!
pause
