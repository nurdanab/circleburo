# Multi-stage build for optimized production frontend
FROM node:20-alpine AS builder

# Install build dependencies for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat

WORKDIR /app

# Set npm configuration to increase memory and timeout
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Copy package.json first
COPY package.json ./

# Remove package-lock.json to avoid issues and install dependencies
# Use ci=false to avoid strict lockfile requirements
RUN npm cache clean --force && \
    npm install --legacy-peer-deps --no-audit --no-fund --loglevel=verbose

# Verify critical dependencies
RUN test -f node_modules/.bin/vite || (echo "ERROR: Vite not installed!" && exit 1)

# Copy source code
COPY . .

# Build the application
RUN npm run build:no-prerender

# Run prerender separately (if it fails, we still have the build)
RUN npm run prerender || echo "Prerender failed, but continuing with build"

# Verify dist directory exists
RUN test -d dist || (echo "ERROR: dist directory not created!" && exit 1)

# Production stage - use nginx to serve static files
FROM nginx:alpine

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create health check endpoint
RUN echo "OK" > /usr/share/nginx/html/health

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/health || exit 1

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
