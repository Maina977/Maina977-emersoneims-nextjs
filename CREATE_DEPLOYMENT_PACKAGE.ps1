# Create Deployment Package for Viva Web Host
# This script prepares files for upload to your hosting server

Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   Creating Deployment Package" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Step 1: Ensure build exists
Write-Host "[1/4] Checking build..." -ForegroundColor Yellow
if (-not (Test-Path .next)) {
    Write-Host "Building application..." -ForegroundColor Yellow
    & npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Build failed!" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ Build verified" -ForegroundColor Green
Write-Host ""

# Step 2: Create deployment folder
Write-Host "[2/4] Creating deployment package..." -ForegroundColor Yellow
$deployFolder = "deployment-package"
if (Test-Path $deployFolder) {
    Remove-Item -Recurse -Force $deployFolder
}
New-Item -ItemType Directory -Path $deployFolder | Out-Null
Write-Host "✅ Deployment folder created" -ForegroundColor Green
Write-Host ""

# Step 3: Copy required files
Write-Host "[3/4] Copying files..." -ForegroundColor Yellow

# Copy build folder
Copy-Item -Recurse -Force .next $deployFolder\.next

# Copy package files
Copy-Item package.json $deployFolder\
Copy-Item package-lock.json $deployFolder\ -ErrorAction SilentlyContinue

# Copy configuration
Copy-Item next.config.ts $deployFolder\ -ErrorAction SilentlyContinue
Copy-Item next.config.js $deployFolder\ -ErrorAction SilentlyContinue

# Copy application code
if (Test-Path app) {
    Copy-Item -Recurse -Force app $deployFolder\app
}
if (Test-Path components) {
    Copy-Item -Recurse -Force components $deployFolder\components
}
if (Test-Path lib) {
    Copy-Item -Recurse -Force lib $deployFolder\lib
}
if (Test-Path types) {
    Copy-Item -Recurse -Force types $deployFolder\types
}
if (Test-Path public) {
    Copy-Item -Recurse -Force public $deployFolder\public
}

# Copy environment example
Copy-Item .env.example $deployFolder\.env.example -ErrorAction SilentlyContinue

Write-Host "✅ Files copied" -ForegroundColor Green
Write-Host ""

# Step 4: Create deployment instructions
Write-Host "[4/4] Creating deployment instructions..." -ForegroundColor Yellow

$instructions = @"
# Deployment Instructions for Viva Web Host

## Files Ready in: deployment-package/

### Step 1: Upload Files
Upload all files in 'deployment-package/' to your server:
- Via FTP: Upload to /public_html/ or your domain folder
- Via SSH: Use scp or rsync

### Step 2: On Server
```bash
cd /path/to/your/domain
npm install --production
```

### Step 3: Create .env file
Create .env file with:
NEXT_PUBLIC_SITE_URL=https://www.emersoneims.com
WORDPRESS_API_URL=https://www.emersoneims.com/wp-json/wp/v2
WORDPRESS_SITE_URL=https://www.emersoneims.com
NODE_ENV=production
PORT=3000

### Step 4: Start Application
```bash
npm start
# OR use PM2:
pm2 start npm --name "emerson-eims" -- start
pm2 save
```

### Step 5: Configure Reverse Proxy
See UPLOAD_TO_SERVER.md for Apache/Nginx configuration

## Alternative: Deploy to Vercel
If Node.js not available on server, deploy to Vercel:
npx vercel@latest --prod
Then point domain DNS to Vercel.
"@

$instructions | Out-File -FilePath "$deployFolder\DEPLOY_INSTRUCTIONS.txt" -Encoding UTF8

Write-Host "✅ Instructions created" -ForegroundColor Green
Write-Host ""

# Summary
Write-Host "════════════════════════════════════════" -ForegroundColor Green
Write-Host "   ✅ DEPLOYMENT PACKAGE READY!" -ForegroundColor Green
Write-Host "════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "Package location: $deployFolder\" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Upload '$deployFolder' folder to your server" -ForegroundColor White
Write-Host "  2. Run: npm install --production" -ForegroundColor White
Write-Host "  3. Create .env file" -ForegroundColor White
Write-Host "  4. Run: npm start" -ForegroundColor White
Write-Host ""
Write-Host "OR deploy to Vercel: npx vercel@latest --prod" -ForegroundColor Cyan
Write-Host ""
Write-Host "See: DEPLOYMENT_FOR_VIVA_HOST.md" -ForegroundColor Gray
Write-Host ""




