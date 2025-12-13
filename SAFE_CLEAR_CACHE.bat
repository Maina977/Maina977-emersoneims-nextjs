@echo off
title Safe Cache Clear - Kill Processes First
color 0A
echo ================================================
echo    SAFE CACHE CLEAR
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/3] Killing Node.js processes...
taskkill /f /im node.exe >nul 2>&1
if errorlevel 1 (
    echo   ✓ No Node.js processes found
) else (
    echo   ✓ Node.js processes killed
)

echo.
echo [2/3] Waiting for locks to release...
timeout /t 3 /nobreak >nul

echo.
echo [3/3] Clearing caches...

echo   Clearing .next...
if exist ".next" (
    rmdir /s /q ".next" 2>nul
    if exist ".next" (
        echo     ⚠️  .next locked - try closing VS Code/editors
    ) else (
        echo     ✓ .next cleared
    )
) else (
    echo     ✓ .next not found
)

echo   Clearing TypeScript build info...
if exist "tsconfig.tsbuildinfo" del /f "tsconfig.tsbuildinfo" 2>nul
if exist ".tsbuildinfo" del /f ".tsbuildinfo" 2>nul
echo     ✓ TypeScript build info cleared

echo.
echo ================================================
echo    ✅ CACHE CLEARED
echo ================================================
echo.
echo Next: Run npm run build
echo.
pause





