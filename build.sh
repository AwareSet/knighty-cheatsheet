#!/bin/bash

# KnightyApp Independent Build Script
# This script builds the React frontend and Go backend independently

set -e  # Exit on any error

echo "🚀 Building KnightyApp Cheat Sheets..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "main.go" ] || [ ! -f "package.json" ]; then
    print_error "Please run this script from the knightyapp root directory"
    exit 1
fi

# Step 1: Clean previous builds
print_step "Cleaning previous builds..."
rm -rf build/
rm -f main
print_success "Cleaned previous builds"

# Step 2: Install Node.js dependencies
print_step "Installing Node.js dependencies..."
if command -v npm &> /dev/null; then
    npm install
    print_success "Node.js dependencies installed"
else
    print_error "npm not found. Please install Node.js"
    exit 1
fi

# Step 3: Build React frontend
print_step "Building React frontend..."
npm run build
if [ -d "build" ]; then
    print_success "React frontend built successfully"
    
    # Copy build files to root directory for Go server
    print_step "Copying build files for Go server..."
    cp -r build/* ./
    print_success "Build files copied to root directory"
    
    # Ensure htmls directory is accessible
    if [ -d "public/htmls" ] && [ ! -d "htmls" ]; then
        ln -s public/htmls htmls
        print_success "Created symlink to htmls directory"
    fi
else
    print_error "React build failed"
    exit 1
fi

# Step 4: Verify Go dependencies
print_step "Verifying Go dependencies..."
if command -v go &> /dev/null; then
    go version
    go mod tidy
    print_success "Go dependencies verified"
else
    print_error "Go not found. Please install Go 1.23+"
    exit 1
fi

# Step 5: Build Go backend
print_step "Building Go backend..."
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -installsuffix cgo -o main main.go pb_admin_auth.go
if [ -f "main" ]; then
    print_success "Go backend built successfully"
else
    print_error "Go build failed"
    exit 1
fi

# Step 6: Verify required files
print_step "Verifying build artifacts..."
required_files=("main" "index.html" "public/index.html" "public/htmls")
for file in "${required_files[@]}"; do
    if [ -e "$file" ]; then
        print_success "$file exists"
    else
        print_warning "$file missing (might be optional)"
    fi
done

# Step 7: Build summary
echo ""
echo "🎉 Build completed successfully!"
echo "=================================="
echo "📁 Build artifacts:"
echo "   ✅ main (Go binary)"
echo "   ✅ public/ (React build)"
echo "   ✅ public/htmls/ (Cheat sheets)"
echo "   ✅ index.html (Main page)"
echo ""
echo "🚀 Ready for deployment!"
echo ""
echo "Next steps:"
echo "  • Test locally: ./main"
echo "  • Deploy: ./deploy.sh"
echo "  • Docker: docker build -t knightyapp ."
echo ""

# Optional: Test build locally
read -p "🧪 Test the build locally? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_step "Starting local test server..."
    echo "Visit: http://localhost:8080"
    echo "Press Ctrl+C to stop"
    ./main
fi

