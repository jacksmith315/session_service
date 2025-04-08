#!/bin/bash

# Function to start a portal
start_portal() {
    local portal=$1
    echo "Starting $portal..."
    cd "$portal" || exit
    npm run dev &
    cd ..
}

# Kill background processes on script exit
trap 'kill $(jobs -p)' EXIT

# Start each portal
start_portal "portal-a"
echo "Portal A starting on http://localhost:3001"

start_portal "portal-b"
echo "Portal B starting on http://localhost:3002"

start_portal "portal-c"
echo "Portal C starting on http://localhost:3003"

echo "All portals are starting..."
echo "Access them at:"
echo "  Portal A: http://localhost:3001"
echo "  Portal B: http://localhost:3002"
echo "  Portal C: http://localhost:3003"

# Keep script running
wait