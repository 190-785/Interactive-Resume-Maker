#!/bin/bash

echo "========================================"
echo " Interactive Resume Maker - Linux/macOS Startup"
echo "========================================"
echo ""

echo "[1/4] Checking prerequisites..."

# Check Java
if ! command -v java &> /dev/null; then
    echo "ERROR: Java not found. Please install Java 11+"
    exit 1
fi

# Check Maven
if ! command -v mvn &> /dev/null; then
    echo "ERROR: Maven not found. Please install Maven 3.6+"
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js not found. Please install Node.js 16+"
    exit 1
fi

echo "Prerequisites OK!"
echo ""

# Base directory
BASE_DIR="/f/Interavtive_Resume/Interactive-Resume-Maker"

echo "[2/4] Starting Backend (Spring Boot)..."
cd "$BASE_DIR/BackEnd"
echo "Starting Backend on port 8080..."
gnome-terminal --title="Backend Server" -- bash -c "mvn spring-boot:run; exec bash" &
# For macOS use: osascript -e 'tell app "Terminal" to do script "cd '$BASE_DIR/BackEnd' && mvn spring-boot:run"' &

echo "Waiting for backend to start..."
sleep 10

echo "[3/4] Starting Login Frontend..."
cd "$BASE_DIR/FrontEnd/Login"
echo "Starting Frontend on port 3000..."
gnome-terminal --title="Frontend Server" -- bash -c "python3 -m http.server 3000; exec bash" &
# For macOS use: osascript -e 'tell app "Terminal" to do script "cd '$BASE_DIR/FrontEnd/Login' && python3 -m http.server 3000"' &

echo "Waiting for frontend to start..."
sleep 5

echo "[4/4] Starting 3D Forest Scene..."
cd "$BASE_DIR/FrontEnd/Forest_Drive"
echo "Installing dependencies if needed..."
npm install
echo "Starting 3D Scene on port 8081..."
gnome-terminal --title="3D Scene Server" -- bash -c "npm start; exec bash" &
# For macOS use: osascript -e 'tell app "Terminal" to do script "cd '$BASE_DIR/FrontEnd/Forest_Drive' && npm start"' &

echo ""
echo "========================================"
echo " All services are starting up!"
echo "========================================"
echo ""
echo "Backend API:      http://localhost:8080"
echo "Login Frontend:   http://localhost:3000"
echo "3D Forest Scene:  http://localhost:8081"
echo ""
echo "Opening test URLs in browser..."
sleep 10

# Open URLs in default browser
if command -v xdg-open &> /dev/null; then
    xdg-open "http://localhost:3000/Login_Page.html"
    sleep 3
    xdg-open "http://localhost:8081"
elif command -v open &> /dev/null; then
    open "http://localhost:3000/Login_Page.html"
    sleep 3
    open "http://localhost:8081"
fi

echo ""
echo "Services started! Check the opened terminal windows for status."
echo "Press Ctrl+C to stop this script (services will continue running)"

# Keep script alive
while true; do
    sleep 1
done
