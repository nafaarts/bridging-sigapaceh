I will create a Node.js + TypeScript application wrapped in Docker to act as a bridging proxy. This service will forward POST requests to the destination API while ignoring SSL certificate validation errors.

### Project Setup
1.  **Initialize Project**: Create `package.json` and configure dependencies.
2.  **Dependencies**:
    -   `express`: Web server framework.
    -   `axios`: HTTP client for forwarding requests.
    -   `dotenv`: Environment variable management.
    -   `cors`: Cross-Origin Resource Sharing support.
    -   `typescript`, `ts-node`, `nodemon`: Development tools.

### Implementation Details
1.  **Server (`src/index.ts`)**:
    -   Set up an Express server.
    -   Create a POST endpoint (e.g., `/bencana/korban` to match the target or a generic `/proxy`).
    -   **SSL Bypass**: Configure `axios` with an `https.Agent` setting `rejectUnauthorized: false`. This is the key to fixing the "certificate expired" issue.
    -   **Forwarding**: Relay the body and relevant headers from the incoming request to `https://aceh.sigap.latih.id/bencana/korban`.
    -   **Response**: Send the target API's response back to the client.

### Docker Configuration
1.  **Dockerfile**:
    -   Use a lightweight Node.js image (e.g., `node:18-alpine`).
    -   Build the TypeScript code.
    -   Expose the application port.
2.  **docker-compose.yml**:
    -   Define the service.
    -   Map ports (e.g., 3000:3000).
    -   Set environment variables.

### Verification
1.  Start the service using Docker.
2.  Send a test POST request to the local bridge.
3.  Verify it successfully gets a response from the Sigap API (bypassing the SSL error).