# Use the official Golang image to create a build artifact
FROM golang:1.23 as builder

# Set the working directory
WORKDIR /app

# Copy and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the source code
COPY . .

# Build the application
RUN GOOS=linux GOARCH=amd64 go build -o main .

# Use a minimal base image for the final artifact
FROM alpine:latest

# Set the working directory
WORKDIR /app

# Copy the built binary from the builder
COPY --from=builder /app/main .

# Expose the port
EXPOSE 8080

RUN ls -l /app

# Run the binary
CMD ["/app/main"]
