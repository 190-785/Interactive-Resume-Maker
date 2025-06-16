# 🔧 Quick Fix Commands for Current Issues

## Issue Analysis
Based on the error logs, here are the main problems:

1. **Babel Runtime Error**: `Cannot find module '@babel/runtime/helpers/asyncToGenerator'`
2. **CORS Error**: Frontend can't access backend API
3. **WebSocket Connection Failed**: Webpack dev server trying wrong WebSocket URL
4. **Missing Dependencies**: Several npm packages not installed

## Quick Fix Commands

### Fix 1: Frontend Dependencies (Run in FrontEnd/Forest_Drive)
```bash
cd "FrontEnd/Forest_Drive"

# Clear all caches
rm -rf dist/ node_modules/.cache/ .webpack/ node_modules/

# Install all dependencies
npm install

# Install missing Babel runtime
npm install @babel/runtime --save
npm install @babel/plugin-transform-runtime --save-dev

# Install additional dependencies
npm install --save-dev @babel/core @babel/preset-env babel-loader
npm install --save core-js regenerator-runtime
npm install --save-dev path-browserify os-browserify crypto-browserify

# Build and start
npm run build
npm run dev
```

### Fix 2: Backend CORS (Already Fixed)
The CORS configuration has been added to the backend. Restart the backend:
```bash
cd BackEnd
# Stop current backend (Ctrl+C)
mvn spring-boot:run
```

### Fix 3: Use Automated Fix Scripts
```bash
# Windows
comprehensive-fix.bat

# Unix/Linux/Mac
chmod +x comprehensive-fix.sh
./comprehensive-fix.sh
```

## Expected Results After Fix

✅ **Frontend should show:**
- No more "Cannot find module '@babel/runtime/helpers/asyncToGenerator'" errors
- No more CORS errors when accessing backend
- 3D scene loads properly
- LoginBridge constructor works

✅ **Backend should show:**
- CORS headers in responses
- Default template endpoint accessible
- MongoDB connection working

## Testing the Fix

1. **Backend Test:**
   ```bash
   curl http://localhost:8080/api/resumes/default-template
   # Should return JSON with default resume data
   ```

2. **Frontend Test:**
   - Open http://localhost:3000
   - Check browser console (F12)
   - Should see no module errors
   - 3D scene should load

3. **CORS Test:**
   - Open browser dev tools → Network tab
   - Refresh frontend page
   - Look for API calls to backend
   - Should see successful responses (200) not CORS errors

## Manual Steps if Scripts Fail

### If comprehensive-fix scripts don't work:

1. **Kill all processes:**
   ```bash
   # Windows
   taskkill /f /im node.exe
   taskkill /f /im java.exe
   
   # Unix/Linux/Mac
   pkill -f "spring-boot:run"
   pkill -f "webpack-dev-server"
   ```

2. **Clean everything:**
   ```bash
   cd FrontEnd/Forest_Drive
   rm -rf node_modules/ dist/ .webpack/
   npm cache clean --force
   ```

3. **Fresh install:**
   ```bash
   npm install
   npm install @babel/runtime core-js regenerator-runtime
   npm install --save-dev @babel/plugin-transform-runtime
   ```

4. **Start services:**
   ```bash
   # Terminal 1: Backend
   cd BackEnd
   mvn clean spring-boot:run
   
   # Terminal 2: Frontend
   cd FrontEnd/Forest_Drive
   npm run dev
   ```

## Troubleshooting

### If still getting errors:

1. **Check Node.js version:**
   ```bash
   node --version  # Should be 14+ 
   npm --version   # Should be 6+
   ```

2. **Check Java version:**
   ```bash
   java -version   # Should be 11+
   mvn -version    # Should be 3.6+
   ```

3. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R
   - Or clear all browser data

4. **Check ports:**
   ```bash
   # Make sure ports are not in use by other apps
   netstat -an | findstr :3000
   netstat -an | findstr :8080
   ```

## Success Indicators

When everything is working correctly, you should see:

✅ Backend log shows: "Started ResumeForestApplication"
✅ Frontend builds without errors
✅ Browser console shows no red errors
✅ 3D scene loads with resume panels
✅ API calls to backend succeed (check Network tab)
✅ Login functionality works
✅ Edit and save operations work

## Next Steps After Fix

1. Test login flow: Login_Page.html → Dashboard → Forest Drive
2. Test edit functionality in 3D scene
3. Verify data saves to MongoDB
4. Test with different browsers

Run the comprehensive-fix script first, then check these indicators!
