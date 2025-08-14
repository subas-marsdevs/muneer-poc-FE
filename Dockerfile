# Use Node.js 18 as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies to reduce image size
RUN npm prune --production

# Install serve to run the built application
RUN npm install -g serve

# Expose port 5173
EXPOSE 5173

# Start the application
CMD ["serve", "-s", "dist", "-l", "5173"] 