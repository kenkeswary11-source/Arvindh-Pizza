# Docker Test Scripts & Rebuild Instructions

## ✅ Test Scripts Created

### 1. `docker-test.sh` (Linux/Mac)
Comprehensive test script that:
- ✅ Checks Docker installation
- ✅ Creates `.env` from template if missing
- ✅ Cleans up existing containers
- ✅ Builds all containers (no cache)
- ✅ Starts all services
- ✅ Waits for health checks (up to 60 seconds)
- ✅ Checks service status
- ✅ Analyzes logs for errors
- ✅ Tests backend health endpoint (`/health`)
- ✅ Tests frontend accessibility
- ✅ Tests API endpoint (`/api`)
- ✅ Provides summary with access URLs

**Usage:**
```bash
chmod +x docker-test.sh
./docker-test.sh
```

### 2. `docker-test.ps1` (Windows)
PowerShell version with same functionality:
- ✅ All features from bash script
- ✅ PowerShell-native commands
- ✅ Windows-compatible

**Usage:**
```powershell
.\docker-test.ps1
```

## 📋 Rebuild Instructions

### `REBUILD_INSTRUCTIONS.md`
Complete guide covering:

1. **Quick Rebuild** - Fast commands for common scenarios
2. **Rebuild Scenarios** - Specific instructions for:
   - Backend code changes
   - Frontend code changes
   - Package.json changes
   - Dockerfile changes
   - docker-compose.yml changes
   - Environment variable changes
   - NGINX configuration changes
   - Complete clean rebuild

3. **Rebuild Commands Reference** - All commands explained
4. **Development Workflow** - Best practices
5. **Troubleshooting** - Common issues and solutions
6. **Time Estimates** - Expected rebuild times
7. **Best Practices** - Optimization tips
8. **Quick Reference Card** - Cheat sheet

## 🚀 Quick Start

### Run Tests
```bash
# Linux/Mac
chmod +x docker-test.sh
./docker-test.sh

# Windows
.\docker-test.ps1
```

### Rebuild After Changes
```bash
# Backend only
docker-compose build backend
docker-compose up -d backend

# Frontend only
docker-compose build frontend
docker-compose up -d frontend

# All services
docker-compose up -d --build

# Clean rebuild
docker-compose build --no-cache
docker-compose up -d
```

## 📊 Test Script Features

### What It Tests

1. **Service Health**
   - MongoDB health check
   - Backend health check
   - Frontend health check

2. **HTTP Endpoints**
   - Backend health: `http://localhost:5000/health`
   - Backend API: `http://localhost:5000/api`
   - Frontend: `http://localhost:80`

3. **Log Analysis**
   - Checks MongoDB logs for errors
   - Checks backend logs for errors
   - Checks frontend logs for errors

4. **Service Status**
   - Shows container status
   - Shows port mappings
   - Shows health status

### Test Output

The script provides:
- ✅ Color-coded status messages
- ✅ Detailed error reporting
- ✅ Service status table
- ✅ Access URLs
- ✅ Useful commands
- ✅ Exit code (0 = success, 1 = failure)

## 📝 Example Test Run

```bash
$ ./docker-test.sh

🍕 American Pizza - Docker Test Script
=======================================

✅ Docker and Docker Compose are installed
ℹ️  Step 1: Cleaning up existing containers...
✅ Cleanup complete
ℹ️  Step 2: Building containers...
✅ Build successful
ℹ️  Step 3: Starting containers...
✅ Containers started
ℹ️  Step 4: Waiting for services to be healthy...
✅ All services are healthy
ℹ️  Step 5: Checking service status...
ℹ️  Step 6: Checking logs for errors...
✅ No errors in MongoDB logs
✅ No errors in backend logs
✅ No errors in frontend logs
ℹ️  Step 7: Testing backend health endpoint...
✅ Backend health check passed (HTTP 200)
ℹ️  Step 8: Testing frontend...
✅ Frontend is accessible (HTTP 200)
ℹ️  Step 9: Testing API endpoint...
✅ API endpoint is accessible (HTTP 200)

=======================================
📊 Test Summary
=======================================

Service Status:
NAME                        STATUS              PORTS
american-pizza-backend      Up (healthy)        0.0.0.0:5000->5000/tcp
american-pizza-frontend     Up (healthy)        0.0.0.0:80->80/tcp
american-pizza-mongodb      Up (healthy)        0.0.0.0:27017->27017/tcp

Access URLs:
  Frontend:  http://localhost:80
  Backend API:  http://localhost:5000/api
  Backend Health:  http://localhost:5000/health
  MongoDB:  localhost:27017

✅ All tests completed successfully! 🎉
```

## 🔧 Integration with CI/CD

The test script can be used in CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Test Docker Setup
  run: |
    chmod +x docker-test.sh
    ./docker-test.sh
```

The script exits with:
- `0` = All tests passed
- `1` = Tests failed

## 📚 Documentation Updated

- ✅ `DOCKER_DEPLOYMENT.md` - Added rebuild section
- ✅ `REBUILD_INSTRUCTIONS.md` - Complete rebuild guide
- ✅ `DOCKER_TEST_SUMMARY.md` - This file

## 🎯 Next Steps

1. **Make scripts executable** (Linux/Mac):
   ```bash
   chmod +x docker-test.sh docker-deploy.sh
   ```

2. **Run initial test**:
   ```bash
   ./docker-test.sh  # or .\docker-test.ps1 on Windows
   ```

3. **After making changes, rebuild**:
   ```bash
   # See REBUILD_INSTRUCTIONS.md for details
   docker-compose build backend
   docker-compose up -d backend
   ```

4. **Test after rebuild**:
   ```bash
   ./docker-test.sh
   ```

---

**Your Docker setup now includes automated testing and rebuild instructions! 🎉**

