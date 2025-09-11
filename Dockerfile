# KnightyApp Independent Dockerfile
# Multi-stage build for React + Go application

# Stage 1: Build React frontend
FROM node:18-alpine AS react-builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source and build
COPY src/ ./src/
COPY public/ ./public/
RUN npm run build

# Stage 2: Build Go backend
FROM golang:1.23-alpine AS go-builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache git ca-certificates tzdata

# Copy Go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy Go source
COPY *.go ./

# Build the binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -a -installsuffix cgo \
    -ldflags="-w -s" \
    -o main .

# Stage 3: Final production image
FROM alpine:latest

# Install runtime dependencies
RUN apk --no-cache add ca-certificates tzdata

# Create non-root user
RUN addgroup -g 1001 -S knighty && \
    adduser -S knighty -u 1001

WORKDIR /app

# Copy binary from go-builder
COPY --from=go-builder /app/main .

# Copy React build from react-builder to root
COPY --from=react-builder /app/build ./

# Copy static files
COPY public/htmls ./htmls/

# Set ownership
RUN chown -R knighty:knighty /app

# Switch to non-root user
USER knighty

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Expose port
EXPOSE 8080

# Set environment
ENV PORT=8080
ENV NODE_ENV=production

# Start the application
CMD ["./main"]
