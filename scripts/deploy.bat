@echo off
REM Deployment Script for Emerson EIMS (Windows Batch)
REM Deploys to Vercel Production

echo ========================================
echo   Emerson EIMS Deployment Script
echo   Domain: www.emersoneims.com
echo ========================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo [ERROR] package.json not found!
    echo Please run this script from the project root directory.
    exit /b 1
)

REM Check Node.js
echo [INFO] Checking prerequisites...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found! Please install Node.js 18+.
    exit /b 1
)
echo [OK] Node.js found

where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm not found!
    exit /b 1
)
echo [OK] npm found
echo.

REM Install dependencies if needed
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    call npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies!
        exit /b 1
    )
    echo [OK] Dependencies installed
    echo.
)

REM Build the project
echo [INFO] Building project...
echo This may take a few minutes...
echo.
call npx next build --webpack
if %errorlevel% neq 0 (
    echo [WARN] Webpack build failed, trying default build...
    call npm run build
    if %errorlevel% neq 0 (
        echo [ERROR] Build failed!
        exit /b 1
    )
)
echo [OK] Build successful
echo.

REM Check Vercel authentication
echo [INFO] Checking Vercel authentication...
call npx vercel@latest whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARN] Not authenticated with Vercel
    echo [INFO] Opening login page...
    echo.
    echo Please complete authentication in your browser.
    echo Press ENTER after logging in...
    pause
    call npx vercel@latest login
    if %errorlevel% neq 0 (
        echo [ERROR] Login failed or cancelled!
        exit /b 1
    )
)
echo [OK] Authenticated with Vercel
echo.

REM Deploy to Vercel
echo [INFO] Deploying to Vercel (production)...
echo Domain: www.emersoneims.com
echo.
call npx vercel@latest --prod --yes
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Deployment failed!
    echo Check the error messages above for details.
    exit /b 1
)

echo.
echo ========================================
echo   Deployment Successful!
echo ========================================
echo.
echo Next steps:
echo 1. Configure your domain in Vercel Dashboard
echo 2. Add DNS records as instructed by Vercel
echo 3. Wait for DNS propagation (may take up to 48 hours)
echo.
echo Visit: https://vercel.com/dashboard
echo.

pause


