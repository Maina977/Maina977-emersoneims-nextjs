@echo off
title Build Without Cache Deletion
color 0A
echo ================================================
echo    BUILD WITHOUT CACHE DELETION
echo ================================================
echo.
echo This skips cache deletion and builds directly.
echo Use if cache folders are locked.
echo.
cd /d "C:\Users\PC\my-app"

echo [1/2] Killing Node.js processes...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo.
echo [2/2] Running build (skipping cache clear)...
call npm.cmd run build -- --no-lint
if errorlevel 1 (
    echo   ❌ Build failed!
    pause
    exit /b 1
) else (
    echo   ✓ Build successful!
)

echo.
pause













