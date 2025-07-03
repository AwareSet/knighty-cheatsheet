# Tech Cheat Sheets

Interactive reference guides for developers & DevOps engineers.

## 🚀 Railway Deployment

This project includes everything needed for Railway deployment:

### Files Added for Railway:
- `main.go` - Go web server to serve static files
- `go.mod` - Go module definition
- `railway.json` - Railway configuration (optional)
- `Dockerfile` - Container configuration (alternative)

### Deploy to Railway:

1. **Connect your repository to Railway:**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   railway link
   railway up
   ```

2. **Or deploy via Railway Dashboard:**
   - Visit [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Railway will auto-detect the Go application
   - Deploy automatically

### Local Development:

```bash
# Run locally
go run main.go

# Build binary
go build -o app main.go
./app
```

Visit `http://localhost:8080` to view the application.

## 📁 Project Structure

```
knightyapp/
├── main.go              # Go web server
├── go.mod              # Go dependencies
├── index.html          # Main page
├── htmls/              # Cheat sheet files
│   ├── kubernetes_cheat_sheet.html
│   ├── docker_cheat_sheet.html
│   └── ...
├── railway.json        # Railway config
├── Dockerfile          # Container config
└── README.md           # This file
```

## ✨ Features

- **Responsive Design** - Works on all devices
- **Bilingual Support** - English & Arabic
- **Interactive Search** - Real-time filtering
- **Modal Viewer** - View cheat sheets in overlay
- **Drag & Drop** - Moveable modal windows

## 🛠 Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Go (static file server)
- **Deployment:** Railway, Docker

---
Built with ❤️ by @night_knightz
