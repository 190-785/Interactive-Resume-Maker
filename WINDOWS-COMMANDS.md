# Windows PowerShell Commands for Interactive Resume Maker Fix

## Current Issue
You're in the BackEnd directory, but the frontend files are in FrontEnd/Forest_Drive.

## Correct Windows PowerShell Commands

### Navigate to the correct directory and fix frontend:
```powershell
# Navigate to frontend directory
cd ..\FrontEnd\Forest_Drive

# Remove directories (Windows PowerShell syntax)
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue  
Remove-Item -Recurse -Force .webpack -ErrorAction SilentlyContinue

# Alternative shorter syntax:
rmdir /s /q node_modules 2>nul
rmdir /s /q dist 2>nul
rmdir /s /q .webpack 2>nul

# Install dependencies
npm install

# Install missing Babel runtime
npm install @babel/runtime --save
npm install @babel/plugin-transform-runtime --save-dev

# Install additional dependencies
npm install --save-dev @babel/core @babel/preset-env babel-loader
npm install --save core-js regenerator-runtime

# Build and start
npm run build
npm run dev
```

### Restart backend (in new PowerShell window):
```powershell
# Navigate to backend directory
cd F:\Interavtive_Resume\Interactive-Resume-Maker\BackEnd

# Stop current backend (Ctrl+C if running)
# Then start fresh:
mvn spring-boot:run
```

## Quick Copy-Paste Commands

Run these commands one by one in PowerShell:

```powershell
# 1. Navigate to frontend
cd ..\FrontEnd\Forest_Drive

# 2. Clear caches (use cmd syntax for reliability)
cmd /c "rmdir /s /q node_modules 2>nul"
cmd /c "rmdir /s /q dist 2>nul"  
cmd /c "rmdir /s /q .webpack 2>nul"

# 3. Fresh install
npm install
npm install @babel/runtime --save
npm install @babel/plugin-transform-runtime --save-dev

# 4. Start frontend
npm run dev
```

## Alternative: Use the Windows Batch Script

Instead of manual commands, run the automated fix:
```powershell
# From project root
cd F:\Interavtive_Resume\Interactive-Resume-Maker
.\comprehensive-fix.bat
```

## Expected Directory Structure

Make sure you're in the right location:
```
F:\Interavtive_Resume\Interactive-Resume-Maker\
├── BackEnd\                 ← Backend (Spring Boot)
├── FrontEnd\
│   ├── Forest_Drive\        ← 3D Scene (needs npm install)
│   └── Login\               ← Login pages
└── [other files]
```

The node_modules folder should be in `FrontEnd\Forest_Drive\`, not in `BackEnd\`.
