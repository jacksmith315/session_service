#!/bin/bash

# Colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -i :$port > /dev/null; then
        echo "${RED}Error: Port $port is already in use${NC}"
        return 1
    fi
    return 0
}

# Function to wait for a service to be ready
wait_for_service() {
    local port=$1
    local service=$2
    local max_attempts=30
    local attempt=1

    echo -n "${YELLOW}Waiting for $service to be ready"
    while ! curl -s http://localhost:$port > /dev/null; do
        if [ $attempt -ge $max_attempts ]; then
            echo "${RED}\n$service failed to start after $max_attempts attempts${NC}"
            return 1
        fi
        echo -n "."
        sleep 1
        ((attempt++))
    done
    echo "${GREEN}\n$service is ready!${NC}"
    return 0
}

# Kill all background processes on script exit
cleanup() {
    echo "${YELLOW}\nShutting down all services...${NC}"
    kill $(jobs -p) 2>/dev/null
    exit 0
}

trap cleanup EXIT INT TERM

# Check required ports
required_ports=(3000 3001 3002 3003)
for port in "${required_ports[@]}"; do
    if ! check_port $port; then
        exit 1
    fi
done

# Start Redis if not running (uncomment if needed)
# if ! pgrep redis-server > /dev/null; then
#     echo "${YELLOW}Starting Redis...${NC}"
#     redis-server &
#     sleep 2
# fi

# Start the session service
echo "${BLUE}Starting Session Service on port 3000...${NC}"
npm run dev &

# Wait for session service to be ready
wait_for_service 3000 "Session Service"

# Function to start a portal
start_portal() {
    local portal=$1
    local port=$2
    echo "${BLUE}Starting $portal on port $port...${NC}"
    cd "$portal" || exit
    npm run dev &
    wait_for_service $port "$portal"
    cd ..
}

# Start all portals
start_portal "portal-a" 3001
start_portal "portal-b" 3002
start_portal "portal-c" 3003

echo "${GREEN}All services are running!${NC}"
echo "${BLUE}Access the services at:${NC}"
echo "  Session Service: http://localhost:3000"
echo "  Portal A:        http://localhost:3001"
echo "  Portal B:        http://localhost:3002"
echo "  Portal C:        http://localhost:3003"
echo
echo "${YELLOW}Press Ctrl+C to stop all services${NC}"

# Keep script running
wait