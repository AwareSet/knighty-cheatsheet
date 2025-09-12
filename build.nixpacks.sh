#!/bin/bash
set -e

echo "=== KnightyApp Nixpacks Build Script ==="

# Check environment
echo "Node version: $(node --version)"
echo "Go version: $(go version)"
echo "Current directory: $(pwd)"
echo "Files present: $(ls -la)"

# Install dependencies
echo "Installing Node.js dependencies..."
npm ci --production --no-audit --no-fund

echo "Installing Go dependencies..."
go mod download

# Build React app
echo "Building React application..."
CI=false npm run build

echo "React build completed. Contents of build directory:"
ls -la build/

# Copy React build to root
echo "Copying React files to deployment root..."
cp -r build/* ./

# Create and populate htmls directory
echo "Setting up HTML cheatsheets..."
mkdir -p htmls
if [ -d "public/htmls" ]; then
    cp -r public/htmls/* ./htmls/
    echo "HTML cheatsheets copied"
else
    echo "No HTML cheatsheets found"
fi

# Build Go binary
echo "Building Go application..."
go build -o main *.go

# Verify build
echo "Build verification:"
if [ -f "main" ]; then
    echo "✅ Go binary created"
    file main
else
    echo "❌ Go binary missing!"
    exit 1
fi

if [ -f "index.html" ]; then
    echo "✅ React index.html present"
else
    echo "❌ React build missing!"
    exit 1
fi

echo "Final directory structure:"
ls -la

echo "Build completed successfully!"
