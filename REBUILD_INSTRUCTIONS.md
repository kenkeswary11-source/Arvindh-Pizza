# Rebuild Instructions - American Pizza Docker

This guide explains how to rebuild your Docker containers after making code changes.

## Quick Rebuild

### After Code Changes

**Option 1: Rebuild specific service (fastest)**
```bash
# Rebuild and restart backend
docker-compose build backend
docker-compose up -d backend

# Rebuild and restart frontend
docker-compose build frontend
docker-compose up -d frontend

# Rebuild and restart both
docker-compose build backend frontend
docker-compose up -d backend frontend
```

**Option 2: Rebuild all services**
```bash
docker-compose up -d --build
```

**Option 3: Force rebuild (clean build)**
```bash
# Stop and remove containers
docker-compose down

# Rebuild without cache
docker-compose build --no-cache

# Start services
docker-compose up -d
```

## Rebuild Scenarios

### 1. Backend Code Changes

If you modified backend files (`backend/` directory):

```bash
# Rebuild backend only
docker-compose build backend
docker-compose up -d backend

# Or use the one-liner
docker-compose up -d --build backend
```

**What gets rebuilt:**
- All backend source code
- Dependencies (if `package.json` changed)
- Uploads directory structure

**Time:** ~30-60 seconds

### 2. Frontend Code Changes

If you modified frontend files (`frontend/` directory):

```bash
# Rebuild frontend only
docker-compose build frontend
docker-compose up -d frontend

# Or use the one-liner
docker-compose up -d --build frontend
```

**What gets rebuilt:**
- Frontend source code
- Vite build process
- NGINX configuration (if `nginx.conf` changed)
- Static assets

**Time:** ~1-3 minutes (includes Vite build)

### 3. Package.json Changes

If you modified `package.json` in either backend or frontend:

```bash
# Backend dependencies changed
docker-compose build --no-cache backend
docker-compose up -d backend

# Frontend dependencies changed
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

**Note:** Use `--no-cache` to ensure dependencies are reinstalled.

### 4. Dockerfile Changes

If you modified `Dockerfile` or `.dockerignore`:

```bash
# Rebuild with no cache
docker-compose build --no-cache

# Restart services
docker-compose up -d
```

### 5. docker-compose.yml Changes

If you modified `docker-compose.yml`:

```bash
# Recreate containers with new configuration
docker-compose up -d --force-recreate
```

### 6. Environment Variable Changes

If you modified `.env` file:

```bash
# Restart services to pick up new environment variables
docker-compose down
docker-compose up -d
```

**Note:** For frontend build-time variables (`VITE_*`), you need to rebuild:
```bash
docker-compose build frontend
docker-compose up -d frontend
```

### 7. NGINX Configuration Changes

If you modified `frontend/nginx.conf`:

```bash
# Rebuild frontend
docker-compose build frontend
docker-compose up -d frontend
```

### 8. Complete Clean Rebuild

When you want to start completely fresh:

```bash
# Stop and remove everything (including volumes)
docker-compose down -v

# Remove images (optional)
docker-compose rm -f

# Rebuild from scratch
docker-compose build --no-cache

# Start services
docker-compose up -d
```

**Warning:** This will delete all data in MongoDB and uploaded images!

## Rebuild Commands Reference

### Basic Commands

```bash
# Rebuild specific service
docker-compose build <service-name>

# Rebuild without cache
docker-compose build --no-cache <service-name>

# Rebuild and restart
docker-compose up -d --build <service-name>

# Rebuild all
docker-compose build

# Rebuild all without cache
docker-compose build --no-cache
```

### Service Names

- `mongodb` - MongoDB database
- `backend` - Express backend API
- `frontend` - React frontend with NGINX

### Useful Flags

- `--no-cache` - Don't use cache when building
- `--force-recreate` - Recreate containers even if config hasn't changed
- `-d` - Run in detached mode (background)
- `--build` - Build images before starting containers

## Development Workflow

### Recommended Development Setup

For faster development, run services locally and only use Docker for MongoDB:

```bash
# Start only MongoDB in Docker
docker-compose up -d mongodb

# Run backend locally (with hot reload)
cd backend
npm install
npm run dev

# Run frontend locally (with hot reload)
cd frontend
npm install
npm run dev
```

This way, you get:
- ✅ Hot reload for backend (nodemon)
- ✅ Hot reload for frontend (Vite)
- ✅ No rebuild time
- ✅ Faster development cycle

### Production Testing

When ready to test production build:

```bash
# Rebuild everything
docker-compose up -d --build

# Run test script
./docker-test.sh  # Linux/Mac
# or
.\docker-test.ps1  # Windows
```

## Troubleshooting Rebuilds

### Issue: Changes not reflected

**Solution:**
```bash
# Force rebuild without cache
docker-compose build --no-cache <service>
docker-compose up -d <service>
```

### Issue: Port already in use

**Solution:**
```bash
# Stop conflicting services
docker-compose down

# Or change ports in .env
FRONTEND_PORT=8080
BACKEND_PORT=5001
```

### Issue: Build fails

**Solution:**
```bash
# Check logs
docker-compose logs <service>

# Try clean rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Issue: Out of disk space

**Solution:**
```bash
# Clean up unused images
docker system prune -a

# Remove unused volumes (careful!)
docker volume prune
```

## Rebuild Time Estimates

| Scenario | Time | Command |
|----------|------|---------|
| Backend code change | 30-60s | `docker-compose build backend` |
| Frontend code change | 1-3min | `docker-compose build frontend` |
| Package.json change | 2-5min | `docker-compose build --no-cache` |
| Full rebuild | 3-8min | `docker-compose build --no-cache` |
| Clean rebuild (with volumes) | 5-10min | `docker-compose down -v && docker-compose build --no-cache` |

## Best Practices

1. **Rebuild only what changed** - Faster iteration
   ```bash
   docker-compose build backend  # Not all services
   ```

2. **Use cache for dependencies** - Only use `--no-cache` when needed
   ```bash
   # Good: Uses cache
   docker-compose build
   
   # Only when dependencies changed
   docker-compose build --no-cache
   ```

3. **Check logs after rebuild**
   ```bash
   docker-compose logs -f <service>
   ```

4. **Test after rebuild**
   ```bash
   ./docker-test.sh  # Verify everything works
   ```

5. **Keep .env updated** - Rebuild frontend if `VITE_*` vars changed
   ```bash
   # After changing VITE_API_URL or VITE_SOCKET_URL
   docker-compose build frontend
   docker-compose up -d frontend
   ```

## Quick Reference Card

```
┌─────────────────────────────────────────┐
│  Rebuild Quick Reference                 │
├─────────────────────────────────────────┤
│  Backend only:                          │
│    docker-compose build backend         │
│    docker-compose up -d backend         │
│                                         │
│  Frontend only:                         │
│    docker-compose build frontend        │
│    docker-compose up -d frontend       │
│                                         │
│  All services:                           │
│    docker-compose up -d --build        │
│                                         │
│  Clean rebuild:                         │
│    docker-compose build --no-cache     │
│    docker-compose up -d                │
│                                         │
│  Test after rebuild:                    │
│    ./docker-test.sh                    │
└─────────────────────────────────────────┘
```

## Automated Rebuild Script

You can also use the test script which includes rebuild:

```bash
# Linux/Mac
./docker-test.sh

# Windows
.\docker-test.ps1
```

This script will:
1. Clean up existing containers
2. Build all services
3. Start services
4. Wait for health checks
5. Test all endpoints
6. Show summary

---

**Need help?** Check `DOCKER_DEPLOYMENT.md` for more details.

