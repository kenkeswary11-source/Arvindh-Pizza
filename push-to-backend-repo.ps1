# PowerShell script to push backend files to aravindhanriya/backend repository
# This script helps sync your local backend files to the separate backend repository

Write-Host "Backend Repository Sync Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if backend remote exists
$backendRemote = git remote | Select-String "backend"
if (-not $backendRemote) {
    Write-Host "Adding backend repository as remote..." -ForegroundColor Yellow
    git remote add backend https://github.com/aravindhanriya/backend.git
    Write-Host "Added remote 'backend'" -ForegroundColor Green
} else {
    Write-Host "Backend remote already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "Current git structure:" -ForegroundColor Cyan
git ls-tree -r HEAD --name-only | Where-Object { $_ -notlike "frontend/*" -and $_ -notlike "*.md" -and $_ -notlike "verify-*" } | Select-Object -First 25

Write-Host ""
Write-Host "IMPORTANT: Your files are tracked at the root level in this repository." -ForegroundColor Yellow
Write-Host "The backend repository needs these files at the root level too." -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Make sure all backend files are committed in this repository"
Write-Host "2. The files should be at root level (not in backend/ subdirectory)"
Write-Host "3. Push to backend repository:"
Write-Host "   git push backend main"
Write-Host ""
Write-Host "OR if you need to push only backend files:" -ForegroundColor Yellow
Write-Host "You may need to create a separate branch or use subtree push"
Write-Host ""

# Check what files would be pushed
Write-Host "Files that should be in backend repository:" -ForegroundColor Cyan
$backendFiles = git ls-tree -r HEAD --name-only | Where-Object { 
    $_ -like "config/*" -or 
    $_ -like "server.js" -or 
    $_ -like "package*.json" -or 
    $_ -like "middleware/*" -or 
    $_ -like "models/*" -or 
    $_ -like "routes/*" -or 
    $_ -like "utils/*" -or 
    $_ -like "scripts/*" -or 
    $_ -like ".gitignore"
}

$backendFiles | ForEach-Object { Write-Host "   $_" -ForegroundColor Green }

Write-Host ""
$fileCount = $backendFiles.Count
Write-Host "Total backend files: $fileCount" -ForegroundColor Cyan
