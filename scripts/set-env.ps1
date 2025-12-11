# PowerShell script to set environment variables for Emerson EIMS

# Set environment variables
$env:NEXT_PUBLIC_SITE_URL = "https://www.emersoneims.com"
$env:WORDPRESS_API_URL = "https://www.emersoneims.com/wp-json/wp/v2"
$env:WORDPRESS_SITE_URL = "https://www.emersoneims.com"
$env:NODE_ENV = "production"

# Optional WordPress integration flags
# $env:WORDPRESS_INTEGRATION = "true"
# $env:STATIC_EXPORT = "true"

Write-Host "✅ Environment variables set:" -ForegroundColor Green
Write-Host "   NEXT_PUBLIC_SITE_URL=$env:NEXT_PUBLIC_SITE_URL"
Write-Host "   WORDPRESS_API_URL=$env:WORDPRESS_API_URL"
Write-Host "   WORDPRESS_SITE_URL=$env:WORDPRESS_SITE_URL"
Write-Host "   NODE_ENV=$env:NODE_ENV"
Write-Host ""
Write-Host "🚀 Ready to build! Run: npm run build" -ForegroundColor Cyan




