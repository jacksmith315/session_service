# Multi-Portal Session Testing Environment

This project demonstrates shared session management across multiple React portals using a centralized authentication service. It consists of three separate portals that allow users to maintain their authentication state while navigating between them.

## Project Structure

```
session_portals/
├── portal-a/          # Main portal (Port 3001)
├── portal-b/          # Secondary portal (Port 3002)
├── portal-c/          # Tertiary portal (Port 3003)
└── README.md         # This file
```

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- Running instance of the Session Service (on port 3000)

## Portal Information

| Portal    | URL                      | Description           | Port |
|-----------|--------------------------|----------------------|------|
| Portal A  | http://localhost:3001    | Main Portal         | 3001 |
| Portal B  | http://localhost:3002    | Secondary Portal    | 3002 |
| Portal C  | http://localhost:3003    | Tertiary Portal    | 3003 |

## Setup Instructions

1. First, ensure the Session Service is running:
   ```bash
   # In the session-service directory
   npm install
   npm run dev
   ```

2. Install dependencies for all portals:
   ```bash
   # In the session_portals directory
   cd portal-a && npm install
   cd ../portal-b && npm install
   cd ../portal-c && npm install
   ```

3. Start all portals:
   ```bash
   # Terminal 1 - Portal A
   cd portal-a
   npm run dev

   # Terminal 2 - Portal B
   cd portal-b
   npm run dev

   # Terminal 3 - Portal C
   cd portal-c
   npm run dev
   ```

## Testing the Session Sharing

1. Open Portal A in your browser: http://localhost:3001
2. Click the "Login" button and enter your credentials
3. After successful login, you should see your user information
4. Without logging out, navigate to Portal B: http://localhost:3002
5. You should still be authenticated, and your user information should be displayed
6. Navigate to Portal C: http://localhost:3003
7. Again, you should remain authenticated

## Features to Test

- [x] Single Sign-On (SSO) across all portals
- [x] Shared session management
- [x] Automatic session validation
- [x] Cross-portal navigation
- [x] Unified logout (logging out from one portal logs out from all)

## Common Test Scenarios

1. **Basic Session Sharing**
   - Login to Portal A
   - Navigate to Portal B and C
   - Verify authentication state is maintained

2. **Session Expiry**
   - Login to any portal
   - Wait for session to expire (24 hours by default)
   - Verify all portals recognize the expired session

3. **Unified Logout**
   - Login to Portal A
   - Navigate to Portal B
   - Logout from Portal B
   - Verify Portal A and C also log out

4. **Session Renewal**
   - Login to Portal A
   - Perform actions across portals
   - Verify session extends automatically

## Troubleshooting

1. **CORS Issues**
   - Ensure the Session Service has all portal URLs in its ALLOWED_ORIGINS
   - Check browser console for CORS-related errors

2. **Cookie Problems**
   - Verify cookies are being set correctly
   - Check if cookies are accessible across portals
   - Ensure same-origin policy isn't blocking cookie access

3. **Port Conflicts**
   - Make sure no other services are using ports 3001-3003
   - Check if all portals are running on their designated ports

## Development Notes

- Each portal uses Vite with React and TypeScript
- Session management is handled via HTTP-only cookies
- All portals communicate with the central Session Service
- Cross-Origin Resource Sharing (CORS) is properly configured
- TypeScript is used for better type safety and development experience

## Environment Variables

Each portal uses these environment variables:
```env
VITE_SESSION_SERVICE_URL=http://localhost:3000
VITE_PORTAL_NAME="Portal A/B/C"
```

## Security Considerations

- All session tokens are stored in HTTP-only cookies
- CSRF protection is enabled
- Secure cookie attributes in production
- No sensitive information stored in localStorage
- Regular session validation

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT