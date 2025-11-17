# Comprehensive script to fix backend deployment issues
# Handles both git push and Render 404 errors

Write-Host "=== Backend Deployment Fix Script ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check current state
Write-Host "Step 1: Checking current repository state..." -ForegroundColor Yellow
Write-Host ""

Write-Host "Files in local backend directory:" -ForegroundColor Cyan
$backendFiles = Get-ChildItem -Path "backend" -Recurse -File | Where-Object { 
    $_.FullName -notmatch "node_modules|uploads" 
} | Select-Object -First 10
$backendFiles | ForEach-Object { Write-Host "  $($_.Name)" -ForegroundColor Green }

Write-Host ""
Write-Host "Checking if config/database.js exists:" -ForegroundColor Cyan
if (Test-Path "backend\config\database.js") {
    Write-Host "  ✅ config/database.js exists locally" -ForegroundColor Green
} else {
    Write-Host "  ❌ config/database.js is MISSING!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2: Checking remote repository..." -ForegroundColor Yellow
git fetch backend 2>&1 | Out-Null
$remoteFiles = git ls-tree -r backend/main --name-only
Write-Host "Files in remote repository:" -ForegroundColor Cyan
$remoteFiles | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }

$hasConfig = $remoteFiles | Where-Object { $_ -like "config/database.js" }
if ($hasConfig) {
    Write-Host ""
    Write-Host "  ✅ config/database.js exists in remote" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "  ❌ config/database.js is MISSING in remote!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Step 3: Pushing backend files to remote..." -ForegroundColor Yellow
    
    # Use force push with the split branch
    Write-Host "  Creating split branch..." -ForegroundColor Gray
    git subtree split --prefix=backend -b backend-sync 2>&1 | Out-Null
    
    Write-Host "  Force pushing to remote..." -ForegroundColor Gray
    Write-Host "  ⚠️  This will overwrite the remote repository" -ForegroundColor Yellow
    git push backend backend-sync:main --force
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "  ✅ Successfully pushed backend files!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "  ❌ Push failed. You may need to push manually." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== Render 404 Error Troubleshooting ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "If you're getting a 404 NOT_FOUND error from Render:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Check Render Dashboard:" -ForegroundColor Cyan
Write-Host "   - Go to: https://dashboard.render.com"
Write-Host "   - Find your backend service"
Write-Host "   - Check the 'Events' tab for deployment logs"
Write-Host ""
Write-Host "2. Verify Repository Connection:" -ForegroundColor Cyan
Write-Host "   - Repository: https://github.com/aravindhanriya/backend"
Write-Host "   - Branch: main"
Write-Host "   - Root Directory: (should be empty, or set to correct path)"
Write-Host ""
Write-Host "3. Check Build & Start Commands:" -ForegroundColor Cyan
Write-Host "   - Build Command: npm install"
Write-Host "   - Start Command: node server.js"
Write-Host ""
Write-Host "4. Verify Files on GitHub:" -ForegroundColor Cyan
Write-Host "   - Visit: https://github.com/aravindhanriya/backend"
Write-Host "   - Confirm config/database.js exists"
Write-Host "   - Confirm server.js exists at root level"
Write-Host ""
Write-Host "5. Common 404 Causes:" -ForegroundColor Cyan
Write-Host "   - Service not deployed yet (check deployment status)"
Write-Host "   - Wrong service URL (check Render dashboard for correct URL)"
Write-Host "   - Files missing from repository (run this script to fix)"
Write-Host "   - Root directory misconfigured in Render settings"
Write-Host ""

Write-Host "=== Next Steps ===" -ForegroundColor Cyan
Write-Host "1. Verify files are pushed: https://github.com/aravindhanriya/backend" -ForegroundColor White
Write-Host "2. Check Render dashboard for deployment status" -ForegroundColor White
Write-Host "3. If 404 persists, check Render service URL and environment variables" -ForegroundColor White
Write-Host ""

