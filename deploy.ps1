# Automated Deployment Script
# Deploys Next.js app to production

param(
    [switch]$AutoDeploy
)

$ErrorActionPreference = "Continue"

Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   DEPLOYING TO www.emersoneims.com" -ForegroundColor Cyan  
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build
Write-Host "[1/4] Building application..." -ForegroundColor Yellow
& npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build successful!" -ForegroundColor Green
Write-Host ""

# Step 2: Check build
Write-Host "[2/4] Verifying build..." -ForegroundColor Yellow
if (-not (Test-Path .next)) {
    Write-Host "❌ Build folder not found!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build verified!" -ForegroundColor Green
Write-Host ""

# Step 3: Deploy options
Write-Host "[3/4] Deployment options..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Choose deployment method:" -ForegroundColor White
Write-Host "  1. Vercel (Recommended - Easiest)" -ForegroundColor Cyan
Write-Host "  2. Manual instructions" -ForegroundColor Cyan
Write-Host ""

if ($AutoDeploy) {
    Write-Host "[4/4] Auto-deploying to Vercel..." -ForegroundColor Yellow
    & npx vercel@latest --prod --yes
} else {
    Write-Host "[4/4] To deploy now, run:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   npx vercel@latest --prod" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or use the Vercel website:" -ForegroundColor White
    Write-Host "   https://vercel.com" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "✅ Deployment preparation complete!" -ForegroundColor Green
Write-Host ""




