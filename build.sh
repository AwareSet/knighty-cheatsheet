#!/bin/bash
set -e

echo "=== Dokploy Build Script ==="
echo "Current directory: $(pwd)"
echo "Files present:"
ls -la

echo "Building Go application..."
go build -o main main.minimal.go

echo "Build completed successfully!"
echo "Binary info:"
ls -la main
file main

echo "Ready to start with: ./main"
