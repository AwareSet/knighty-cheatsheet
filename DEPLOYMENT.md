# 🚀 KnightyApp Deployment Guide

## Project Structure

This is a **hybrid React + Go application** that requires specific build steps:

1. **Frontend**: React application (built with `npm run build`)
2. **Backend**: Go server with PocketBase (built with `go build`)
3. **Static Files**: HTML cheat sheets in `public/htmls/`

## Build Process

### Automated Build
```bash
./build-deploy.sh
```

### Manual Build Steps
```bash
# 1. Install Node dependencies
npm ci --only=production

# 2. Build React frontend
CI=false npm run build

# 3. Copy build files
cp -r build/* ./
cp -r public/htmls ./htmls/

# 4. Build Go backend
go mod tidy
CGO_ENABLED=0 GOOS=linux go build -o main *.go
```

## Deployment Platforms

### Dokploy/Nixpacks
- Uses `nixpacks.toml` configuration
- Automatically detects Node.js and Go
- Runs build commands in sequence

### Docker
```bash
docker build -t knightyapp .
docker run -p 8080:8080 knightyapp
```

### Heroku
- Uses `Procfile` and `app.json`
- Supports multi-buildpack (Node.js + Go)

### Railway
- Uses `railway.json` configuration
- Auto-detects build process

## Environment Variables

```bash
PORT=8080
NODE_ENV=production
POCKETBASE_ADMIN_EMAIL=admin@example.com
POCKETBASE_ADMIN_PASSWORD=secure-password
```

## File Structure After Build

```
knightyapp/
├── main              # Go binary (entry point)
├── index.html        # React app entry
├── static/           # React build assets
├── htmls/           # Cheat sheet HTML files
├── manifest.json    # PWA manifest
└── favicon.ico      # App icon
```

## Troubleshooting

### "Failed to read app source directory"
- Ensure `nixpacks.toml` is in root directory
- Check that all required files are present
- Verify build commands work locally

### "No such container"
- Build process failed
- Check build logs for specific errors
- Ensure Go and Node.js are available

### Build Failures
1. Run `./build-deploy.sh` locally to test
2. Check that `npm ci` and `go build` work
3. Verify all dependencies are in `package.json` and `go.mod`

## Support

For deployment issues:
1. Check build logs
2. Verify all configuration files are present
3. Test build process locally first
4. Ensure repository has all necessary files committed
