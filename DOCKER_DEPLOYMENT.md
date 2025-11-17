# Docker Deployment Guide - American Pizza

This guide explains how to deploy the American Pizza application using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 2GB of free disk space

## Quick Start

1. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file** with your configuration:
   ```env
   # MongoDB
   MONGO_ROOT_USERNAME=admin
   MONGO_ROOT_PASSWORD=your-secure-password
   MONGO_DATABASE=american_pizza
   
   # Backend
   JWT_SECRET=your-super-secret-jwt-key
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   FRONTEND_URL=http://localhost:80
   
   # Email (optional)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

3. **Build and start all services:**
   ```bash
   docker-compose up -d --build
   ```

4. **Check service status:**
   ```bash
   docker-compose ps
   ```

5. **View logs:**
   ```bash
   docker-compose logs -f
   ```

6. **Access the application:**
   - Frontend: http://localhost:80
   - Backend API: http://localhost:5000/api
   - Backend Health: http://localhost:5000/health

## Environment Variables

### Required Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_ROOT_USERNAME` | MongoDB root username | `admin` |
| `MONGO_ROOT_PASSWORD` | MongoDB root password | `changeme` |
| `MONGO_DATABASE` | Database name | `american_pizza` |
| `JWT_SECRET` | JWT signing secret | (must be set) |
| `VITE_API_URL` | Frontend API URL | `http://localhost:5000/api` |
| `VITE_SOCKET_URL` | Frontend Socket.io URL | `http://localhost:5000` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:80` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_PORT` | MongoDB exposed port | `27017` |
| `BACKEND_PORT` | Backend exposed port | `5000` |
| `FRONTEND_PORT` | Frontend exposed port | `80` |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USER` | SMTP username | (empty) |
| `SMTP_PASS` | SMTP password | (empty) |
| `SMTP_FROM` | Email sender address | `noreply@americanpizza.com` |

## Architecture

```
┌─────────────┐
│   NGINX     │ Port 80 (Frontend)
│  (Frontend) │
└──────┬──────┘
       │
       │ HTTP Requests
       │
┌──────▼──────┐
│   Express   │ Port 5000 (Backend API)
│  (Backend)  │
└──────┬──────┘
       │
       │ MongoDB Connection
       │
┌──────▼──────┐
│  MongoDB    │ Port 27017 (Database)
│  (Database) │
└─────────────┘
```

## Services

### Frontend (NGINX)
- **Container:** `american-pizza-frontend`
- **Port:** 80
- **Build:** Vite build + NGINX Alpine
- **Health Check:** HTTP GET on `/`

### Backend (Express)
- **Container:** `american-pizza-backend`
- **Port:** 5000
- **Build:** Node.js 18 Alpine
- **Health Check:** HTTP GET on `/health`
- **Volumes:** `backend_uploads` (for image uploads)

### MongoDB
- **Container:** `american-pizza-mongodb`
- **Port:** 27017
- **Image:** mongo:7.0
- **Volumes:** `mongodb_data`, `mongodb_config`
- **Health Check:** MongoDB ping command

## Docker Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### Rebuild Services
```bash
docker-compose up -d --build
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Execute Commands in Containers
```bash
# Backend shell
docker-compose exec backend sh

# MongoDB shell
docker-compose exec mongodb mongosh -u admin -p changeme

# Frontend shell
docker-compose exec frontend sh
```

### Create Admin User
```bash
docker-compose exec backend node scripts/createAdmin.js
```

### Restart a Service
```bash
docker-compose restart backend
```

### Remove Everything (including volumes)
```bash
docker-compose down -v
```

## Production Deployment

### 1. Update Environment Variables

Create a `.env` file with production values:

