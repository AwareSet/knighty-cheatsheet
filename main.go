package main

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"
)

// Newsletter subscription data structures for external API
type SubscribeRequest struct {
	Email  string `json:"email"`
	Others string `json:"others,omitempty"` // To store IP address or other metadata
}

type SubscribeResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

// Get client IP address
func getClientIP(r *http.Request) string {
	// Check for forwarded IP (Railway, Heroku, etc.)
	if ip := r.Header.Get("X-Forwarded-For"); ip != "" {
		return strings.Split(ip, ",")[0]
	}
	if ip := r.Header.Get("X-Real-IP"); ip != "" {
		return ip
	}
	// Fallback for direct connections
	if strings.Contains(r.RemoteAddr, ":") {
		return strings.Split(r.RemoteAddr, ":")[0]
	}
	return r.RemoteAddr
}

// Newsletter subscription handler
func subscribeHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Handle preflight request
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(SubscribeResponse{
			Success: false,
			Message: "Method not allowed",
		})
		return
	}

	// Parse request body from frontend
	var req SubscribeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(SubscribeResponse{
			Success: false,
			Message: "Invalid request format",
		})
		return
	}

	// Validate email
	email := strings.TrimSpace(req.Email)
	if email == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(SubscribeResponse{
			Success: false,
			Message: "Email is required",
		})
		return
	}

	// Basic email validation
	if !strings.Contains(email, "@") || !strings.Contains(email, ".") {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(SubscribeResponse{
			Success: false,
			Message: "Invalid email format",
		})
		return
	}

	// Prepare data for the external API
	externalAPIBody := map[string]string{
		"email":  email,
		"others": "IP:" + getClientIP(r), // Store IP in 'others' field
	}
	jsonBody, err := json.Marshal(externalAPIBody)
	if err != nil {
		log.Printf("Error marshalling JSON for external API: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(SubscribeResponse{
			Success: false,
			Message: "Internal server error",
		})
		return
	}

	// Make POST request to external API
	externalAPIURL := "http://pocketbase-wo0s48c8g8w4gcocgc4ks0kc.45.76.250.233.sslip.io/api/collections/cli_newsletters/records"
	authToken := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc1MDQxMDYzNSwiaWQiOiJ4MTFyZ2c4NTVkNWUyazAiLCJyZWZyZXNoYWJsZSI6ZmFsc2UsInR5cGUiOiJhdXRoIn0.NU0jnejvHrvG7Q2pFpsvFsWzn-k28sPKS2bfH9r224s"

	client := &http.Client{Timeout: 10 * time.Second}
	apiReq, err := http.NewRequest("POST", externalAPIURL, bytes.NewBuffer(jsonBody))
	if err != nil {
		log.Printf("Error creating external API request: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(SubscribeResponse{
			Success: false,
			Message: "Internal server error",
		})
		return
	}
	apiReq.Header.Set("Content-Type", "application/json")
	apiReq.Header.Set("Authorization", "Bearer "+authToken)

	apiResp, err := client.Do(apiReq)
	if err != nil {
		log.Printf("Error calling external API: %v", err)
		w.WriteHeader(http.StatusBadGateway)
		json.NewEncoder(w).Encode(SubscribeResponse{
			Success: false,
			Message: "Failed to connect to subscription service",
		})
		return
	}
	defer apiResp.Body.Close()

	// Read external API response
	apiResponseBody, err := io.ReadAll(apiResp.Body)
	if err != nil {
		log.Printf("Error reading external API response: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(SubscribeResponse{
			Success: false,
			Message: "Internal server error",
		})
		return
	}

	// Handle external API response status
	if apiResp.StatusCode >= 200 && apiResp.StatusCode < 300 {
		log.Printf("Successfully subscribed %s via external API. Response: %s", email, string(apiResponseBody))
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(SubscribeResponse{
			Success: true,
			Message: "Successfully subscribed to newsletter",
		})
	} else if apiResp.StatusCode == http.StatusConflict {
		log.Printf("Email %s already subscribed via external API. Response: %s", email, string(apiResponseBody))
		w.WriteHeader(http.StatusConflict)
		json.NewEncoder(w).Encode(SubscribeResponse{
			Success: false,
			Message: "Email already subscribed",
		})
	} else if apiResp.StatusCode == http.StatusBadRequest {
		log.Printf("External API returned bad request for %s. Response: %s", email, string(apiResponseBody))
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(SubscribeResponse{
			Success: false,
			Message: "Invalid email or request for subscription service",
		})
	} else {
		log.Printf("External API returned unexpected status %d for %s. Response: %s", apiResp.StatusCode, email, string(apiResponseBody))
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(SubscribeResponse{
			Success: false,
			Message: "Subscription service error",
		})
	}
}

func main() {
	// Get port from environment variable or default to 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Create HTTP server
	mux := http.NewServeMux()

	// Newsletter API endpoint
	mux.HandleFunc("/api/subscribe", subscribeHandler)

	// Health check endpoint
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	// Serve static HTML cheat sheets directly
	mux.HandleFunc("/htmls/", func(w http.ResponseWriter, r *http.Request) {
		// Extract the file path from the URL
		filePath := r.URL.Path[1:] // Remove leading slash

		// Check if file exists
		if _, err := os.Stat(filePath); os.IsNotExist(err) {
			http.Error(w, "Cheat sheet not found", http.StatusNotFound)
			return
		}

		// Serve the HTML file
		http.ServeFile(w, r, filePath)
	})

	// Serve other static files
	mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))

	// Serve favicon and manifest
	mux.HandleFunc("/favicon.ico", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./favicon.ico")
	})
	mux.HandleFunc("/manifest.json", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./manifest.json")
	})

	// Cheatsheet route - serve React app
	mux.HandleFunc("/cheatsheet", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./index.html")
	})

	// Cheatsheet sub-routes - serve React app for client-side routing
	mux.HandleFunc("/cheatsheet/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./index.html")
	})

	// SPA fallback - serve index.html for all other routes
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Path

		// Don't serve index.html for API routes
		if strings.HasPrefix(path, "/api/") {
			http.Error(w, "API endpoint not found", http.StatusNotFound)
			return
		}

		// For all other routes, serve index.html
		// This allows React Router to handle the routing client-side
		http.ServeFile(w, r, "./index.html")
	})

	log.Printf("Server starting on port %s", port)
	log.Printf("Visit: http://localhost:%s", port)

	// List files in current directory for debugging
	files, err := os.ReadDir(".")
	if err == nil {
		log.Println("Files in current directory:")
		for _, file := range files {
			log.Printf("  %s", file.Name())
		}
	}

	// Check if htmls directory exists
	if _, err := os.Stat("htmls"); err != nil {
		log.Printf("Warning: htmls directory not found: %v", err)
	} else {
		log.Println("htmls directory found")
	}

	// Start the HTTP server
	server := &http.Server{
		Addr:    "0.0.0.0:" + port,
		Handler: mux,
	}

	if err := server.ListenAndServe(); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
