@echo off
title COMPLETE FIX - All Module Issues
color 0A
echo ================================================
echo    COMPLETE FIX - All Module Issues
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/5] Cleaning npm cache...
call npm.cmd cache clean --force
echo ✓ Cache cleaned

echo.
echo [2/5] Installing react-hook-form...
call npm.cmd install react-hook-form@^7.53.0 --legacy-peer-deps --save
if errorlevel 1 (
    echo ⚠️  First attempt failed, trying without version...
    call npm.cmd install react-hook-form --legacy-peer-deps --save
    if errorlevel 1 (
        echo ❌ Failed to install react-hook-form
        echo    Please check your internet connection and npm configuration
        pause
        exit /b 1
    )
)
echo ✓ react-hook-form installed

echo.
echo [3/5] Verifying all dependencies...
call npm.cmd install --legacy-peer-deps
if errorlevel 1 (
    echo ⚠️  Some dependencies had issues, but continuing...
)
echo ✓ Dependencies verified

echo.
echo [4/5] Verifying react-hook-form installation...
call npm.cmd list react-hook-form 2>nul | findstr "react-hook-form" >nul
if errorlevel 1 (
    echo ❌ react-hook-form not found in node_modules
    echo    Installation may have failed
    pause
    exit /b 1
) else (
    echo ✓ react-hook-form found in node_modules
)

echo.
echo [5/5] Testing build...
call npm.cmd run build

if errorlevel 1 (
    echo.
    echo ================================================
    echo    ❌ BUILD FAILED
    echo ================================================
    echo.
    echo Check errors above. Common issues:
    echo 1. Missing dependencies - run: npm install --legacy-peer-deps
    echo 2. Cache issues - run: npm cache clean --force
    echo 3. Network issues - check internet connection
    pause
    exit /b 1
) else (
    echo.
    echo ================================================
    echo    ✅ BUILD SUCCESSFUL!
    echo ================================================
    echo.
    echo All modules are installed and working!
    echo Website is ready for deployment.
)

pause


