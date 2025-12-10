#!/bin/bash

# Circle Buro - Frontend Deployment Script
# This script automates the deployment of the frontend to the production server

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO_URL="https://github.com/YOUR_USERNAME/circle-buro.git"  # Update with your repo URL
BRANCH="main"
SERVER_DIR="$HOME/server"
FRONTEND_DIR="$SERVER_DIR/frontend"
BACKUP_DIR="$SERVER_DIR/backups"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Circle Buro - Frontend Deployment${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Function to print colored messages
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check if script is run on the server
if [ ! -d "$SERVER_DIR" ]; then
    print_error "Server directory not found. Are you on the right server?"
    exit 1
fi

# Step 1: Create backup directory if it doesn't exist
print_info "Step 1: Preparing backup directory..."
mkdir -p "$BACKUP_DIR"
print_status "Backup directory ready"

# Step 2: Clone/Update repository
print_info "Step 2: Fetching latest code..."

if [ ! -d "$FRONTEND_DIR/.git" ]; then
    print_info "Cloning repository for the first time..."

    # Clone from your local machine or GitHub
    # For now, we'll create the directory structure
    mkdir -p "$FRONTEND_DIR"

    print_warning "Please copy your frontend code to $FRONTEND_DIR"
    print_info "Required files:"
    echo "  - package.json"
    echo "  - package-lock.json"
    echo "  - vite.config.js"
    echo "  - index.html"
    echo "  - src/"
    echo "  - public/"
    echo "  - Dockerfile"
    echo "  - nginx.conf"
    echo "  - .dockerignore"

    read -p "Press Enter once you've copied the files..."
else
    print_info "Updating existing repository..."
    cd "$FRONTEND_DIR"
    git fetch origin
    git reset --hard origin/$BRANCH
    print_status "Repository updated"
fi

# Step 3: Verify required files exist
print_info "Step 3: Verifying required files..."
REQUIRED_FILES=("package.json" "vite.config.js" "index.html" "Dockerfile" "nginx.conf")
MISSING_FILES=()

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$FRONTEND_DIR/$file" ]; then
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -ne 0 ]; then
    print_error "Missing required files:"
    printf '%s\n' "${MISSING_FILES[@]}"
    exit 1
fi

print_status "All required files present"

# Step 4: Check if frontend container is running
print_info "Step 4: Checking container status..."
if docker ps | grep -q "circle-buro-frontend"; then
    print_info "Creating backup of current deployment..."
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_NAME="frontend_backup_$TIMESTAMP"

    # Create backup
    docker commit circle-buro-frontend "$BACKUP_NAME" 2>/dev/null || true
    print_status "Backup created: $BACKUP_NAME"
fi

# Step 5: Build and deploy
print_info "Step 5: Building and deploying frontend..."

cd "$SERVER_DIR"

# Stop and remove old frontend container
if docker ps -a | grep -q "circle-buro-frontend"; then
    print_info "Stopping old frontend container..."
    docker-compose stop frontend 2>/dev/null || docker stop circle-buro-frontend 2>/dev/null || true
    docker-compose rm -f frontend 2>/dev/null || docker rm -f circle-buro-frontend 2>/dev/null || true
    print_status "Old container removed"
fi

# Build and start new frontend container
print_info "Building new frontend image (this may take a few minutes)..."
docker-compose build --no-cache frontend

print_info "Starting frontend container..."
docker-compose up -d frontend

# Wait for container to be healthy
print_info "Waiting for frontend to be ready..."
RETRIES=30
HEALTHY=false

for i in $(seq 1 $RETRIES); do
    if docker ps | grep -q "circle-buro-frontend.*healthy\|circle-buro-frontend.*Up"; then
        HEALTHY=true
        break
    fi
    echo -n "."
    sleep 2
done
echo ""

if [ "$HEALTHY" = false ]; then
    print_error "Frontend container failed to start properly"
    print_info "Check logs with: docker logs circle-buro-frontend"
    exit 1
fi

print_status "Frontend container is running"

# Step 6: Reload Nginx
print_info "Step 6: Reloading Nginx configuration..."
if docker ps | grep -q "circle-buro-nginx"; then
    docker exec circle-buro-nginx nginx -t && \
    docker exec circle-buro-nginx nginx -s reload
    print_status "Nginx reloaded"
else
    print_warning "Nginx container not running, skipping reload"
fi

# Step 7: Verify deployment
print_info "Step 7: Verifying deployment..."

# Test frontend health endpoint
if docker exec circle-buro-frontend wget -q -O- http://localhost:80/health > /dev/null 2>&1; then
    print_status "Frontend health check passed"
else
    print_warning "Frontend health check failed"
fi

# Step 8: Cleanup old images
print_info "Step 8: Cleaning up old images..."
docker image prune -f > /dev/null 2>&1 || true
print_status "Cleanup complete"

# Summary
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
print_info "Frontend URL: https://circle-buro.kz"
print_info "API URL: https://api.circleburo.kz"
echo ""
print_info "Useful commands:"
echo "  - View logs: docker logs -f circle-buro-frontend"
echo "  - Restart: docker-compose restart frontend"
echo "  - Status: docker-compose ps"
echo ""
print_warning "Don't forget to:"
echo "  1. Update DNS records in Cloudflare to point to this server"
echo "  2. Configure SSL certificates if not already done"
echo "  3. Test the website thoroughly"
echo ""
