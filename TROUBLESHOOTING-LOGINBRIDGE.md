# 🔧 Troubleshooting Guide - LoginBridge Constructor Error

## Problem Summary
The error `window.LoginBridge is not a constructor` occurs because webpack is not properly serving the `loginBridge.js` file, resulting in 404 errors and MIME type issues.

## Error Messages Encountered
```
- Initialization Error: window.LoginBridge is not a constructor
- Failed to load resource: the server responded with a status of 404 (Not Found)
- Refused to execute script from 'http://localhost:3000/js/loginBridge.js' because its MIME type ('text/html') is not executable
```

## Root Cause
Webpack dev server is not copying the standalone JavaScript files (`loginBridge.js`, `resumeIntegration.js`) to the correct location in the `dist/` folder.

## Solution Steps

### Quick Fix (Recommended)
1. **Run the fix script:**
   ```bash
   # Windows
   fix-loginbridge.bat
   
   # Unix/Linux/Mac
   chmod +x fix-loginbridge.sh
   ./fix-loginbridge.sh
   ```

### Manual Fix
1. **Stop the development server** (Ctrl+C)

2. **Navigate to Forest Drive directory:**
   ```bash
   cd "FrontEnd/Forest_Drive"
   ```

3. **Clear webpack cache:**
   ```bash
   # Windows
   rmdir /s /q dist
   rmdir /s /q node_modules\.cache
   
   # Unix/Linux/Mac
   rm -rf dist/
   rm -rf node_modules/.cache/
   ```

4. **Reinstall dependencies:**
   ```bash
   npm install
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

## Verification Steps

### 1. Check if files are being served correctly
- Open browser to `http://localhost:3000/js/loginBridge.js`
- Should show JavaScript code, not 404 error

### 2. Check browser console
- Open developer tools (F12)
- Look for `window.LoginBridge` in console
- Should be a constructor function, not undefined

### 3. Test the 3D scene
- Navigate to `http://localhost:3000`
- Scene should load without LoginBridge errors
- Login status indicator should appear

## Additional Fixes

### If the problem persists:

1. **Check webpack.config.js:**
   Ensure these patterns are in the CopyWebpackPlugin:
   ```javascript
   {
     from: 'src/js/loginBridge.js',
     to: 'js/loginBridge.js'
   },
   {
     from: 'src/js/resumeIntegration.js',
     to: 'js/resumeIntegration.js'
   }
   ```

2. **Clear browser cache:**
   ```
   Ctrl+Shift+R (hard refresh)
   Or clear browser cache completely
   ```

3. **Check file permissions:**
   ```bash
   # Unix/Linux/Mac
   chmod 644 src/js/loginBridge.js
   chmod 644 src/js/resumeIntegration.js
   ```

4. **Restart with clean build:**
   ```bash
   npm run build
   npm run dev
   ```

## Alternative Solutions

### Option 1: Use ES6 Modules
Instead of loading as standalone script, import as module:
```javascript
// In main.js or wherever needed
import { LoginBridge } from './loginBridge.js';
```

### Option 2: Inline the LoginBridge
Move LoginBridge code directly into main.js or another bundled file.

### Option 3: Use different serving method
Serve files directly from `src/` directory during development.

## Prevention

1. **Always clear cache** when webpack config changes
2. **Test file serving** before testing functionality
3. **Use consistent import patterns** throughout the project
4. **Monitor webpack build output** for missing files

## Complete Startup Sequence (After Fix)

1. **Start Backend:**
   ```bash
   cd BackEnd
   mvn spring-boot:run
   ```

2. **Start Frontend (in new terminal):**
   ```bash
   cd FrontEnd/Forest_Drive
   npm run dev
   ```

3. **Open Login Page:**
   ```
   file:///[path]/FrontEnd/Login/Login_Page.html
   ```

4. **Test 3D Scene:**
   ```
   http://localhost:3000
   ```

## Expected Results After Fix

- ✅ No LoginBridge constructor errors
- ✅ Files served with correct MIME types
- ✅ 3D scene loads successfully
- ✅ Login status indicator works
- ✅ Edit functionality enabled for logged-in users
- ✅ Data saves to MongoDB correctly

## Contact for Further Help

If issues persist after following this guide:
1. Check all prerequisites are installed
2. Verify MongoDB is running
3. Ensure all ports (3000, 8080, 27017) are available
4. Review full error logs for additional clues
5. Test with different browsers
