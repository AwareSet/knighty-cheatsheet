package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

func main() {
	// Get port from environment variable or default to 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Simple HTTP server
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, `<!DOCTYPE html>
<html>
<head>
    <title>KnightyApp - Deployment Test</title>
</head>
<body>
    <h1>🎉 KnightyApp is Running!</h1>
    <p>Dokploy deployment successful!</p>
    <p>Server running on port %s</p>
</body>
</html>`, port)
	})

	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	log.Printf("Minimal server starting on port %s", port)
	log.Printf("Visit: http://localhost:%s", port)

	if err := http.ListenAndServe("0.0.0.0:"+port, nil); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
