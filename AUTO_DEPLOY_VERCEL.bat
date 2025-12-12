@echo off
title Auto-Deploy to Vercel - Emerson EIMS
color 0B
echo ================================================
echo    AUTOMATIC DEPLOYMENT TO VERCEL
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/4] Checking Vercel CLI...
where vercel >nul 2>&1
if errorlevel 1 (
    echo Vercel CLI not found. Installing...
    call npm.cmd install -g vercel
    if errorlevel 1 (
        echo ERROR: Failed to install Vercel CLI
        echo.
        echo Please install manually:
        echo npm install -g vercel
        echo.
        pause
        exit /b 1
    )
    echo ✓ Vercel CLI installed
) else (
    echo ✓ Vercel CLI found
)

echo.
echo [2/4] Checking git status...
git status >nul 2>&1
if errorlevel 1 (
    echo ERROR: Not a git repository
    echo Please run CREATE_REPO_AND_PUSH.bat first
    pause
    exit /b 1
)

echo ✓ Git repository found

echo.
echo [3/4] Building project...
call npm.cmd run build
if errorlevel 1 (
    echo WARNING: Build failed, but continuing with deployment...
) else (
    echo ✓ Build successful
)

echo.
echo [4/4] Deploying to Vercel...
echo.
echo IMPORTANT: If prompted:
echo - Login: Use your GitHub account
echo - Link to existing project? Yes (if you created one)
echo - Project name: emersoneims-nextjs
echo - Production? Yes
echo.
pause

vercel --prod

if errorlevel 1 (
    echo.
    echo ================================================
    echo   ⚠️  DEPLOYMENT FAILED
    echo ================================================
    echo.
    echo Trying interactive deployment...
    vercel
) else (
    echo.
    echo ================================================
    echo   ✅ DEPLOYED TO VERCEL!
    echo ================================================
    echo.
    echo Your website is now live!
    echo Check Vercel dashboard for your URL
    echo.
)

pause


