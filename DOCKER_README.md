# Docker Setup for Muneer POC Frontend

This project has been dockerized using Docker Compose for easy deployment and development.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. **Build and run the application:**
   ```bash
   docker-compose up --build
   ```

2. **Run in detached mode:**
   ```bash
   docker-compose up -d --build
   ```

3. **Stop the application:**
   ```bash
   docker-compose down
   ```

## Configuration

- **Frontend URL:** http://localhost:5173
- **Backend API URL:** https://api-muneer.marsdevs.com
- **WebSocket URL:** wss://api-muneer.marsdevs.com/chats/ws

## Environment Variables

The following environment variables are automatically set in the Docker container:

- `VITE_API_URL`: Backend API endpoint
- `VITE_WS_URL`: WebSocket endpoint for real-time communication

## Development

For development with hot reload, you can modify the Dockerfile to use the dev server instead of the production build:

```dockerfile
# Replace the CMD line with:
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

## Troubleshooting

- If you encounter permission issues, ensure Docker has proper permissions
- Check container logs: `docker-compose logs frontend`
- Rebuild if dependencies change: `docker-compose up --build --force-recreate` 