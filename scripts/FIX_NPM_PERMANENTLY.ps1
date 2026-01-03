# PowerShell script to fix npm issues permanently
# Run as Administrator if needed

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   FIXING NPM ISSUES PERMANENTLY" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Set execution policy for current user
Write-Host "[1/4] Setting PowerShell execution policy..." -ForegroundColor Green
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
Write-Host "✓ Execution policy set" -ForegroundColor Green

# Verify npm is accessible
Write-Host ""
Write-Host "[2/4] Verifying npm installation..." -ForegroundColor Green
try {
    $npmVersion = npm --version
    Write-Host "✓ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm not found in PATH" -ForegroundColor Red
    Write-Host "Please ensure Node.js is installed and in PATH" -ForegroundColor Yellow
    exit 1
}

# Check Node.js version
Write-Host ""
Write-Host "[3/4] Checking Node.js version..." -ForegroundColor Green
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green
    $majorVersion = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($majorVersion -lt 18) {
        Write-Host "⚠ Warning: Node.js 18+ recommended" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ Node.js not found" -ForegroundColor Red
    exit 1
}

# Navigate to project directory
Write-Host ""
Write-Host "[4/4] Navigating to project directory..." -ForegroundColor Green
$projectPath = "C:\Users\PC\my-app"
if (Test-Path $projectPath) {
    Set-Location $projectPath
    Write-Host "✓ Changed to: $projectPath" -ForegroundColor Green
} else {
    Write-Host "✗ Project directory not found: $projectPath" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   ALL FIXES APPLIED!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Now you can run:" -ForegroundColor White
Write-Host "  npm.cmd run dev" -ForegroundColor Yellow
Write-Host "  OR" -ForegroundColor White
Write-Host "  Double-click: START_SERVER_FIXED.bat" -ForegroundColor Yellow
Write-Host ""

