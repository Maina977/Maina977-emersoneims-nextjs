@echo off
title Emerson EIMS - Vercel Deployment
color 0A
cls
echo.
echo ========================================
echo   Emerson EIMS - Vercel Deployment
echo   Domain: www.emersoneims.com
echo ========================================
echo.
echo [STEP 1] Changing to project directory...
cd /d "%~dp0"
if errorlevel 1 (
    echo [ERROR] Failed to change directory!
    echo Trying alternative path...
    cd /d C:\Users\PC\my-app
    if errorlevel 1 (
        echo [ERROR] Cannot find project directory!
        echo Please make sure you're in the correct folder.
        pause
        exit /b 1
    )
)
echo [OK] Current directory: %CD%
echo.
if not exist package.json (
    echo [ERROR] package.json not found in this directory!
    echo Current directory: %CD%
    echo.
    echo Please navigate to: C:\Users\PC\my-app
    pause
    exit /b 1
)
echo [OK] Found package.json - Project directory confirmed!
echo.
echo [STEP 2] Starting Vercel deployment...
echo This may take a few minutes. Please wait...
echo.
echo ========================================
echo.
npx vercel@latest --prod
echo.
echo ========================================
echo.
echo Deployment process completed.
echo.
pause
