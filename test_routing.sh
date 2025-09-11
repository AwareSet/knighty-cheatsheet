#!/bin/bash

# Test script to verify cheatsheet routing
# This script tests that the server properly serves cheatsheet routes

echo "🧪 Testing KnightyApp Routing..."
echo "==============================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Server URL (change if different)
SERVER_URL="http://localhost:8080"

# Function to test URL
test_url() {
    local url=$1
    local description=$2
    
    echo -e "${BLUE}Testing: $description${NC}"
    echo "URL: $url"
    
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200"; then
        echo -e "${GREEN}✅ PASS - $description${NC}"
        return 0
    else
        echo -e "${RED}❌ FAIL - $description${NC}"
        return 1
    fi
    echo ""
}

echo "Starting tests..."
echo ""

# Test main routes
test_url "$SERVER_URL/" "Main page"
test_url "$SERVER_URL/health" "Health check"

# Test React Router routes (should return HTML)
test_url "$SERVER_URL/cheatsheet/golang" "Cheatsheet route (React Router)"
test_url "$SERVER_URL/cheatsheet/docker" "Another cheatsheet route"

# Test direct HTML file access
test_url "$SERVER_URL/htmls/golang_cheat_sheet.html" "Direct HTML file access"
test_url "$SERVER_URL/htmls/docker_cheat_sheet.html" "Another HTML file"

# Test static files
test_url "$SERVER_URL/favicon.ico" "Favicon"
test_url "$SERVER_URL/manifest.json" "Manifest file"

echo ""
echo "🎯 Test Summary:"
echo "If all tests pass, your cheatsheet routing is working correctly!"
echo ""
echo "📋 Manual verification steps:"
echo "1. Visit $SERVER_URL in browser"
echo "2. Click on a cheat sheet card"
echo "3. Verify it loads in the CheatSheetViewer"
echo "4. Check that the iframe loads the HTML content"
echo "5. Test the 'Open in New Tab' button"
