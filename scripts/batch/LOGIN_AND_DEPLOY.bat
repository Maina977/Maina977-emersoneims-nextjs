@echo off
title Emerson EIMS - Login and Deploy
color 0B
cls
echo.
echo ========================================
echo   Emerson EIMS - Vercel Deployment
echo   Domain: www.emersoneims.com
echo ========================================
echo.
echo [STEP 1] Navigating to project directory...
cd /d C:\Users\PC\my-app
if errorlevel 1 (
    echo [ERROR] Cannot find project directory!
    echo Please make sure C:\Users\PC\my-app exists.
    pause
    exit /b 1
)
echo [OK] Current directory: %CD%
echo.
if not exist package.json (
    echo [ERROR] package.json not found!
    echo Current directory: %CD%
    pause
    exit /b 1
)
echo [OK] Project files found!
echo.
echo ========================================
echo [STEP 2] Checking Vercel authentication...
echo ========================================
echo.
npx vercel@latest whoami >nul 2>&1
if errorlevel 1 (
    echo [INFO] Not logged in. Starting login process...
    echo.
    echo Please complete authentication in your browser.
    echo Press ENTER after you see "Success! Authentication complete"
    echo.
    pause
    npx vercel@latest login
    if errorlevel 1 (
        echo [ERROR] Login failed or cancelled!
        pause
        exit /b 1
    )
) else (
    echo [OK] Already logged in to Vercel!
)
echo.
echo ========================================
echo [STEP 3] Deploying to Production...
echo ========================================
echo.
echo Domain: www.emersoneims.com
echo This may take a few minutes...
echo.
npx vercel@latest --prod
echo.
echo ========================================
echo.
if errorlevel 1 (
    echo [ERROR] Deployment failed!
    echo Check the error messages above.
) else (
    echo [SUCCESS] Deployment completed!
    echo.
    echo Next steps:
    echo 1. Visit https://vercel.com/dashboard
    echo 2. Add domain: www.emersoneims.com
    echo 3. Configure DNS as instructed
)
echo.
pause


