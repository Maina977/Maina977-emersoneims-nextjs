# Quick Deploy Script for www.emersoneims.com
# Run this script to deploy your Next.js app

Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   DEPLOYING TO www.emersoneims.com" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Step 1: Kill any running Node processes
Write-Host "[1/5] Cleaning up..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Step 2: Build
Write-Host "[2/5] Building application..." -ForegroundColor Yellow
& npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! Please check errors above." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build successful!" -ForegroundColor Green
Write-Host ""

# Step 3: Verify build
Write-Host "[3/5] Verifying build..." -ForegroundColor Yellow
if (Test-Path .next) {
    Write-Host "✅ Build folder created" -ForegroundColor Green
} else {
    Write-Host "❌ Build folder not found!" -ForegroundColor Red
    exit 1
}

# Step 4: Check/Install Vercel CLI
Write-Host "[4/5] Checking Vercel CLI..." -ForegroundColor Yellow
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
    & npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Vercel CLI" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ Vercel CLI ready" -ForegroundColor Green
Write-Host ""

# Step 5: Deploy
Write-Host "[5/5] Deploying to production..." -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  You will need to:" -ForegroundColor Yellow
Write-Host "   1. Login to Vercel (if not already logged in)" -ForegroundColor White
Write-Host "   2. Follow the prompts" -ForegroundColor White
Write-Host "   3. Add domain: www.emersoneims.com in Vercel dashboard" -ForegroundColor White
Write-Host ""
Write-Host "Starting deployment..." -ForegroundColor Cyan
Write-Host ""

& vercel --prod

Write-Host ""
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Check Vercel dashboard for deployment URL" -ForegroundColor White
Write-Host "  2. Add custom domain: www.emersoneims.com" -ForegroundColor White
Write-Host "  3. Verify site is live at: https://www.emersoneims.com" -ForegroundColor White
Write-Host ""




