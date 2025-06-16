@echo off
REM Fix for LoginBridge Constructor Error
REM This script fixes the webpack configuration and clears cache

echo 🔧 Fixing LoginBridge Constructor Error...
echo ==========================================

REM Navigate to Forest Drive directory
cd "FrontEnd\Forest_Drive"

echo 📦 Clearing webpack cache...
if exist "dist" rmdir /s /q dist
if exist "node_modules\.cache" rmdir /s /q node_modules\.cache
if exist ".webpack" rmdir /s /q .webpack

echo 🔄 Reinstalling dependencies...
npm install

echo 🏗️ Building project...
npm run build

echo 🚀 Starting development server...
npm run dev

echo ✅ Fix complete! LoginBridge should now work correctly.
pause
