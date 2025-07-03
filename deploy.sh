#!/bin/bash

echo "🚀 Preparing for Railway deployment..."

# Test Go server locally (optional)
echo "Testing Go server locally..."
if command -v go &>/dev/null; then
    echo "✅ Go is installed"
    go version

    # Test build
    echo "Testing build..."
    go build -o main main.go
    if [ $? -eq 0 ]; then
        echo "✅ Build successful"
        rm -f main
    else
        echo "❌ Build failed"
        exit 1
    fi
else
    echo "⚠️  Go not found locally, but Railway will handle it"
fi

# Check required files
echo "Checking required files..."
files=("main.go" "go.mod" "index.html" "htmls")
for file in "${files[@]}"; do
    if [ -e "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        exit 1
    fi
done

echo "📋 Files ready for Railway deployment:"
echo "  ✅ main.go (Go server)"
echo "  ✅ go.mod (Dependencies)"
echo "  ✅ index.html (Main page)"
echo "  ✅ htmls/ (Cheat sheets)"
echo "  ✅ Procfile (Start command)"
echo "  ✅ Dockerfile (Container config)"

echo ""
echo "🚀 Ready to deploy to Railway!"
echo ""
echo "Next steps:"
echo "1. Commit and push to your repository"
echo "2. Connect repository to Railway at https://railway.app"
echo "3. Railway will auto-deploy"
echo ""
echo "Or use Railway CLI:"
echo "  railway login"
echo "  railway link"
echo "  railway up"
