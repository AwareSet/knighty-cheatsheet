# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static web application that serves interactive technical cheat sheets for developers and DevOps engineers. It's built with vanilla HTML/CSS/JavaScript frontend and a Go backend that serves static files.

## Commands

### Development
```bash
# Run locally
go run main.go

# Build binary
go build -o app main.go
./app
```

### Deployment
```bash
# Railway deployment
railway login
railway link
railway up

# Docker build
docker build -t knightyapp .
docker run -p 8080:8080 knightyapp
```

### Testing & Debugging
```bash
# Test health endpoint
curl http://localhost:8080/health

# Test main page
curl http://localhost:8080

# Check Go modules
go mod tidy
go mod verify

# Format Go code
go fmt ./...

# Run with verbose logging
go run main.go -v
```

## Architecture

### Backend (main.go)
- Simple Go HTTP server serving static files
- Handles CORS headers and security headers
- Routes root requests to index.html
- Serves HTML files from htmls/ directory
- Includes health check endpoint at /health
- Configured for Railway deployment (binds to 0.0.0.0)

### Frontend Structure
- **index.html** - Main application page with interactive cheat sheet gallery
- **htmls/** - Directory containing individual cheat sheet HTML files
- Each cheat sheet is a standalone HTML file with embedded CSS and JavaScript
- Features responsive design, modal viewing, drag-and-drop functionality, and bilingual support

### Key Features
- Real-time search filtering
- Modal overlay viewer for cheat sheets
- Moveable modal windows
- Responsive design for all devices
- Support for English and Arabic content

### Deployment Configuration
- **railway.json** - Railway platform configuration
- **Dockerfile** - Multi-stage Docker build for production
- **Procfile** - Process configuration for Heroku-compatible platforms
- **deploy.sh** - Deployment script

## File Organization
- Static files are served directly from root and htmls/ directories
- Go server handles routing and serves appropriate content types
- All cheat sheets are self-contained HTML files in htmls/ directory