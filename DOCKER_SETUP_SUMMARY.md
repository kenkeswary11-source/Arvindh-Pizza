# Docker Setup Summary - American Pizza

## ✅ Files Created

### Docker Configuration Files

1. **`backend/Dockerfile`**
   - Node.js 18 Alpine base image
   - Production dependencies only
   - Health check endpoint
   - Exposes port 5000
   - Runs in production mode

2. **`frontend/Dockerfile`**
   - Multi-stage build (Node.js builder + NGINX production)
   - Vite build with environment variables
   - NGINX Alpine for serving static files
   - Health check with wget
   - Exposes port 80

3. **`docker-compose.yml`** (root level)
   - Orchestrates 3 services: MongoDB, Backend, Frontend
   - Docker networking with `pizza-network`
   - Health checks for all services
   - Volume persistence for MongoDB and uploads
   - Service dependencies and startup order

4. **`frontend/nginx.conf`**
   - NGINX configuration for SPA
   - Gzip compression
   - Security headers
   - Static asset caching
   - Optional API/WebSocket proxy (commented)

5. **`env.example`**
   - Template for environment variables
   - All required and optional variables documented
   - Copy to `.env` and customize

6. **`backend/.dockerignore`**
   - Excludes node_modules, .env files, git files
   - Optimizes Docker build context

7. **`frontend/.dockerignore`**
   - Excludes node_modules, dist, .env files
   - Optimizes Docker build context

### Documentation & Scripts

8. **`DOCKER_DEPLOYMENT.md`**
   - Comprehensive deployment guide
   - Architecture diagram
   - Troubleshooting section
   - Production deployment tips

9. **`docker-deploy.sh`** (Linux/Mac)
   - Automated deployment script
   - Checks prerequisites
   - Builds and starts services

10. **`docker-deploy.ps1`** (Windows)
    - PowerShell deployment script
    - Same functionality as bash script

## 📝 Files Modified

### Code Changes

1. **`frontend/src/config/api.js`**
   - Updated to handle Docker environment
   - Fallback to window.location.origin for Docker
   - Better error messages
   - Supports both Docker and Vercel deployments

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         Docker Network                   │
│         (pizza-network)                 │
│                                         │
│  ┌──────────────┐                      │
│  │   Frontend    │ Port 80              │
│  │   (NGINX)     │                      │
│  └──────┬───────┘                       │
│         │                               │
│         │ HTTP Requests                 │
│         │                               │
│  ┌──────▼───────┐                      │
│  │   Backend     │ Port 5000           │
│  │   (Express)   │                      │
│  └──────┬───────┘                       │
│         │                               │
│         │ MongoDB Connection            │
│         │                               │
│  ┌──────▼───────┐                      │
│  │   MongoDB     │ Port 27017           │
│  │   (Database)  │                      │
│  └──────────────┘                       │
└─────────────────────────────────────────┘
```

## 🚀 Quick Start

### 1. Setup Environment

```bash
# Copy environment template
cp env.example .env

# Edit .env with your values
# At minimum, set:
# - MONGO_ROOT_PASSWORD (strong password)
# - JWT_SECRET (random secret key)
```

### 2. Deploy

**Linux/Mac:**
```bash
chmod +x docker-deploy.sh
./docker-deploy.sh
```

**Windows:**
```powershell
.\docker-deploy.ps1
```

**Manual:**
```bash
docker-compose up -d --build
```

### 3. Access

- **Frontend:** http://localhost:80
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/health

### 4. Create Admin User

```bash
docker-compose exec backend node scripts/createAdmin.js
```

## 🔧 Key Features

### Backend
- ✅ Production mode (`NODE_ENV=production`)
- ✅ Health check endpoint
- ✅ Graceful shutdown (SIGTERM)
- ✅ Persistent uploads volume
- ✅ MongoDB connection with authentication
- ✅ CORS configured for frontend

### Frontend
- ✅ Production build with Vite
- ✅ NGINX serving static files
- ✅ SPA routing support
- ✅ Gzip compression
- ✅ Security headers
- ✅ Static asset caching

### MongoDB
- ✅ Authentication enabled
- ✅ Persistent data volumes
- ✅ Health checks
- ✅ Config volume

### Docker Compose
- ✅ Service dependencies
- ✅ Health check conditions
- ✅ Network isolation
- ✅ Volume persistence
- ✅ Restart policies

## 📦 Volumes

- `mongodb_data`: Database files
- `mongodb_config`: MongoDB configuration
- `backend_uploads`: Product/offer images

## 🌐 Networking

- **Network:** `pizza-network` (bridge)
- **Backend → MongoDB:** `mongodb:27017` (internal)
- **Frontend → Backend:** Uses `VITE_API_URL` (browser-accessible URL)

## 🔐 Environment Variables

### Required
- `MONGO_ROOT_PASSWORD`: MongoDB root password
- `JWT_SECRET`: JWT signing secret
- `VITE_API_URL`: Backend API URL for frontend
- `VITE_SOCKET_URL`: Socket.io URL for frontend

### Optional
- `MONGO_ROOT_USERNAME`: MongoDB root username (default: admin)
- `MONGO_DATABASE`: Database name (default: american_pizza)
- `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:80)
- `SMTP_*`: Email configuration

## 🐛 Troubleshooting

### Services won't start
```bash
# Check logs
docker-compose logs

# Check service status
docker-compose ps

# Restart services
docker-compose restart
```

### Backend can't connect to MongoDB
- Verify MongoDB is healthy: `docker-compose ps mongodb`
- Check connection string in backend logs
- Ensure MongoDB starts before backend (handled by depends_on)

### Frontend can't reach backend
- Verify `VITE_API_URL` in `.env` matches backend URL
- Check browser console for CORS errors
- Ensure `FRONTEND_URL` in backend matches frontend URL

### Port conflicts
- Change ports in `.env`:
  ```env
  FRONTEND_PORT=8080
  BACKEND_PORT=5001
  MONGO_PORT=27018
  ```

## 📚 Additional Resources

- See `DOCKER_DEPLOYMENT.md` for detailed guide
- Docker Compose docs: https://docs.docker.com/compose/
- NGINX docs: https://nginx.org/en/docs/

## ✅ Production Checklist

- [ ] Set strong `MONGO_ROOT_PASSWORD`
- [ ] Set secure `JWT_SECRET`
- [ ] Update `VITE_API_URL` to production domain
- [ ] Update `VITE_SOCKET_URL` to production domain
- [ ] Update `FRONTEND_URL` to production domain
- [ ] Configure SMTP for email notifications
- [ ] Set up SSL/TLS (reverse proxy)
- [ ] Configure firewall rules
- [ ] Set up backups for MongoDB volumes
- [ ] Monitor service health
- [ ] Set up log aggregation
- [ ] Configure resource limits in docker-compose.yml

## 🎯 Next Steps

1. **Test locally:** `docker-compose up -d`
2. **Create admin user:** `docker-compose exec backend node scripts/createAdmin.js`
3. **Access frontend:** http://localhost:80
4. **Verify API:** http://localhost:5000/api
5. **Check health:** http://localhost:5000/health
6. **Review logs:** `docker-compose logs -f`

---

**Your application is now fully Dockerized and ready for deployment! 🎉**

