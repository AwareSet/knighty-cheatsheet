package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

func main() {
	// Get port from environment variable or default to 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Serve static files from current directory
	fs := http.FileServer(http.Dir("."))

	// Handle all routes with static file server
	http.Handle("/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Add security headers
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("X-XSS-Protection", "1; mode=block")

		// Handle root path
		if r.URL.Path == "/" {
			http.ServeFile(w, r, "index.html")
			return
		}

		// Check if file exists
		filePath := filepath.Clean(r.URL.Path[1:]) // Remove leading slash
		if _, err := os.Stat(filePath); os.IsNotExist(err) {
			// If file doesn't exist, serve index.html (for SPA routing)
			http.ServeFile(w, r, "index.html")
			return
		}

		// Serve the requested file
		fs.ServeHTTP(w, r)
	}))

	fmt.Printf("Server starting on port %s\n", port)
	fmt.Printf("Visit: http://localhost:%s\n", port)

	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
