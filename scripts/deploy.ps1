# Deployment Script for Emerson EIMS
# Deploys to Vercel Production

param(
    [switch]$SkipBuild = $false,
    [switch]$SkipLogin = $false,
    [string]$Environment = "production"
)

$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Emerson EIMS Deployment Script" -ForegroundColor Cyan
Write-Host "  Domain: www.emersoneims.com" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found!" -ForegroundColor Red
    Write-Host "   Please run this script from the project root directory." -ForegroundColor Yellow
    exit 1
}

# Check Node.js
Write-Host "📦 Checking prerequisites..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    if ($LASTEXITCODE -ne 0) { throw }
    Write-Host "   ✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Node.js not found! Please install Node.js 18+." -ForegroundColor Red
    exit 1
}

# Check npm
try {
    $npmVersion = npm --version 2>&1
    if ($LASTEXITCODE -ne 0) { throw }
    Write-Host "   ✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ npm not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "📥 Installing dependencies..." -ForegroundColor Yellow
    npm install --legacy-peer-deps
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   ❌ Failed to install dependencies!" -ForegroundColor Red
        exit 1
    }
    Write-Host "   ✅ Dependencies installed" -ForegroundColor Green
    Write-Host ""
}

# Build the project
if (-not $SkipBuild) {
    Write-Host "🔨 Building project..." -ForegroundColor Yellow
    Write-Host "   This may take a few minutes..." -ForegroundColor Gray
    
    # Try webpack build first
    $buildSuccess = $false
    npx next build --webpack 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        $buildSuccess = $true
        Write-Host "   ✅ Build successful (webpack)" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Webpack build failed, trying default build..." -ForegroundColor Yellow
        npm run build 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            $buildSuccess = $true
            Write-Host "   ✅ Build successful" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Build failed!" -ForegroundColor Red
            Write-Host "   You can skip the build with -SkipBuild flag" -ForegroundColor Yellow
            exit 1
        }
    }
    Write-Host ""
}

# Check Vercel CLI
Write-Host "🚀 Preparing for deployment..." -ForegroundColor Yellow
npx vercel@latest --version 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Vercel CLI available" -ForegroundColor Green
} else {
    Write-Host "   ❌ Vercel CLI not available!" -ForegroundColor Red
    exit 1
}

# Check if logged in to Vercel
Write-Host "🔐 Checking Vercel authentication..." -ForegroundColor Yellow
npx vercel@latest whoami 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Authenticated with Vercel" -ForegroundColor Green
} else {
    if ($SkipLogin) {
        Write-Host "   ⚠️  Not authenticated, but -SkipLogin flag is set" -ForegroundColor Yellow
        Write-Host "   Deployment may fail. Run 'npx vercel@latest login' first." -ForegroundColor Yellow
    } else {
        Write-Host "   ⚠️  Not authenticated with Vercel" -ForegroundColor Yellow
        Write-Host "   Opening login page..." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "   Please complete authentication in your browser." -ForegroundColor Cyan
        Write-Host "   Press ENTER after logging in..." -ForegroundColor Cyan
        
        npx vercel@latest login
        if ($LASTEXITCODE -ne 0) {
            Write-Host "   ❌ Login failed or cancelled!" -ForegroundColor Red
            exit 1
        }
        Write-Host "   ✅ Authentication successful" -ForegroundColor Green
    }
}
Write-Host ""

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel ($Environment)..." -ForegroundColor Yellow
Write-Host "   Domain: www.emersoneims.com" -ForegroundColor Gray
Write-Host ""

if ($Environment -eq "production") {
    npx vercel@latest --prod --yes
} else {
    npx vercel@latest --yes
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✅ Deployment Successful!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Configure your domain in Vercel Dashboard" -ForegroundColor White
    Write-Host "2. Add DNS records as instructed by Vercel" -ForegroundColor White
    Write-Host "3. Wait for DNS propagation (may take up to 48 hours)" -ForegroundColor White
    Write-Host ""
    Write-Host "Visit: https://vercel.com/dashboard" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    Write-Host "   Check the error messages above for details." -ForegroundColor Yellow
    exit 1
}
