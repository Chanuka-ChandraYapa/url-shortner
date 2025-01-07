# Use the official Node.js image as the base image
FROM node:18-alpine as builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code
COPY . .

# Expose the port that the application runs on
EXPOSE 8080

# Command to run the Node.js application
CMD ["node", "index.js"]
