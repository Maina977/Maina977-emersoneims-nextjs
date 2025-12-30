# URGENT: Restore www.emersoneims.com Accessibility
# ================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "URGENT: Restoring www.emersoneims.com" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: DNS Diagnostics
Write-Host "Step 1: Checking DNS Configuration..." -ForegroundColor Green
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host "Checking www.emersoneims.com..." -ForegroundColor White
try {
    $www = Resolve-DnsName www.emersoneims.com -ErrorAction Stop
    Write-Host "✓ www.emersoneims.com resolves to:" -ForegroundColor Green
    $www | Format-Table Name, Type, IPAddress, NameHost -AutoSize
} catch {
    Write-Host "✗ www.emersoneims.com DNS resolution failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "Checking emersoneims.com..." -ForegroundColor White
try {
    $root = Resolve-DnsName emersoneims.com -ErrorAction Stop
    Write-Host "✓ emersoneims.com resolves to:" -ForegroundColor Green
    $root | Format-Table Name, Type, IPAddress, NameHost -AutoSize
} catch {
    Write-Host "✗ emersoneims.com DNS resolution failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""

# Step 2: Verify Vercel CLI
Write-Host "Step 2: Verifying Vercel Authentication..." -ForegroundColor Green
Write-Host "----------------------------------------" -ForegroundColor Gray
vercel whoami
Write-Host ""

# Step 3: Add Domains
Write-Host "Step 3: Ensuring Domains are Added to Vercel..." -ForegroundColor Green
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host "Adding emersoneims.com..." -ForegroundColor White
vercel domains add emersoneims.com --yes
Write-Host ""
Write-Host "Adding www.emersoneims.com..." -ForegroundColor White
vercel domains add www.emersoneims.com --yes
Write-Host ""

# Step 4: List Current Domains
Write-Host "Step 4: Listing Current Domain Configuration..." -ForegroundColor Green
Write-Host "----------------------------------------" -ForegroundColor Gray
vercel domains ls
Write-Host ""

# Step 5: Deploy to Production
Write-Host "Step 5: Deploying to Production..." -ForegroundColor Green
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host "Starting production deployment..." -ForegroundColor Yellow
vercel --prod --yes
Write-Host ""

# Step 6: Wait and Verify
Write-Host "Step 6: Verifying Site Accessibility..." -ForegroundColor Green
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host "Waiting 10 seconds for deployment to propagate..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "Testing HTTPS connectivity to www.emersoneims.com..." -ForegroundColor White
try {
    $response = Invoke-WebRequest -Uri "https://www.emersoneims.com" -Method Head -TimeoutSec 30 -ErrorAction Stop
    Write-Host "✓ Site is ACCESSIBLE!" -ForegroundColor Green
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "✗ Site accessibility test failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "Testing HTTPS connectivity to emersoneims.com..." -ForegroundColor White
try {
    $response = Invoke-WebRequest -Uri "https://emersoneims.com" -Method Head -TimeoutSec 30 -ErrorAction Stop
    Write-Host "✓ Site is ACCESSIBLE!" -ForegroundColor Green
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "✗ Site accessibility test failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Restoration Process Complete!" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "✓ VERIFICATION CHECKLIST:" -ForegroundColor Green
Write-Host "1. Check site manually: https://www.emersoneims.com" -ForegroundColor White
Write-Host "2. Check root domain: https://emersoneims.com" -ForegroundColor White
Write-Host "3. Verify DNS propagation: https://dnschecker.org" -ForegroundColor White
Write-Host "4. Check Vercel dashboard for domain conflicts" -ForegroundColor White
Write-Host "5. Monitor uptime with UptimeRobot or similar" -ForegroundColor White
Write-Host ""

Write-Host "⚠ IF ISSUES PERSIST:" -ForegroundColor Yellow
Write-Host "• DNS propagation can take 24-48 hours globally" -ForegroundColor White
Write-Host "• Check Vercel dashboard for conflicting domains" -ForegroundColor White
Write-Host "• Ensure domain registrar has correct DNS records:" -ForegroundColor White
Write-Host "  - Root (@): A record → 76.76.21.21" -ForegroundColor Cyan
Write-Host "  - www: CNAME → cname.vercel-dns.com" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to close"