```env
NODE_ENV=production
MONGO_ROOT_PASSWORD=strong-production-password
JWT_SECRET=very-long-random-secret-key
VITE_API_URL=https://api.yourdomain.com/api
VITE_SOCKET_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

### 2. Use Docker Secrets (Recommended)

For sensitive data, use Docker secrets or environment files:

```bash
# Create secrets file
echo "your-jwt-secret" | docker secret create jwt_secret -
echo "your-mongo-password" | docker secret create mongo_password -
```

### 3. Enable NGINX API Proxy (Optional)

If you want to proxy API calls through NGINX, uncomment the proxy sections in `frontend/nginx.conf`:

```nginx
location /api {
    proxy_pass http://backend:5000;
    # ... proxy settings
}
```

Then update `VITE_API_URL` to use relative paths:
```env
VITE_API_URL=/api
```

### 4. Use Reverse Proxy (Recommended for Production)

For production, use a reverse proxy (Traefik, Caddy, or NGINX) in front of Docker:

```yaml
# Example: Traefik labels in docker-compose.yml
services:
  frontend:
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.frontend.rule=Host(`yourdomain.com`)"
      - "traefik.http.services.frontend.loadbalancer.server.port=80"
```

### 5. SSL/TLS Certificates

Use Let's Encrypt or your SSL provider:

```bash
# With Traefik
labels:
  - "traefik.http.routers.frontend.tls.certresolver=letsencrypt"
```

## Troubleshooting

### Backend can't connect to MongoDB
- Check MongoDB health: `docker-compose ps mongodb`
- Verify connection string in backend logs
- Ensure MongoDB is healthy before backend starts

### Frontend can't reach backend
- Check `VITE_API_URL` in `.env` matches your backend URL
- Verify backend is running: `docker-compose ps backend`
- Check browser console for CORS errors
- Ensure `FRONTEND_URL` in backend matches frontend URL

### Images not loading
- Check `backend_uploads` volume exists: `docker volume ls`
- Verify uploads directory permissions
- Check backend logs for upload errors

### Port conflicts
- Change ports in `.env`:
  ```env
  FRONTEND_PORT=8080
  BACKEND_PORT=5001
  MONGO_PORT=27018
  ```

### Rebuild after code changes
```bash
# Rebuild specific service
docker-compose build frontend
docker-compose up -d frontend

# Rebuild all
docker-compose up -d --build
```

## Data Persistence

Data is persisted in Docker volumes:
- `mongodb_data`: MongoDB database files
- `mongodb_config`: MongoDB configuration
- `backend_uploads`: Uploaded product/offer images

To backup:
```bash
docker run --rm -v american-pizza_mongodb_data:/data -v $(pwd):/backup alpine tar czf /backup/mongodb-backup.tar.gz /data
```

To restore:
```bash
docker run --rm -v american-pizza_mongodb_data:/data -v $(pwd):/backup alpine sh -c "cd /data && tar xzf /backup/mongodb-backup.tar.gz"
```

## Monitoring

### Health Checks
All services have health checks. View status:
```bash
docker-compose ps
```

### Resource Usage
```bash
docker stats
```

### Service Logs
```bash
docker-compose logs --tail=100 -f
```

## Rebuilding After Changes

See `REBUILD_INSTRUCTIONS.md` for detailed rebuild instructions.

**Quick rebuild commands:**
```bash
# Rebuild specific service
docker-compose build backend
docker-compose up -d backend

# Rebuild all services
docker-compose up -d --build

# Clean rebuild (no cache)
docker-compose build --no-cache
docker-compose up -d
```

**Test after rebuild:**
```bash
# Linux/Mac
./docker-test.sh

# Windows
.\docker-test.ps1
```

## Development Mode

For development with hot reload:

1. **Backend:** Use `npm run dev` locally, connect to Docker MongoDB
2. **Frontend:** Use `npm run dev` locally, connect to Docker backend
3. **MongoDB:** Run only MongoDB in Docker:
   ```bash
   docker-compose up -d mongodb
   ```

## Support

For issues:
1. Check logs: `docker-compose logs`
2. Verify environment variables
3. Check service health: `docker-compose ps`
4. Review this guide's troubleshooting section

