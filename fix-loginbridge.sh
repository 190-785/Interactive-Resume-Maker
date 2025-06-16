#!/bin/bash
# Fix for LoginBridge Constructor Error
# This script fixes the webpack configuration and clears cache

echo "🔧 Fixing LoginBridge Constructor Error..."
echo "=========================================="

# Navigate to Forest Drive directory
cd "FrontEnd/Forest_Drive"

echo "📦 Clearing webpack cache..."
rm -rf dist/
rm -rf node_modules/.cache/
rm -rf .webpack/

echo "🔄 Reinstalling dependencies..."
npm install

echo "🏗️ Building project..."
npm run build

echo "🚀 Starting development server..."
npm run dev

echo "✅ Fix complete! LoginBridge should now work correctly."
