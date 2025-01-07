# Use the Node.js image to build the frontend
FROM node:18 as builder

# Set the working directory
WORKDIR /app

# Copy the package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the source code
COPY . .

# Build the frontend
RUN npm run build

# Use a minimal base image to serve the frontend
FROM nginx:alpine

# Copy the built frontend files to the Nginx web directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
