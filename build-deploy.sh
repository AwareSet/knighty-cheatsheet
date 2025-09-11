#!/bin/bash

# KnightyApp Deployment Build Script
# This script builds the application for deployment

set -e  # Exit on any error

echo "🚀 Building KnightyApp for deployment..."
echo "======================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
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

# Step 1: Clean previous builds
print_step "Cleaning previous builds..."
rm -rf build/
rm -f main
print_success "Cleaned previous builds"

# Step 2: Install Node.js dependencies
print_step "Installing Node.js dependencies..."
if command -v npm &> /dev/null; then
    npm ci --only=production
    print_success "Node.js dependencies installed"
else
    print_error "npm not found. Please install Node.js"
    exit 1
fi

# Step 3: Build React frontend
print_step "Building React frontend..."
CI=false npm run build
if [ -d "build" ]; then
    print_success "React frontend built successfully"
    
    # Copy build files to root directory for Go server
    print_step "Copying build files..."
    cp -r build/* ./
    
    # Ensure htmls directory is accessible
    if [ -d "public/htmls" ]; then
        cp -r public/htmls ./htmls/
        print_success "HTML files copied"
    fi
    
    print_success "Build files prepared"
else
    print_error "React build failed"
    exit 1
fi

# Step 4: Build Go backend
print_step "Building Go backend..."
if command -v go &> /dev/null; then
    go mod tidy
    CGO_ENABLED=0 GOOS=linux go build -o main *.go
    if [ -f "main" ]; then
        print_success "Go backend built successfully"
    else
        print_error "Go build failed"
        exit 1
    fi
else
    print_error "Go not found. Please install Go 1.23+"
    exit 1
fi

# Step 5: Verify deployment files
print_step "Verifying deployment files..."
required_files=("main" "index.html" "htmls")
for file in "${required_files[@]}"; do
    if [ -e "$file" ]; then
        print_success "$file exists"
    else
        print_error "$file missing"
        exit 1
    fi
done

echo ""
echo "🎉 Deployment build completed successfully!"
echo "=========================================="
echo "📁 Deployment files ready:"
echo "   ✅ main (Go binary)"
echo "   ✅ index.html (React app)"
echo "   ✅ htmls/ (Cheat sheets)"
echo "   ✅ static/ (Assets)"
echo ""
echo "🚀 Ready for deployment!"
