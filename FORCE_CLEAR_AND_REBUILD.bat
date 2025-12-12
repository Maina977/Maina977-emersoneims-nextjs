@echo off
title Force Clear Cache and Rebuild
color 0A
echo ================================================
echo    FORCE CLEAR CACHE AND REBUILD
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/5] Killing Node.js processes...
taskkill /f /im node.exe >nul 2>&1
if errorlevel 1 (
    echo   ✓ No Node.js processes running
) else (
    echo   ✓ Node.js processes terminated
)

echo.
echo Waiting 2 seconds for locks to release...
timeout /t 2 /nobreak >nul

echo.
echo [2/5] Clearing .next cache...
if exist ".next" (
    rmdir /s /q ".next" 2>nul
    if exist ".next" (
        echo   ⚠️  .next folder locked - may need to close VS Code/editors
        echo   Continuing anyway...
    ) else (
        echo   ✓ .next folder removed
    )
) else (
    echo   ✓ .next folder not found
)

echo.
echo [3/5] Clearing TypeScript build info...
if exist "tsconfig.tsbuildinfo" del /f "tsconfig.tsbuildinfo" 2>nul
if exist ".tsbuildinfo" del /f ".tsbuildinfo" 2>nul
echo   ✓ TypeScript build info cleared

echo.
echo [4/5] Skipping node_modules\.cache (often locked)...
echo   (Will be cleared on next npm install if needed)

echo.
echo [5/5] Running build...
call npm.cmd run build
if errorlevel 1 (
    echo   ❌ Build failed!
    echo   Review errors above
    pause
    exit /b 1
) else (
    echo   ✓ Build successful!
)

echo.
echo ================================================
echo    ✅ BUILD COMPLETE
echo ================================================
echo.
pause


