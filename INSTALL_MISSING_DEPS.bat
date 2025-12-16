@echo off
title Install Missing Dependencies
color 0A
echo ================================================
echo    Installing Missing Dependencies
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo Installing react-hook-form...
call npm.cmd install react-hook-form@^7.53.0 --legacy-peer-deps

if errorlevel 1 (
    echo ❌ Failed to install react-hook-form
    pause
    exit /b 1
)

echo.
echo ✅ Dependencies installed successfully!
echo.
pause













