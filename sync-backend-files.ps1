# Script to sync backend files to aravindhanriya/backend repository
# This handles the case where files need to be at root level in the backend repo

Write-Host "Syncing backend files to aravindhanriya/backend..." -ForegroundColor Cyan
Write-Host ""

# Check current status
Write-Host "Current backend remote files:" -ForegroundColor Yellow
git ls-tree -r backend/main --name-only

Write-Host ""
Write-Host "Files to push (from backend/ directory):" -ForegroundColor Yellow
git ls-tree -r HEAD --name-only | Where-Object { $_ -like "backend/*" } | Select-Object -First 10

Write-Host ""
Write-Host "Options:" -ForegroundColor Cyan
Write-Host "1. Force push (will overwrite remote - use if remote is outdated)"
Write-Host "2. Pull and merge first (safer, preserves remote changes)"
Write-Host "3. Cancel"
Write-Host ""

$choice = Read-Host "Choose option (1/2/3)"

if ($choice -eq "1") {
    Write-Host ""
    Write-Host "Force pushing backend files..." -ForegroundColor Yellow
    Write-Host "This will overwrite the remote repository." -ForegroundColor Red
    $confirm = Read-Host "Are you sure? (yes/no)"
    if ($confirm -eq "yes") {
        git subtree push --prefix=backend backend main --force
    } else {
        Write-Host "Cancelled." -ForegroundColor Yellow
    }
} elseif ($choice -eq "2") {
    Write-Host ""
    Write-Host "This requires manual merging due to different directory structures." -ForegroundColor Yellow
    Write-Host "Recommended: Use Option 1 if you want to sync your local backend files." -ForegroundColor Yellow
} else {
    Write-Host "Cancelled." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Note: After pushing, verify that config/database.js exists in the repository." -ForegroundColor Cyan

