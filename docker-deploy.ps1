# American Pizza - Docker Deployment Script (PowerShell)

Write-Host "🍕 American Pizza - Docker Deployment" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "⚠️  .env file not found!" -ForegroundColor Yellow
    Write-Host "📋 Copying env.example to .env..." -ForegroundColor Yellow
    Copy-Item env.example .env
    Write-Host "✅ Created .env file. Please edit it with your configuration before continuing." -ForegroundColor Green
    Write-Host ""
    Read-Host "Press Enter after editing .env file, or Ctrl+C to exit"
}

# Check Docker
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker found: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed. Please install Docker first." -ForegroundColor Red
    exit 1
}

try {
    $composeVersion = docker-compose --version
    Write-Host "✅ Docker Compose found: $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose is not installed. Please install Docker Compose first." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🐳 Building and starting containers..." -ForegroundColor Cyan
docker-compose up -d --build

Write-Host ""
Write-Host "⏳ Waiting for services to be healthy..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "📊 Service Status:" -ForegroundColor Cyan
docker-compose ps

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Access your application:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:80"
Write-Host "   Backend API: http://localhost:5000/api"
Write-Host "   Backend Health: http://localhost:5000/health"
Write-Host ""
Write-Host "📝 View logs: docker-compose logs -f" -ForegroundColor Yellow
Write-Host "🛑 Stop services: docker-compose down" -ForegroundColor Yellow
Write-Host ""

