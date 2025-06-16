# 🌲 Forest Drive 3D Resume - Super Simple Setup

## 🚀 One-Time Setup (Just Do This Once!)

### Step 1: Install Dependencies
```bash
npm install
cd FrontEnd/Forest_Drive
npm install
cd ../..
```

### Step 2: Start the Manager
Double-click: `start-forest-drive.bat`

**That's it!** 🎉

## 📱 How to Use

1. **Keep the server window open** (it manages everything automatically)
2. **Open your browser** to: http://localhost:3000
3. **Use the dashboard** - click Edit/Create/Preview buttons normally
4. **Servers start automatically** - no manual work needed!

## 🎯 What Happens When You Click a Button

1. Click "Edit My Resume" (or Create/Preview)
2. System automatically checks if 3D server is running
3. If not running, it starts automatically
4. You're redirected to the 3D scene
5. Everything just works! ✨

## 🖥️ Server URLs

- **Dashboard**: http://localhost:3000 (main interface)
- **3D Scene**: http://localhost:8080 (auto-managed)
- **Manager**: The batch file window (keep open)

## 🔧 Troubleshooting

### "npm not found"
- Install Node.js from https://nodejs.org/

### "Port already in use"
- Close other applications using ports 3000 or 8080
- Or restart your computer

### "Cannot start server"
- Run the batch file as Administrator
- Check antivirus settings

## 🌟 Key Features

- ✅ **Automatic server management** - no manual commands
- ✅ **Auto-restart on crash** - servers stay alive
- ✅ **One-click access** - dashboard buttons just work
- ✅ **No technical knowledge required** - user-friendly
- ✅ **Seamless experience** - everything automated

## 📂 Important Files

- `start-forest-drive.bat` - Main startup script (run this!)
- `FrontEnd/Forest_Drive/forest-drive-manager.js` - Server manager
- `FrontEnd/Login/dashboard.html` - User dashboard
- `package.json` - Dependencies

## 🚨 Remember

**Always keep the server window open while using the 3D resume!**

The black window that opens when you double-click `start-forest-drive.bat` is managing your servers. If you close it, the 3D scene won't work.

---

🌲 **Enjoy your Interactive Forest Resume!** 🌲

Need help? Check the setup guide at: http://localhost:3000/../Forest_Drive/setup-guide.html
