# Build stage
FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY go.mod go.sum* ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Final stage
FROM alpine:latest

# Install ca-certificates for HTTPS requests
RUN apk --no-cache add ca-certificates

WORKDIR /app

# Copy the binary and static files
COPY --from=builder /app/main .
COPY --from=builder /app/*.html ./
COPY --from=builder /app/htmls ./htmls/

EXPOSE 8080

CMD ["./main"]
