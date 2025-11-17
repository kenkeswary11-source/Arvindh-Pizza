# American Pizza - Docker Test Script (PowerShell)
# Automatically builds, runs, and verifies all containers

$ErrorActionPreference = "Stop"

function Write-Status {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error-Message {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Yellow
}

Write-Host "🍕 American Pizza - Docker Test Script" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
try {
    $dockerVersion = docker --version
    Write-Status "Docker is installed: $dockerVersion"
} catch {
    Write-Error-Message "Docker is not installed. Please install Docker first."
    exit 1
}

try {
    $composeVersion = docker-compose --version
    Write-Status "Docker Compose is installed: $composeVersion"
} catch {
    Write-Error-Message "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
}

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Info ".env file not found. Creating from env.example..."
    if (Test-Path env.example) {
        Copy-Item env.example .env
        Write-Info "Created .env file. Please edit it with your configuration."
        Write-Info "Continuing with default values..."
    } else {
        Write-Error-Message "env.example not found. Cannot create .env file."
        exit 1
    }
}

# Step 1: Stop and remove existing containers
Write-Host ""
Write-Info "Step 1: Cleaning up existing containers..."
try {
    docker-compose down -v 2>&1 | Out-Null
    Write-Status "Cleanup complete"
} catch {
    Write-Info "No existing containers to clean up"
}

# Step 2: Build containers
Write-Host ""
Write-Info "Step 2: Building containers..."
try {
    docker-compose build --no-cache
    if ($LASTEXITCODE -eq 0) {
        Write-Status "Build successful"
    } else {
        Write-Error-Message "Build failed"
        exit 1
    }
} catch {
    Write-Error-Message "Build failed: $_"
    exit 1
}

# Step 3: Start containers
Write-Host ""
Write-Info "Step 3: Starting containers..."
try {
    docker-compose up -d
    if ($LASTEXITCODE -eq 0) {
        Write-Status "Containers started"
    } else {
        Write-Error-Message "Failed to start containers"
        exit 1
    }
} catch {
    Write-Error-Message "Failed to start containers: $_"
    exit 1
}

# Step 4: Wait for services to be ready
Write-Host ""
Write-Info "Step 4: Waiting for services to be healthy (this may take up to 60 seconds)..."
$maxWait = 60
$waitCount = 0
$allHealthy = $false

while ($waitCount -lt $maxWait) {
    Start-Sleep -Seconds 2
    $waitCount += 2
    
    # Check service status
    $mongoStatus = (docker-compose ps mongodb 2>&1 | Select-String -Pattern "healthy|unhealthy" | ForEach-Object { $_.Matches.Value }) -join ""
    if (-not $mongoStatus) { $mongoStatus = "starting" }
    
    $backendStatus = (docker-compose ps backend 2>&1 | Select-String -Pattern "healthy|unhealthy" | ForEach-Object { $_.Matches.Value }) -join ""
    if (-not $backendStatus) { $backendStatus = "starting" }
    
    $frontendStatus = (docker-compose ps frontend 2>&1 | Select-String -Pattern "healthy|unhealthy" | ForEach-Object { $_.Matches.Value }) -join ""
    if (-not $frontendStatus) { $frontendStatus = "starting" }
    
    if ($mongoStatus -eq "healthy" -and $backendStatus -eq "healthy" -and $frontendStatus -eq "healthy") {
        $allHealthy = $true
        break
    }
    
    Write-Host "`r⏳ Waiting... (${waitCount}s/${maxWait}s) - MongoDB: $mongoStatus, Backend: $backendStatus, Frontend: $frontendStatus" -NoNewline
}

Write-Host ""

if ($allHealthy) {
    Write-Status "All services are healthy"
} else {
    Write-Error-Message "Services did not become healthy within ${maxWait} seconds"
    Write-Info "Checking service status..."
    docker-compose ps
}

# Step 5: Check service status
Write-Host ""
Write-Info "Step 5: Checking service status..."
docker-compose ps

# Step 6: Check logs for errors
Write-Host ""
Write-Info "Step 6: Checking logs for errors..."

Write-Host ""
Write-Info "MongoDB logs (last 10 lines):"
$mongoLogs = docker-compose logs --tail=10 mongodb 2>&1
if ($mongoLogs -match "error|fatal|failed") {
    Write-Host $mongoLogs
} else {
    Write-Status "No errors in MongoDB logs"
}

