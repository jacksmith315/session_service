# Use an official Node.js runtime as a parent image (using Node 18 for broader compatibility)
FROM node:18-alpine AS base

# Set the working directory in the container
WORKDIR /usr/src/app

# --- Build Stage ---
FROM base AS build

# Install build dependencies only (reduces final image size)
COPY package*.json ./
RUN npm install --only=production

# Copy application source code
COPY . .

# --- Production Stage ---
FROM base

# Copy installed dependencies from build stage
COPY --from=build /usr/src/app/node_modules ./node_modules

# Copy application source code again (this seems redundant, let's copy from build)
COPY --from=build /usr/src/app .

# Expose the port the app runs on (read from environment or default to 3000)
# Note: EXPOSE doesn't actually publish the port, docker-compose will handle that.
EXPOSE ${PORT:-3000}

# Define the command to run the app
# Use node directly for slightly faster startup and better signal handling
CMD [ "node", "src/server.js" ]
