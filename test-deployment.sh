#!/bin/bash
set -e

echo "=== Testing KnightyApp Deployment Process ==="

# Clean up any existing build
echo "Cleaning up..."
rm -f main go.mod

# Simulate the Nixpacks build process
echo "=== Phase: Install ==="
npm ci --production

echo "=== Phase: Build ==="
echo "Building React app..."
npm run build

echo "Copying React files..."
cp -r build/* ./

echo "Setting up HTML cheatsheets..."
mkdir -p htmls
cp -r public/htmls/* ./htmls/ || echo "No HTML files to copy"

echo "Preparing Go build..."
cp go.simple.mod go.mod

echo "Building Go application..."
go build -o main main.simple.go

echo "=== Verification ==="
echo "Checking build artifacts:"
if [ -f "main" ]; then
    echo "✅ Go binary created successfully"
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

if [ -d "htmls" ]; then
    echo "✅ htmls directory exists"
    ls -la htmls/
else
    echo "❌ htmls directory missing!"
fi

if [ -d "static" ]; then
    echo "✅ static directory exists"
else
    echo "❌ static directory missing!"
fi

echo "Final directory structure:"
ls -la

echo "=== Test Complete ==="
echo "Build process completed successfully!"
echo "To test the server locally, run: ./main"
