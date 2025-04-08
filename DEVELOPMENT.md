# Development Guide

This guide will help you set up and run the multi-portal session management system for development.

## System Overview

The system consists of:
1. **Session Service** (Port 3000): Central authentication and session management
2. **Portal A** (Port 3001): Main portal application
3. **Portal B** (Port 3002): Secondary portal application
4. **Portal C** (Port 3003): Tertiary portal application

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- PostgreSQL 12+ installed and running
- Redis server installed and running
- Git (for version control)

## Initial Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd session_service
   ```

2. **Install Dependencies**
   ```bash
   # Install session service dependencies
   npm install

   # Install portal dependencies
   cd portal-a && npm install
   cd ../portal-b && npm install
   cd ../portal-c && npm install
   cd ..
   ```

3. **Configure Environment Variables**
   ```bash
   # Copy example environment file
   cp .env.example .env

   # Edit .env with your configuration
   nano .env
   ```

4. **Initialize the Database**
   ```bash
   # Create the database
   createdb session_service

   # Run migrations
   npm run db:migrate
   ```

## Running the Development Environment

### Option 1: All-in-One Script (Recommended)
```bash
# Make the script executable
chmod +x start-dev.sh

# Start all services
./start-dev.sh
```

### Option 2: Manual Start
1. Start the session service:
   ```bash
   npm run dev
   ```

2. In a new terminal, start the portals:
   ```bash
   ./start-portals.sh
   ```

## Development Workflow

1. **Accessing the Applications**
   - Session Service: http://localhost:3000
   - Portal A: http://localhost:3001
   - Portal B: http://localhost:3002
   - Portal C: http://localhost:3003

2. **Testing Session Sharing**
   1. Open Portal A and log in
   2. Navigate to Portal B - you should still be logged in
   3. Navigate to Portal C - you should still be logged in
   4. Log out from any portal - you should be logged out from all

3. **Making Changes**
   - Session Service changes: Edit files in the `src` directory
   - Portal changes: Edit files in respective portal directories
   - Database changes: Create new migrations using `npx sequelize-cli migration:generate`

## Common Development Tasks

### Database Management
```bash
# Create a new migration
npm run db:migrate:create name-of-migration

# Run migrations
npm run db:migrate

# Undo last migration
npm run db:migrate:undo

# Undo all migrations
npm run db:migrate:undo:all
```

### Testing
```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

### API Testing
Use the provided Postman collection:
1. Import `session-service.postman_collection.json`
2. Import `session-service.postman_environment.json`
3. Set up environment variables
4. Run the requests

## Debugging

### Session Service
1. Access logs in `logs/` directory
2. Use the debug configuration in VS Code
3. Check Redis session data:
   ```bash
   redis-cli
   keys *
   ```

### Portal Applications
1. Use React Developer Tools in browser
2. Check browser console for errors
3. Use React component debugging

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check if ports are in use
   lsof -i :3000
   lsof -i :3001
   lsof -i :3002
   lsof -i :3003
   ```

2. **Database Connection Issues**
   ```bash
   # Check PostgreSQL status
   pg_isready
   ```

3. **Redis Connection Issues**
   ```bash
   # Check Redis status
   redis-cli ping
   ```

## Code Style and Conventions

1. **TypeScript**
   - Use strict mode
   - Define interfaces for all data structures
   - Use proper type annotations

2. **React Components**
   - Use functional components
   - Implement proper error boundaries
   - Follow React hooks best practices

3. **API Endpoints**
   - Follow RESTful conventions
   - Include proper error handling
   - Validate all inputs

## Security Considerations

1. **Development Environment**
   - Never commit `.env` files
   - Use strong passwords even in development
   - Keep dependencies updated

2. **Testing Security Features**
   - Test CSRF protection
   - Verify cookie security settings
   - Check authentication flows

## Contributing

1. Create a new branch for features
2. Follow the commit message convention
3. Submit pull requests with proper descriptions
4. Ensure all tests pass

## Additional Resources

- [Session Service API Documentation](./docs/api.md)
- [Database Schema](./docs/schema.md)
- [Security Guidelines](./docs/security.md)
- [Deployment Guide](./docs/deployment.md)

## Support

For development support:
- Create an issue in the repository
- Contact the development team
- Check the FAQ in the wiki