#!/bin/bash
# American Pizza - Docker Test Script
# Automatically builds, runs, and verifies all containers

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🍕 American Pizza - Docker Test Script${NC}"
echo -e "${BLUE}=======================================${NC}"
echo ""

# Function to print status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

print_status "Docker and Docker Compose are installed"

# Check if .env exists
if [ ! -f .env ]; then
    print_info ".env file not found. Creating from env.example..."
    if [ -f env.example ]; then
        cp env.example .env
        print_info "Created .env file. Please edit it with your configuration."
        print_info "Continuing with default values..."
    else
        print_error "env.example not found. Cannot create .env file."
        exit 1
    fi
fi

# Step 1: Stop and remove existing containers
echo ""
print_info "Step 1: Cleaning up existing containers..."
docker-compose down -v 2>/dev/null || true
print_status "Cleanup complete"

# Step 2: Build containers
echo ""
print_info "Step 2: Building containers..."
if docker-compose build --no-cache; then
    print_status "Build successful"
else
    print_error "Build failed"
    exit 1
fi

# Step 3: Start containers
echo ""
print_info "Step 3: Starting containers..."
if docker-compose up -d; then
    print_status "Containers started"
else
    print_error "Failed to start containers"
    exit 1
fi

# Step 4: Wait for services to be ready
echo ""
print_info "Step 4: Waiting for services to be healthy (this may take up to 60 seconds)..."
MAX_WAIT=60
WAIT_COUNT=0
ALL_HEALTHY=false

while [ $WAIT_COUNT -lt $MAX_WAIT ]; do
    sleep 2
    WAIT_COUNT=$((WAIT_COUNT + 2))
    
    # Check MongoDB
    MONGO_STATUS=$(docker-compose ps mongodb | grep -o "healthy\|unhealthy" | head -1 || echo "starting")
    
    # Check Backend
    BACKEND_STATUS=$(docker-compose ps backend | grep -o "healthy\|unhealthy" | head -1 || echo "starting")
    
    # Check Frontend
    FRONTEND_STATUS=$(docker-compose ps frontend | grep -o "healthy\|unhealthy" | head -1 || echo "starting")
    
    if [ "$MONGO_STATUS" = "healthy" ] && [ "$BACKEND_STATUS" = "healthy" ] && [ "$FRONTEND_STATUS" = "healthy" ]; then
        ALL_HEALTHY=true
        break
    fi
    
    echo -ne "\r⏳ Waiting... (${WAIT_COUNT}s/${MAX_WAIT}s) - MongoDB: $MONGO_STATUS, Backend: $BACKEND_STATUS, Frontend: $FRONTEND_STATUS"
done

echo ""

if [ "$ALL_HEALTHY" = true ]; then
    print_status "All services are healthy"
else
    print_error "Services did not become healthy within ${MAX_WAIT} seconds"
    print_info "Checking service status..."
    docker-compose ps
fi

# Step 5: Check service status
echo ""
print_info "Step 5: Checking service status..."
docker-compose ps

# Step 6: Check logs for errors
echo ""
print_info "Step 6: Checking logs for errors..."

# Check MongoDB logs
echo ""
print_info "MongoDB logs (last 10 lines):"
docker-compose logs --tail=10 mongodb | grep -i "error\|fatal\|failed" || print_status "No errors in MongoDB logs"

# Check Backend logs
echo ""
print_info "Backend logs (last 10 lines):"
BACKEND_ERRORS=$(docker-compose logs --tail=20 backend | grep -i "error\|fatal\|failed" || true)
if [ -z "$BACKEND_ERRORS" ]; then
    print_status "No errors in backend logs"
else
    print_error "Errors found in backend logs:"
    echo "$BACKEND_ERRORS"
fi

# Check Frontend logs
echo ""
print_info "Frontend logs (last 10 lines):"
docker-compose logs --tail=10 frontend | grep -i "error\|fatal\|failed" || print_status "No errors in frontend logs"

# Step 7: Test Backend Health Endpoint
echo ""
print_info "Step 7: Testing backend health endpoint..."

BACKEND_PORT=$(grep "BACKEND_PORT" .env 2>/dev/null | cut -d '=' -f2 | tr -d ' ' || echo "5000")
HEALTH_URL="http://localhost:${BACKEND_PORT}/health"

