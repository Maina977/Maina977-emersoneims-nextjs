# PowerShell script to fix and start Next.js server

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next.js Server Fix & Start Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Kill existing Node processes
Write-Host "[1/6] Killing existing Node processes..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | Stop-Process -Force
    Write-Host "✅ Killed $($nodeProcesses.Count) Node process(es)" -ForegroundColor Green
} else {
    Write-Host "✅ No Node processes running" -ForegroundColor Green
}

# Step 2: Clean build artifacts
Write-Host ""
Write-Host "[2/6] Cleaning build artifacts..." -ForegroundColor Yellow
if (Test-Path .next) {
    Remove-Item -Recurse -Force .next
    Write-Host "✅ Removed .next folder" -ForegroundColor Green
} else {
    Write-Host "✅ No .next folder to clean" -ForegroundColor Green
}

if (Test-Path "node_modules/.cache") {
    Remove-Item -Recurse -Force "node_modules/.cache"
    Write-Host "✅ Removed cache folder" -ForegroundColor Green
}

# Step 3: Verify .env file
Write-Host ""
Write-Host "[3/6] Checking .env file..." -ForegroundColor Yellow
if (-not (Test-Path .env)) {
    @"
NEXT_PUBLIC_SITE_URL=https://www.emersoneims.com
WORDPRESS_API_URL=https://www.emersoneims.com/wp-json/wp/v2
WORDPRESS_SITE_URL=https://www.emersoneims.com
NODE_ENV=development
"@ | Out-File -FilePath .env -Encoding utf8
    Write-Host "✅ Created .env file" -ForegroundColor Green
} else {
    Write-Host "✅ .env file exists" -ForegroundColor Green
    Get-Content .env | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
}

# Step 4: Verify package.json and dependencies
Write-Host ""
Write-Host "[4/6] Checking dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  node_modules not found. Installing dependencies..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "✅ node_modules exists" -ForegroundColor Green
}

# Step 5: Check for TypeScript errors
Write-Host ""
Write-Host "[5/6] Checking for TypeScript errors..." -ForegroundColor Yellow
$tscResult = npm run type-check 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ No TypeScript errors" -ForegroundColor Green
} else {
    Write-Host "⚠️  TypeScript errors found:" -ForegroundColor Yellow
    Write-Host $tscResult -ForegroundColor Red
}

# Step 6: Start server
Write-Host ""
Write-Host "[6/6] Starting development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Server starting on http://localhost:3000" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the server
npm run dev




