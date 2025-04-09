# Session Management Service

A secure session management service built with Node.js and Redis that enables shared authentication across multiple portals.

## Features

- Centralized session management with Redis
- JWT-based authentication
- Cross-origin resource sharing (CORS) support
- Rate limiting
- Security headers with Helmet
- Session validation and cleanup
- Cookie-based token storage for web clients
- API token support for non-web clients
- User management with profiles
- Portal management and access control
- User-Portal relationship tracking

## Prerequisites

- Node.js 16+
- Redis 6+
- PostgreSQL 12+
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment example file:
   ```bash
   cp .env.example .env
   ```
4. Update the environment variables in `.env`
5. Initialize the database:
   ```bash
   npx sequelize-cli db:migrate
   ```

## Configuration

Update the following variables in your `.env` file:

- `PORT`: Server port (default: 3000)
- `REDIS_URL`: Redis connection URL
- `SESSION_SECRET`: Secret for session encryption
- `JWT_SECRET`: Secret for JWT signing
- `ALLOWED_ORIGINS`: Comma-separated list of allowed portal origins
- `GOOGLE_CLIENT_ID`: Google OAuth client ID (if using Google authentication)
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret (if using Google authentication)
- `DATABASE_URL`: PostgreSQL connection URL

### Environment Variables Security

The service uses two types of environment files:
- `.env.example`: Template file with placeholder values (safe to commit)
- `.env`: Contains actual credentials (never commit to version control)

For production deployments:
- Use secure environment variable management
- Never commit sensitive credentials to version control
- Rotate secrets periodically
- Use different credentials for development and production

## Running the Service

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Docker Setup

The project can be run using Docker and Docker Compose, which provides containerized environments for the backend service, frontend portals, and required infrastructure.

### Prerequisites for Docker Setup

- Docker and Docker Compose installed on your system
- Git repository cloned locally

### Running with Docker Compose

1. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```
   This will build and start the following services:
   - Backend API server on port 3000
   - Portal A on port 3001
   - Portal B on port 3002
   - Portal C on port 3003
   - Redis for session management
   - PostgreSQL database

2. **Access the services:**
   - Backend API: http://localhost:3000
   - Portal A: http://localhost:3001
   - Portal B: http://localhost:3002
   - Portal C: http://localhost:3003

3. **Initialize the database (first time only):**
   After the containers are running, execute migrations:
   ```bash
   docker-compose exec backend npx sequelize-cli db:migrate
   ```

4. **Stop all services:**
   ```bash
   docker-compose down
   ```

5. **View logs:**
   ```bash
   docker-compose logs -f [service_name]
   ```
   Where `[service_name]` can be: backend, portal-a, portal-b, portal-c, redis, or postgres

### Docker Environment Configuration

Docker Compose uses environment variables from your `.env` file. Ensure that the following variables are set:

- `DATABASE_URL`: Will be automatically set for the containerized service
- `REDIS_URL`: Will be automatically set for the containerized service
- `ALLOWED_ORIGINS`: Should include `http://localhost:3001,http://localhost:3002,http://localhost:3003`

## API Endpoints

### Authentication

- `POST /auth/login`: Login with username and password
- `POST /auth/logout`: Logout and invalidate session
- `GET /auth/verify`: Verify current session

### Session Management

- `GET /session/status`: Get current session status
- `POST /session/extend`: Extend current session
- `DELETE /session/invalidate-all`: Invalidate all active sessions

### User Management

- `GET /users/profile`: Get current user's profile
- `PUT /users/profile`: Update user profile
- `PUT /users/change-password`: Change user password
- `GET /users`: List all users (admin only)

### Portal Management

- `POST /portals`: Create new portal (admin only)
- `GET /portals`: List all active portals
- `GET /portals/my`: List user's joined portals
- `POST /portals/join/:portalId`: Join a portal
- `DELETE /portals/leave/:portalId`: Leave a portal
- `PUT /portals/:portalId`: Update portal settings (admin only)

## Database Schema

### Users
- id (UUID)
- email (unique)
- password (hashed)
- firstName
- lastName
- status
- lastLogin
- googleId (for OAuth)

### Portals
- id (UUID)
- name
- domain (unique)
- status
- apiKey
- settings (JSON)

### UserPortals
- id (UUID)
- userId (FK)
- portalId (FK)
- role
- status
- lastAccess
- preferences (JSON)

## Integration with Portals

1. Configure the portal to send requests to this service for authentication
2. Include the JWT token in the Authorization header:
   ```
   Authorization: Bearer <token>
   ```
3. For web applications, the token will be automatically handled via cookies

## Security Considerations

- All endpoints are rate-limited
- Sessions expire after 24 hours (configurable)
- Secure cookie settings in production
- CORS protection
- HTTP security headers
- Redis session storage with TTL
- OAuth credentials are securely managed
- Environment variables are properly segregated
- Secrets are never committed to version control

### Security Best Practices

1. **Environment Variables**
   - Keep `.env` file out of version control
   - Use different credentials for development and production
   - Rotate secrets regularly
   - Use strong, unique values for secrets

2. **OAuth Security**
   - Store client secrets securely
   - Use environment variables for credentials
   - Implement proper OAuth flow with state parameter
   - Validate OAuth tokens on the server side

3. **Production Deployment**
   - Use secure secret management services
   - Enable HTTPS only
   - Set secure and HTTP-only cookie flags
   - Configure CORS properly
   - Monitor for suspicious activities

4. **Development Security**
   - Never commit real credentials
   - Use `.env.example` for templates
   - Keep development credentials separate
   - Regularly audit dependencies

## License

MIT