@echo off
title Emerson EIMS - Build and Start Server
color 0A
echo ================================================
echo    EMERSON EIMS - BUILD AND DEPLOYMENT READY
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/4] Checking dependencies...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm.cmd install --legacy-peer-deps
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo Dependencies already installed.
)

echo.
echo [2/4] Building project...
call npm.cmd run build
if errorlevel 1 (
    echo ERROR: Build failed!
    echo Check the errors above and fix them.
    pause
    exit /b 1
)

echo.
echo [3/4] Build successful!
echo.
echo [4/4] Starting development server...
echo.
echo ================================================
echo   SERVER STARTING AT: http://localhost:3000
echo ================================================
echo.
echo Press Ctrl+C to stop the server
echo.

call npm.cmd run dev

pause

