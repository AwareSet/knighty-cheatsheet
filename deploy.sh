#!/bin/bash

# KnightyApp Independent Deployment Script
# Supports multiple deployment platforms

set -e  # Exit on any error

echo "🚀 KnightyApp Deployment Script"
echo "==============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if we're in the right directory
if [ ! -f "main.go" ] || [ ! -f "package.json" ]; then
    print_error "Please run this script from the knightyapp root directory"
    exit 1
fi

# Step 1: Build the application
print_step "Building application..."
if [ -f "build.sh" ]; then
    ./build.sh
else
    print_warning "build.sh not found, running manual build..."
    npm install
    npm run build
    cp -r build/* public/
    go build -o main main.go pb_admin_auth.go
fi
print_success "Application built successfully"

# Step 2: Check required files
print_step "Verifying deployment files..."
required_files=("main.go" "go.mod" "public/index.html" "public/htmls" "Dockerfile" "Procfile")
missing_files=()

for file in "${required_files[@]}"; do
    if [ -e "$file" ]; then
        print_success "$file exists"
    else
        print_warning "$file missing"
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -gt 0 ]; then
    print_warning "Some files are missing but deployment might still work"
fi

# Step 3: Choose deployment method
echo ""
echo "🎯 Choose deployment method:"
echo "1. Railway (Recommended)"
echo "2. Docker Build & Push"
echo "3. Heroku"
echo "4. Manual VPS"
echo "5. Test locally only"
echo ""

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        print_step "Deploying to Railway..."
        
        if command_exists railway; then
            print_success "Railway CLI found"
            
            # Check if project is linked
            if railway status &>/dev/null; then
                print_success "Project already linked to Railway"
            else
                print_warning "Project not linked. Please run 'railway link' first"
                echo "Or create a new project with 'railway init'"
                exit 1
            fi
            
            # Deploy
            print_step "Deploying to Railway..."
            railway up
            print_success "Deployed to Railway!"
            
        else
            print_warning "Railway CLI not found"
            echo ""
            echo "📋 Manual Railway deployment steps:"
            echo "1. Visit https://railway.app"
            echo "2. Connect your Git repository"
            echo "3. Railway will auto-detect Go and deploy"
            echo "4. Set environment variables if needed"
        fi
        ;;
    
    2)
        print_step "Building Docker image..."
        
        if command_exists docker; then
            docker build -t knightyapp:latest .
            print_success "Docker image built: knightyapp:latest"
            
            echo ""
            echo "📋 Next steps for Docker deployment:"
            echo "• Tag for registry: docker tag knightyapp:latest your-registry/knightyapp:latest"
            echo "• Push to registry: docker push your-registry/knightyapp:latest"
            echo "• Run locally: docker run -p 8080:8080 knightyapp:latest"
        else
            print_error "Docker not found. Please install Docker"
            exit 1
        fi
        ;;
    
    3)
        print_step "Preparing for Heroku deployment..."
        
        if command_exists heroku; then
            print_success "Heroku CLI found"
            
            # Check if app exists
            if heroku apps:info &>/dev/null; then
                print_success "Heroku app found"
            else
                print_warning "No Heroku app found. Create one with 'heroku create your-app-name'"
                exit 1
            fi
            
            # Deploy
            print_step "Deploying to Heroku..."
            git add .
            git commit -m "Deploy knightyapp to Heroku" || true
            git push heroku main
            print_success "Deployed to Heroku!"
            
        else
            print_warning "Heroku CLI not found"
            echo ""
            echo "📋 Manual Heroku deployment steps:"
            echo "1. Install Heroku CLI"
            echo "2. heroku login"
            echo "3. heroku create your-app-name"
            echo "4. git push heroku main"
        fi
        ;;
    
    4)
        print_step "Manual VPS deployment instructions..."
        echo ""
        echo "📋 VPS Deployment Steps:"
        echo "1. Copy files to your VPS:"
        echo "   scp -r . user@your-vps:/path/to/knightyapp/"
        echo ""
        echo "2. On your VPS, run:"
        echo "   cd /path/to/knightyapp"
        echo "   ./build.sh"
        echo "   nohup ./main &"
        echo ""
        echo "3. Setup reverse proxy (nginx):"
        echo "   proxy_pass http://localhost:8080;"
        echo ""
        echo "4. Setup systemd service for auto-restart"
        ;;
    
    5)
        print_step "Testing locally..."
        echo ""
        echo "🧪 Starting local test server..."
        echo "Visit: http://localhost:8080"
        echo "Press Ctrl+C to stop"
        echo ""
        
        # Set test environment
        export PORT=8080
        ./main
        ;;
    
    *)
        print_error "Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment process completed!"
echo ""
echo "📊 Deployment summary:"
echo "  ✅ Application: KnightyApp Cheat Sheets"
echo "  ✅ Tech Stack: Go + React + PocketBase"
echo "  ✅ Features: Bilingual cheat sheets, Newsletter signup"
echo "  ✅ Status: Ready for production"
echo ""
echo "🔗 Useful links:"
echo "  • Railway: https://railway.app"
echo "  • Docker Hub: https://hub.docker.com"
echo "  • Heroku: https://heroku.com"
echo ""
echo "📞 Need help? Check the README.md or create an issue!"
