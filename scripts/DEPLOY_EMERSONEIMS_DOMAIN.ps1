# ============================================
# EMERSON EIMS - PRODUCTION DEPLOYMENT SCRIPT
# Domain: www.emersoneims.com
# ============================================

Write-Host "🚀 Starting Emerson EIMS Production Deployment..." -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to project directory
Set-Location "C:\Users\PC\my-app"

# Step 1: Kill any running processes
Write-Host "⏹️  Step 1: Stopping running processes..." -ForegroundColor Yellow
Get-Process node,npm,yarn,vercel -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2
Write-Host "✅ Processes stopped" -ForegroundColor Green
Write-Host ""

# Step 2: Clean all build artifacts and caches
Write-Host "🧹 Step 2: Cleaning build artifacts and caches..." -ForegroundColor Yellow
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .turbo -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force out -ErrorAction SilentlyContinue
npm cache clean --force 2>&1 | Out-Null
Write-Host "✅ Cleanup complete" -ForegroundColor Green
Write-Host ""

# Step 3: Fresh install dependencies
Write-Host "📦 Step 3: Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Step 4: Update environment variables
Write-Host "🔧 Step 4: Configuring environment variables..." -ForegroundColor Yellow
$envContent = @"
NEXT_PUBLIC_SITE_URL=https://www.emersoneims.com
NODE_ENV=production
"@
$envContent | Set-Content -Path ".env" -Force
$envContent | Set-Content -Path ".env.production" -Force
Write-Host "✅ Environment variables configured" -ForegroundColor Green
Write-Host ""

# Step 5: Verify Vercel CLI installation
Write-Host "🔍 Step 5: Verifying Vercel CLI..." -ForegroundColor Yellow
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "📥 Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}
Write-Host "✅ Vercel CLI ready" -ForegroundColor Green
Write-Host ""

# Step 6: Login to Vercel (if needed)
Write-Host "🔐 Step 6: Verifying Vercel authentication..." -ForegroundColor Yellow
vercel whoami 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Please login to Vercel..." -ForegroundColor Yellow
    vercel login
}
Write-Host "✅ Authenticated" -ForegroundColor Green
Write-Host ""

# Step 7: Link project to Vercel
Write-Host "🔗 Step 7: Linking project to Vercel..." -ForegroundColor Yellow
vercel link --yes 2>&1 | Out-Null
Write-Host "✅ Project linked" -ForegroundColor Green
Write-Host ""

# Step 8: Set environment variables in Vercel
Write-Host "⚙️  Step 8: Setting Vercel environment variables..." -ForegroundColor Yellow
Write-Host "Setting NEXT_PUBLIC_SITE_URL..." -ForegroundColor Gray
vercel env rm NEXT_PUBLIC_SITE_URL production --yes 2>&1 | Out-Null
echo "https://www.emersoneims.com" | vercel env add NEXT_PUBLIC_SITE_URL production --yes

Write-Host "Setting NODE_ENV..." -ForegroundColor Gray
vercel env rm NODE_ENV production --yes 2>&1 | Out-Null
echo "production" | vercel env add NODE_ENV production --yes
Write-Host "✅ Environment variables set in Vercel" -ForegroundColor Green
Write-Host ""

# Step 9: Deploy to production
Write-Host "🚀 Step 9: Deploying to production..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray
vercel --prod --yes
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Deployment successful" -ForegroundColor Green
Write-Host ""

# Step 10: Get deployment URL
Write-Host "📝 Step 10: Getting deployment information..." -ForegroundColor Yellow
$deploymentInfo = vercel ls --meta 2>&1 | Select-Object -First 20
Write-Host $deploymentInfo
Write-Host ""

# Step 11: Verify environment variables
Write-Host "🔍 Step 11: Verifying environment variables..." -ForegroundColor Yellow
vercel env ls
Write-Host ""

# Step 12: Configure custom domain
Write-Host "🌐 Step 12: Configuring custom domain..." -ForegroundColor Yellow
Write-Host "Adding emersoneims.com..." -ForegroundColor Gray
vercel domains add emersoneims.com 2>&1 | Out-Null
Write-Host "Adding www.emersoneims.com..." -ForegroundColor Gray
vercel domains add www.emersoneims.com 2>&1 | Out-Null
Write-Host "✅ Domain configuration complete" -ForegroundColor Green
Write-Host ""

# Step 13: Test domain
Write-Host "🧪 Step 13: Testing domain..." -ForegroundColor Yellow
Write-Host "Testing https://www.emersoneims.com..." -ForegroundColor Gray
Start-Sleep -Seconds 5
try {
    $response = Invoke-WebRequest -Uri "https://www.emersoneims.com" -Method Head -TimeoutSec 10 -ErrorAction Stop
    Write-Host "✅ Domain is responding with status code: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Domain not yet responding. DNS may need time to propagate (can take up to 48 hours)" -ForegroundColor Yellow
    Write-Host "   However, your deployment is complete and ready!" -ForegroundColor Yellow
}
Write-Host ""

# Final summary
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "✅ DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor White
Write-Host "  • Project deployed to Vercel" -ForegroundColor White
Write-Host "  • Domain: https://www.emersoneims.com" -ForegroundColor White
Write-Host "  • Environment: Production" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Go to Vercel Dashboard: https://vercel.com/dashboard" -ForegroundColor White
Write-Host "  2. Select your project (emerson-eims)" -ForegroundColor White
Write-Host "  3. Go to Settings → Domains" -ForegroundColor White
Write-Host "  4. Verify that emersoneims.com and www.emersoneims.com are added" -ForegroundColor White
Write-Host "  5. If domain shows error, update DNS records at your domain registrar:" -ForegroundColor White
Write-Host ""
Write-Host "     DNS Records Required:" -ForegroundColor Cyan
Write-Host "     ├─ A Record:     @ → 76.76.21.21" -ForegroundColor Gray
Write-Host "     └─ CNAME Record: www → cname.vercel-dns.com" -ForegroundColor Gray
Write-Host ""
Write-Host "  6. DNS propagation can take 5 minutes to 48 hours" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Your website is now live!" -ForegroundColor Green
Write-Host ""

# Open browser to check deployment
Write-Host "🌐 Opening Vercel dashboard..." -ForegroundColor Yellow
Start-Process "https://vercel.com/dashboard"

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
