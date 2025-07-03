package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path"
	"strings"
	"time"
)

// Newsletter subscription data structures
type NewsletterSubscription struct {
	Email        string    `json:"email"`
	SubscribedAt time.Time `json:"subscribed_at"`
	IPAddress    string    `json:"ip_address,omitempty"`
}

type NewsletterData struct {
	Subscriptions []NewsletterSubscription `json:"subscriptions"`
	TotalCount    int                      `json:"total_count"`
	LastUpdated   time.Time                `json:"last_updated"`
}

type SubscribeRequest struct {
	Email string `json:"email"`
}

type SubscribeResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

const newsletterFile = "newsletter_subscriptions.json"

// Load existing newsletter data from JSON file
func loadNewsletterData() (*NewsletterData, error) {
	data := &NewsletterData{
		Subscriptions: []NewsletterSubscription{},
		TotalCount:    0,
		LastUpdated:   time.Now(),
	}

	// Check if file exists
	if _, err := os.Stat(newsletterFile); os.IsNotExist(err) {
		return data, nil // Return empty data if file doesn't exist
	}

	// Read file
	file, err := os.ReadFile(newsletterFile)
	if err != nil {
		return data, err
	}

	// Parse JSON
	if err := json.Unmarshal(file, data); err != nil {
		return data, err
	}

	return data, nil
}

// Save newsletter data to JSON file
func saveNewsletterData(data *NewsletterData) error {
	data.LastUpdated = time.Now()
	data.TotalCount = len(data.Subscriptions)

	// Convert to JSON
	jsonData, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return err
	}

	// Write to file
	return os.WriteFile(newsletterFile, jsonData, 0644)
}

// Check if email already exists
func emailExists(data *NewsletterData, email string) bool {
	email = strings.ToLower(strings.TrimSpace(email))
	for _, sub := range data.Subscriptions {
		if strings.ToLower(sub.Email) == email {
			return true
		}
	}
	return false
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

	// Parse request body
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

	// Load existing data
	data, err := loadNewsletterData()
	if err != nil {
		log.Printf("Error loading newsletter data: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(SubscribeResponse{
			Success: false,
			Message: "Server error occurred",
		})
		return
	}

	// Check if email already exists
	if emailExists(data, email) {
		w.WriteHeader(http.StatusConflict)
		json.NewEncoder(w).Encode(SubscribeResponse{
			Success: false,
			Message: "Email already subscribed",
		})
		return
	}

	// Add new subscription
	subscription := NewsletterSubscription{
		Email:        email,
		SubscribedAt: time.Now(),
		IPAddress:    getClientIP(r),
	}

	data.Subscriptions = append(data.Subscriptions, subscription)

	// Save data
	if err := saveNewsletterData(data); err != nil {
		log.Printf("Error saving newsletter data: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(SubscribeResponse{
			Success: false,
			Message: "Failed to save subscription",
		})
		return
	}

	log.Printf("New newsletter subscription: %s", email)

	// Success response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(SubscribeResponse{
		Success: true,
		Message: "Successfully subscribed to newsletter",
	})
}

func main() {
	// Get port from environment variable or default to 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Newsletter API endpoint
	http.HandleFunc("/api/subscribe", subscribeHandler)

	// Create a custom file server handler
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Add CORS headers for development
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "*")

		// Add security headers
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "SAMEORIGIN")
		w.Header().Set("X-XSS-Protection", "1; mode=block")

		// Log the request
		log.Printf("Request: %s %s", r.Method, r.URL.Path)

		// Handle root path
		if r.URL.Path == "/" || r.URL.Path == "" {
			http.ServeFile(w, r, "index.html")
			return
		}

		// Clean the path and remove leading slash
		cleanPath := path.Clean(r.URL.Path)
		if strings.HasPrefix(cleanPath, "/") {
			cleanPath = cleanPath[1:]
		}

		// Log what file we're trying to serve
		log.Printf("Trying to serve file: %s", cleanPath)

		// Check if file exists
		if _, err := os.Stat(cleanPath); err != nil {
			log.Printf("File not found: %s, error: %v", cleanPath, err)
			// For HTML files in htmls directory, try to serve index.html as fallback
			if strings.HasPrefix(cleanPath, "htmls/") && strings.HasSuffix(cleanPath, ".html") {
				http.Error(w, "File not found", http.StatusNotFound)
				return
			}
			// For other paths, serve index.html (SPA fallback)
			http.ServeFile(w, r, "index.html")
			return
		}

		// Set proper content type based on file extension
		if strings.HasSuffix(cleanPath, ".html") {
			w.Header().Set("Content-Type", "text/html; charset=utf-8")
		} else if strings.HasSuffix(cleanPath, ".css") {
			w.Header().Set("Content-Type", "text/css")
		} else if strings.HasSuffix(cleanPath, ".js") {
			w.Header().Set("Content-Type", "application/javascript")
		}

		// Serve the file
		http.ServeFile(w, r, cleanPath)
	})

	// Health check endpoint
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
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

	// Railway requires binding to 0.0.0.0
	addr := "0.0.0.0:" + port
	log.Printf("Starting server on %s", addr)
	if err := http.ListenAndServe(addr, nil); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
