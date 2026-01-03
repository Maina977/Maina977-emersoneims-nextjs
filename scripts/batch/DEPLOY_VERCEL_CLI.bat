@echo off
title Deploy to Vercel via CLI - Emerson EIMS
color 0A
echo ================================================
echo    DEPLOY TO VERCEL (CLI METHOD)
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo STEP 1: Install Vercel CLI (if not installed)
echo.
call npm.cmd install -g vercel
if errorlevel 1 (
    echo.
    echo ERROR: Failed to install Vercel CLI
    echo Please install manually: npm install -g vercel
    pause
    exit /b 1
)

echo.
echo ================================================
echo    STEP 2: Login to Vercel
echo ================================================
echo.
echo You will be asked to login.
echo Use your GitHub account to login.
echo.
pause

vercel login

echo.
echo ================================================
echo    STEP 3: Deploy to Vercel
echo ================================================
echo.
echo Deploying project...
echo.

vercel --prod --yes

if errorlevel 1 (
    echo.
    echo ================================================
    echo   ⚠️  AUTOMATIC DEPLOYMENT FAILED
    echo ================================================
    echo.
    echo Running interactive deployment...
    echo.
    vercel
) else (
    echo.
    echo ================================================
    echo   ✅ SUCCESS! DEPLOYED TO VERCEL!
    echo ================================================
    echo.
    echo Your website is now live!
    echo Check the URL above or Vercel dashboard
    echo.
)

pause