Write-Host ""
Write-Info "Backend logs (last 20 lines):"
$backendLogs = docker-compose logs --tail=20 backend 2>&1
$backendErrors = $backendLogs | Select-String -Pattern "error|fatal|failed" -CaseSensitive:$false
if ($backendErrors) {
    Write-Error-Message "Errors found in backend logs:"
    Write-Host $backendErrors
} else {
    Write-Status "No errors in backend logs"
}

Write-Host ""
Write-Info "Frontend logs (last 10 lines):"
$frontendLogs = docker-compose logs --tail=10 frontend 2>&1
if ($frontendLogs -match "error|fatal|failed") {
    Write-Host $frontendLogs
} else {
    Write-Status "No errors in frontend logs"
}

# Step 7: Test Backend Health Endpoint
Write-Host ""
Write-Info "Step 7: Testing backend health endpoint..."

$backendPort = "5000"
if (Test-Path .env) {
    $portLine = Get-Content .env | Select-String -Pattern "BACKEND_PORT"
    if ($portLine) {
        $backendPort = ($portLine -split "=")[1].Trim()
    }
}

$healthUrl = "http://localhost:${backendPort}/health"

try {
    $response = Invoke-WebRequest -Uri $healthUrl -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Status "Backend health check passed (HTTP $($response.StatusCode))"
        Write-Info "Health check response:"
        try {
            $json = $response.Content | ConvertFrom-Json
            $json | ConvertTo-Json -Depth 10
        } catch {
            Write-Host $response.Content
        }
    } else {
        Write-Error-Message "Backend health check failed (HTTP $($response.StatusCode))"
    }
} catch {
    Write-Error-Message "Backend health check failed: $_"
    Write-Info "Please manually check: $healthUrl"
}

# Step 8: Test Frontend
Write-Host ""
Write-Info "Step 8: Testing frontend..."

$frontendPort = "80"
if (Test-Path .env) {
    $portLine = Get-Content .env | Select-String -Pattern "FRONTEND_PORT"
    if ($portLine) {
        $frontendPort = ($portLine -split "=")[1].Trim()
    }
}

$frontendUrl = "http://localhost:${frontendPort}"

try {
    $response = Invoke-WebRequest -Uri $frontendUrl -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Status "Frontend is accessible (HTTP $($response.StatusCode))"
    } else {
        Write-Error-Message "Frontend check failed (HTTP $($response.StatusCode))"
    }
} catch {
    Write-Error-Message "Frontend check failed: $_"
    Write-Info "Please manually check: $frontendUrl"
}

# Step 9: Test API Endpoint
Write-Host ""
Write-Info "Step 9: Testing API endpoint..."

$apiUrl = "http://localhost:${backendPort}/api"

try {
    $response = Invoke-WebRequest -Uri $apiUrl -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Status "API endpoint is accessible (HTTP $($response.StatusCode))"
        Write-Info "API response:"
        try {
            $json = $response.Content | ConvertFrom-Json
            $json | ConvertTo-Json -Depth 10
        } catch {
            Write-Host $response.Content
        }
    } else {
        Write-Error-Message "API endpoint check failed (HTTP $($response.StatusCode))"
    }
} catch {
    Write-Error-Message "API endpoint check failed: $_"
    Write-Info "Please manually check: $apiUrl"
}

# Step 10: Summary
Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "📊 Test Summary" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Service Status:"
docker-compose ps

Write-Host ""
Write-Host "Access URLs:"
Write-Host "  Frontend:  http://localhost:${frontendPort}" -ForegroundColor Green
Write-Host "  Backend API:  http://localhost:${backendPort}/api" -ForegroundColor Green
Write-Host "  Backend Health:  http://localhost:${backendPort}/health" -ForegroundColor Green
Write-Host "  MongoDB:  localhost:27017" -ForegroundColor Green

Write-Host ""
Write-Host "Useful Commands:"
Write-Host "  View logs:     docker-compose logs -f" -ForegroundColor Yellow
Write-Host "  Stop services: docker-compose down" -ForegroundColor Yellow
Write-Host "  Restart:       docker-compose restart" -ForegroundColor Yellow
Write-Host ""

if ($allHealthy) {
    Write-Status "All tests completed successfully! 🎉"
    exit 0
} else {
    Write-Error-Message "Some tests failed. Please check the logs above."
    exit 1
}

