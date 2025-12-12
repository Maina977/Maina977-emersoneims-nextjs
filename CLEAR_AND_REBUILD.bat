@echo off
title Clear Cache and Rebuild - Force Full TypeScript Rebuild
color 0A
echo ================================================
echo    CLEAR CACHE AND REBUILD
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/3] Killing Node.js processes...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo.
echo [2/3] Clearing caches...
rmdir /s /q .next 2>nul
if exist node_modules\.cache rmdir /s /q node_modules\.cache 2>nul
if exist tsconfig.tsbuildinfo del /f tsconfig.tsbuildinfo 2>nul
if exist .tsbuildinfo del /f .tsbuildinfo 2>nul
echo   ✓ Caches cleared

echo.
echo [3/3] Verifying tsconfig.json...
findstr /C:"\"incremental\"" tsconfig.json >nul
if errorlevel 1 (
    echo   ⚠️  incremental setting not found in tsconfig.json
) else (
    echo   ✓ tsconfig.json found
    findstr /C:"\"incremental\": false" tsconfig.json >nul
    if errorlevel 1 (
        echo   ⚠️  incremental is set to true - should be false for full rebuild
    ) else (
        echo   ✓ incremental is false (full rebuild enabled)
    )
)

echo.
echo [3/3] Running build...
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
echo Note: After successful build, you can change
echo "incremental": false to "incremental": true
echo in tsconfig.json for faster dev builds.
echo.
pause

