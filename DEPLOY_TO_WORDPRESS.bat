@echo off
title Deploy to WordPress - Emerson EIMS
color 0A
echo ================================================
echo    DEPLOYING TO WORDPRESS
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/5] Setting WordPress integration mode...
set WORDPRESS_INTEGRATION=true
set STATIC_EXPORT=true

echo.
echo [2/5] Installing dependencies...
call npm.cmd install --legacy-peer-deps
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [3/5] Building static export...
call npm.cmd run build
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo [4/5] Build complete! Files in: out\ folder
echo.
echo [5/5] Next steps:
echo.
echo 1. Upload the 'out' folder to WordPress:
echo    - Via FTP: Upload to /wp-content/themes/your-theme/
echo    - Via cPanel: Upload to public_html/
echo    - Via WordPress: Use static site plugin
echo.
echo 2. OR deploy to Vercel (Recommended):
echo    - Push to GitHub first
echo    - Import to Vercel
echo    - Auto-deploys!
echo.
echo ================================================
echo   STATIC FILES READY IN: out\ folder
echo ================================================
echo.
pause

