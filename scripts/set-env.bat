@echo off
REM Script to set environment variables for Emerson EIMS (Windows)

REM Set environment variables
set NEXT_PUBLIC_SITE_URL=https://www.emersoneims.com
set WORDPRESS_API_URL=https://www.emersoneims.com/wp-json/wp/v2
set WORDPRESS_SITE_URL=https://www.emersoneims.com
set NODE_ENV=production

REM Optional WordPress integration flags
REM set WORDPRESS_INTEGRATION=true
REM set STATIC_EXPORT=true

echo ✅ Environment variables set:
echo    NEXT_PUBLIC_SITE_URL=%NEXT_PUBLIC_SITE_URL%
echo    WORDPRESS_API_URL=%WORDPRESS_API_URL%
echo    WORDPRESS_SITE_URL=%WORDPRESS_SITE_URL%
echo    NODE_ENV=%NODE_ENV%
echo.
echo 🚀 Ready to build! Run: npm run build




