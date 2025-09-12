#!/bin/bash

# VPS Deployment Script for KnightyApp
# Deploy directly to a Linux VPS without containers

set -e

echo "🚀 VPS Deployment Script for KnightyApp"
echo "======================================="

# Configuration
VPS_HOST="your-server.com"
VPS_USER="your-username"
VPS_PATH="/var/www/knightyapp"
SERVICE_NAME="knightyapp"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Build locally
print_step "Building application locally..."
./build-deploy.sh

# Step 2: Create deployment package
print_step "Creating deployment package..."
tar -czf knightyapp-deploy.tar.gz main index.html htmls/ static/ manifest.json favicon.ico

# Step 3: Upload to VPS
print_step "Uploading to VPS..."
scp knightyapp-deploy.tar.gz $VPS_USER@$VPS_HOST:/tmp/

# Step 4: Deploy on VPS
print_step "Deploying on VPS..."
ssh $VPS_USER@$VPS_HOST << 'EOF'
# Stop existing service
sudo systemctl stop knightyapp || echo "Service not running"

# Create directory
sudo mkdir -p /var/www/knightyapp
cd /var/www/knightyapp

# Extract files
sudo tar -xzf /tmp/knightyapp-deploy.tar.gz
sudo chown -R www-data:www-data .
sudo chmod +x main

# Create systemd service
sudo tee /etc/systemd/system/knightyapp.service > /dev/null << 'SERVICE'
[Unit]
Description=KnightyApp Cheat Sheets
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/knightyapp
ExecStart=/var/www/knightyapp/main
Restart=always
RestartSec=5
Environment=PORT=8080
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
SERVICE

# Start service
sudo systemctl daemon-reload
sudo systemctl enable knightyapp
sudo systemctl start knightyapp

# Setup nginx reverse proxy
sudo tee /etc/nginx/sites-available/knightyapp > /dev/null << 'NGINX'
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX

# Enable nginx site
sudo ln -sf /etc/nginx/sites-available/knightyapp /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

echo "Deployment completed!"
EOF

print_success "VPS deployment completed!"
echo "Your app should be running at http://your-domain.com"

# Cleanup
rm knightyapp-deploy.tar.gz


