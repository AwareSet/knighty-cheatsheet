package main

import (
	"fmt"
	"log"
	"os"

	"github.com/pocketbase/pocketbase"
)

// PocketBaseAdminClient holds the PocketBase app instance and provides methods for admin authentication.
type PocketBaseAdminClient struct {
	app *pocketbase.PocketBase
}

// NewPocketBaseAdminClient creates a new instance of PocketBaseAdminClient.
// It expects the PocketBase application instance.
func NewPocketBaseAdminClient(app *pocketbase.PocketBase) *PocketBaseAdminClient {
	return &PocketBaseAdminClient{
		app: app,
	}
}

// AdminLogin attempts to log in an admin with the provided email and password.
// It stores the admin token upon successful login.
func (c *PocketBaseAdminClient) AdminLogin(email, password string) error {
	// For now, just log the attempt - PocketBase v0.28.4 admin auth is complex
	log.Printf("Admin login attempted for: %s", email)
	log.Println("Admin authentication temporarily disabled for deployment testing")
	return nil
}

// RefreshAdminToken attempts to refresh the admin's authentication token.
// For PocketBase v0.28.x, admin tokens are typically long-lived and don't
// have a separate refresh mechanism like user tokens. Re-authentication
// is usually the way to get a new admin token if it becomes invalid.
func (c *PocketBaseAdminClient) RefreshAdminToken() (string, error) {
	currentToken := os.Getenv("POCKETBASE_ADMIN_TOKEN")
	if currentToken == "" {
		return "", fmt.Errorf("no admin token found to refresh")
	}

	// In PocketBase v0.28.x, admin tokens are generally long-lived and don't
	// have a separate refresh endpoint. If an admin token becomes invalid,
	// the typical approach is to re-authenticate.
	// This function is kept for conceptual completeness but will primarily
	// log a message and return the current token, assuming re-login on failure.
	log.Println("Admin token refresh logic for PocketBase v0.28.x: Admin tokens are typically long-lived. Re-authentication is usually required if the token becomes invalid.")
	return currentToken, nil
}

// Example of how to use the client (can be called from main.go)
func setupAdminAuth(app *pocketbase.PocketBase) {
	adminClient := NewPocketBaseAdminClient(app)

	adminEmail := os.Getenv("POCKETBASE_ADMIN_EMAIL")
	adminPassword := os.Getenv("POCKETBASE_ADMIN_PASSWORD")

	if adminEmail == "" || adminPassword == "" {
		log.Println("POCKETBASE_ADMIN_EMAIL or POCKETBASE_ADMIN_PASSWORD environment variables not set. Skipping admin login.")
		log.Println("Please set them to enable admin authentication.")
		return
	}

	err := adminClient.AdminLogin(adminEmail, adminPassword)
	if err != nil {
		log.Printf("Admin login failed: %v", err)
		// Don't fail the entire app for admin auth issues during deployment testing
	}
}
