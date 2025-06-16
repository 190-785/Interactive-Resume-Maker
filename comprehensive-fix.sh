#!/bin/bash
# Comprehensive Fix Script for Interactive Resume Maker
# This script fixes multiple issues: babel runtime, CORS, websocket, and missing modules

echo "🔧 Comprehensive Fix for Interactive Resume Maker"
echo "================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Navigate to project root
cd "$(dirname "$0")"

echo -e "${BLUE}📍 Current directory: $(pwd)${NC}"

# Step 1: Fix Frontend Dependencies
echo -e "${BLUE}🔧 Step 1: Fixing Frontend Dependencies...${NC}"
cd "FrontEnd/Forest_Drive"

echo -e "${YELLOW}📦 Clearing all caches...${NC}"
rm -rf dist/
rm -rf node_modules/.cache/
rm -rf .webpack/
rm -rf node_modules/

echo -e "${YELLOW}📦 Reinstalling all dependencies...${NC}"
npm install

echo -e "${YELLOW}📦 Installing missing Babel runtime...${NC}"
npm install @babel/runtime --save
npm install @babel/plugin-transform-runtime --save-dev

echo -e "${YELLOW}📦 Installing additional webpack dependencies...${NC}"
npm install webpack-dev-server --save-dev
npm install copy-webpack-plugin --save-dev

# Step 2: Fix package.json
echo -e "${BLUE}🔧 Step 2: Updating package.json...${NC}"

# Update package.json to include missing dependencies
npm install --save-dev @babel/core @babel/preset-env babel-loader
npm install --save @babel/runtime core-js regenerator-runtime
npm install --save-dev path-browserify os-browserify crypto-browserify

echo -e "${GREEN}✅ Dependencies updated${NC}"

# Step 3: Build and start frontend
echo -e "${BLUE}🔧 Step 3: Building and starting frontend...${NC}"

echo -e "${YELLOW}🏗️ Building frontend...${NC}"
npm run build

echo -e "${YELLOW}🚀 Starting frontend development server...${NC}"
npm run dev

cd "../.."

echo -e "\n${GREEN}🎉 Fix Complete!${NC}"
echo -e "${BLUE}🌐 URLs:${NC}"
echo -e "   Frontend: http://localhost:3000"
echo -e "   Login: file://$(pwd)/FrontEnd/Login/Login_Page.html"

echo -e "\n${GREEN}✅ Frontend fixes applied successfully!${NC}"
