#!/bin/bash

# Debug Build Script for KnightyApp
# This script mimics exactly what Nixpacks should do

set -e  # Exit on any error

echo "🔍 Debug Build Script for KnightyApp"
echo "===================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Step 1: Check environment
print_step "Checking environment..."
echo "Node version: $(node --version || echo 'Node not found')"
echo "NPM version: $(npm --version || echo 'NPM not found')"
echo "Go version: $(go version || echo 'Go not found')"
echo "Current directory: $(pwd)"
echo "Files in directory:"
ls -la
print_success "Environment checked"

# Step 2: Install dependencies (mimicking Nixpacks install phase)
print_step "Installing Node.js dependencies..."
if [ -f "package.json" ]; then
    npm ci --only=production --no-audit --no-fund
    print_success "Dependencies installed"
else
    print_error "package.json not found"
    exit 1
fi

# Step 3: Build React (mimicking Nixpacks build phase)
print_step "Building React frontend..."
CI=false npm run build

if [ -d "build" ]; then
    print_success "React build completed"
    echo "Build directory contents:"
    ls -la build/
else
    print_error "React build failed - no build directory"
    exit 1
fi

# Step 4: Copy build files
print_step "Copying build files..."
cp -r build/* ./
print_success "Build files copied to root"

# Step 5: Copy HTML files
print_step "Copying HTML files..."
mkdir -p htmls
if [ -d "public/htmls" ]; then
    cp -r public/htmls/* ./htmls/
    print_success "HTML files copied"
    echo "HTML files:"
    ls -la htmls/ | head -10
else
    print_warning "No public/htmls directory found"
fi

# Step 6: Build Go application
print_step "Building Go application..."
if [ -f "go.mod" ]; then
    go mod download
    go mod verify
    CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags='-w -s' -o main *.go
    
    if [ -f "main" ]; then
        print_success "Go build completed"
        echo "Binary info:"
        ls -la main
        file main
    else
        print_error "Go build failed - no main binary"
        exit 1
    fi
else
    print_error "go.mod not found"
    exit 1
fi

# Step 7: Final verification
print_step "Final verification..."
echo "Required files:"
for file in "main" "index.html" "htmls"; do
    if [ -e "$file" ]; then
        print_success "$file exists"
    else
        print_error "$file missing"
        exit 1
    fi
done

echo ""
print_success "🎉 Debug build completed successfully!"
echo "=========================================="
echo "📁 Ready for deployment:"
echo "   ✅ main ($(du -h main | cut -f1))"
echo "   ✅ index.html ($(du -h index.html | cut -f1))"
echo "   ✅ htmls/ ($(du -sh htmls 2>/dev/null | cut -f1 || echo 'N/A'))"
echo "   ✅ static/ ($(du -sh static 2>/dev/null | cut -f1 || echo 'N/A'))"
echo ""
echo "🚀 This matches exactly what Nixpacks should produce!"
echo ""
echo "Next steps:"
echo "1. If this works locally, the issue is with Dokploy/Nixpacks"
echo "2. Try switching to Docker deployment in Dokploy"
echo "3. Or use Railway/Heroku instead"