if command -v curl &> /dev/null; then
    HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" || echo "000")
    if [ "$HEALTH_RESPONSE" = "200" ]; then
        print_status "Backend health check passed (HTTP $HEALTH_RESPONSE)"
        print_info "Health check response:"
        curl -s "$HEALTH_URL" | python3 -m json.tool 2>/dev/null || curl -s "$HEALTH_URL"
    else
        print_error "Backend health check failed (HTTP $HEALTH_RESPONSE)"
        print_info "Attempting to fetch response..."
        curl -v "$HEALTH_URL" || true
    fi
elif command -v wget &> /dev/null; then
    if wget -q -O - "$HEALTH_URL" > /dev/null 2>&1; then
        print_status "Backend health check passed"
        print_info "Health check response:"
        wget -q -O - "$HEALTH_URL" | python3 -m json.tool 2>/dev/null || wget -q -O - "$HEALTH_URL"
    else
        print_error "Backend health check failed"
    fi
else
    print_info "curl/wget not available. Skipping HTTP health check."
    print_info "Please manually check: $HEALTH_URL"
fi

# Step 8: Test Frontend
echo ""
print_info "Step 8: Testing frontend..."

FRONTEND_PORT=$(grep "FRONTEND_PORT" .env 2>/dev/null | cut -d '=' -f2 | tr -d ' ' || echo "80")
FRONTEND_URL="http://localhost:${FRONTEND_PORT}"

if command -v curl &> /dev/null; then
    FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL" || echo "000")
    if [ "$FRONTEND_RESPONSE" = "200" ]; then
        print_status "Frontend is accessible (HTTP $FRONTEND_RESPONSE)"
    else
        print_error "Frontend check failed (HTTP $FRONTEND_RESPONSE)"
    fi
elif command -v wget &> /dev/null; then
    if wget -q -O - "$FRONTEND_URL" > /dev/null 2>&1; then
        print_status "Frontend is accessible"
    else
        print_error "Frontend check failed"
    fi
else
    print_info "curl/wget not available. Skipping HTTP frontend check."
    print_info "Please manually check: $FRONTEND_URL"
fi

# Step 9: Test API Endpoint
echo ""
print_info "Step 9: Testing API endpoint..."

API_URL="http://localhost:${BACKEND_PORT}/api"

if command -v curl &> /dev/null; then
    API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL" || echo "000")
    if [ "$API_RESPONSE" = "200" ]; then
        print_status "API endpoint is accessible (HTTP $API_RESPONSE)"
        print_info "API response:"
        curl -s "$API_URL" | python3 -m json.tool 2>/dev/null || curl -s "$API_URL"
    else
        print_error "API endpoint check failed (HTTP $API_RESPONSE)"
    fi
elif command -v wget &> /dev/null; then
    if wget -q -O - "$API_URL" > /dev/null 2>&1; then
        print_status "API endpoint is accessible"
        print_info "API response:"
        wget -q -O - "$API_URL" | python3 -m json.tool 2>/dev/null || wget -q -O - "$API_URL"
    else
        print_error "API endpoint check failed"
    fi
else
    print_info "curl/wget not available. Skipping API check."
    print_info "Please manually check: $API_URL"
fi

# Step 10: Summary
echo ""
echo -e "${BLUE}=======================================${NC}"
echo -e "${BLUE}📊 Test Summary${NC}"
echo -e "${BLUE}=======================================${NC}"
echo ""

# Service status summary
echo "Service Status:"
docker-compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "Access URLs:"
echo -e "  ${GREEN}Frontend:${NC}  http://localhost:${FRONTEND_PORT}"
echo -e "  ${GREEN}Backend API:${NC}  http://localhost:${BACKEND_PORT}/api"
echo -e "  ${GREEN}Backend Health:${NC}  http://localhost:${BACKEND_PORT}/health"
echo -e "  ${GREEN}MongoDB:${NC}  localhost:${MONGO_PORT:-27017}"

echo ""
echo "Useful Commands:"
echo -e "  ${YELLOW}View logs:${NC}     docker-compose logs -f"
echo -e "  ${YELLOW}Stop services:${NC} docker-compose down"
echo -e "  ${YELLOW}Restart:${NC}       docker-compose restart"
echo ""

if [ "$ALL_HEALTHY" = true ]; then
    print_status "All tests completed successfully! 🎉"
    exit 0
else
    print_error "Some tests failed. Please check the logs above."
    exit 1
fi

