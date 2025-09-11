# 🚨 KnightyApp Deployment Troubleshooting Guide

## Current Error Analysis

```
Error: Failed to read app source directory
Caused by: No such file or directory (os error 2)
Error response from daemon: No such container: knightyweb-cheatsheet-shvu75-KvXz6KKH_j
```

## Root Cause
Dokploy with Nixpacks is failing to properly handle the hybrid React + Go application structure.

## 🔧 Solution 1: Updated Nixpacks Configuration

The `nixpacks.toml` has been updated with:
- More specific Node.js and Go versions
- Detailed build steps with error checking
- Better error handling and logging

### Key Changes:
```toml
[phases.setup]
nixPkgs = ["nodejs_18", "go_1_21", "git"]

[phases.install]
cmds = ["npm ci --only=production --no-audit --no-fund"]

[phases.build]
cmds = [
    "echo 'Starting React build...'",
    "CI=false npm run build",
    "echo 'React build completed'",
    # ... detailed build steps with logging
]
```

## 🐳 Solution 2: Switch to Docker Build

If Nixpacks continues to fail, use Docker deployment instead:

### Option A: Use existing Dockerfile
```bash
# In Dokploy, change build method from "Nixpacks" to "Dockerfile"
```

### Option B: Use simplified Dockerfile
```bash
# Rename Dockerfile.simple to Dockerfile
mv Dockerfile.simple Dockerfile
```

## 🔄 Solution 3: Manual Deployment Steps

### Step 1: Test Build Locally
```bash
# Run this to verify the build works
./build-deploy.sh
```

### Step 2: Push Updated Configuration
```bash
git add .
git commit -m "Fix deployment configuration - updated nixpacks.toml"
git push origin main
```

### Step 3: Retry Deployment
- Go to Dokploy dashboard
- Trigger new deployment
- Monitor build logs for detailed error messages

## 🎯 Solution 4: Alternative Platforms

If Dokploy continues to have issues:

### Railway (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway init
railway up
```

### Heroku
```bash
# Create Heroku app
heroku create your-app-name

# Set buildpacks
heroku buildpacks:set heroku/nodejs
heroku buildpacks:add heroku/go

# Deploy
git push heroku main
```

### Render
- Connect GitHub repository
- Set build command: `./build-deploy.sh`
- Set start command: `./main`

## 🔍 Debugging Steps

### 1. Check Repository Files
Ensure these files are in your repo:
- ✅ `nixpacks.toml`
- ✅ `package.json`
- ✅ `go.mod`
- ✅ `main.go`
- ✅ `src/` directory
- ✅ `public/htmls/` directory

### 2. Verify Build Locally
```bash
# Test React build
npm ci
npm run build

# Test Go build
go mod tidy
go build -o main *.go

# Test complete build
./build-deploy.sh
```

### 3. Check Dokploy Logs
Look for specific error messages in:
- Build logs
- Container logs
- System logs

## 🚀 Quick Fix Commands

### Update and Redeploy
```bash
# Update nixpacks config and redeploy
git add nixpacks.toml
git commit -m "Update nixpacks configuration"
git push

# Or switch to Docker
git add Dockerfile.simple
git commit -m "Add simple Docker configuration"
git push
```

### Test Build Locally
```bash
# Quick local test
chmod +x build-deploy.sh
./build-deploy.sh
```

## 📞 Next Steps

1. **Try the updated nixpacks.toml first** - commit and push the changes
2. **If still failing, switch to Docker** - use Dockerfile.simple
3. **If Docker fails, try Railway** - it has better multi-language support
4. **Last resort: Manual VPS deployment** - use the built files from local build

## 💡 Prevention

For future deployments:
- Always test builds locally first
- Use the `build-deploy.sh` script to verify
- Keep deployment configurations simple
- Monitor build logs for early error detection

## 🆘 Emergency Deployment

If you need the app live immediately:

1. Run `./build-deploy.sh` locally
2. Upload the built files to any static hosting (Netlify, Vercel)
3. Deploy the Go binary to a simple VPS
4. Point domain to the VPS

This will get you online while troubleshooting the automated deployment.
