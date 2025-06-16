@echo off
echo Starting 3D Forest Resume Server...
echo Please wait while we prepare your interactive environment...

REM Change to the correct directory (project root)
cd /d "F:\Interavtive_Resume\Interactive-Resume-Maker"

REM Start webpack devServer for development
echo Starting webpack development server...
npx webpack serve --config FrontEnd/Forest_Drive/webpack.config.js --mode development --open

echo.
echo 3D Forest Resume Server is now running!
echo You can access it at: http://localhost:8080
echo.
echo Press any key to stop the server...
pause > nul
