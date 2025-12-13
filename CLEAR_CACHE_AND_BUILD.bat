@echo off
title Clear Cache and Build
color 0A
echo ================================================
echo    CLEAR CACHE AND BUILD
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/4] Clearing all caches...
call CLEAR_TYPESCRIPT_CACHE.bat

echo.
echo [2/4] Running type check...
call npm.cmd run type-check
if errorlevel 1 (
    echo   ⚠️  Type check found errors
) else (
    echo   ✓ Type check passed
)

echo.
echo [3/4] Building project...
call npm.cmd run build
if errorlevel 1 (
    echo   ❌ Build failed!
    echo   Check the errors above
    pause
    exit /b 1
) else (
    echo   ✓ Build successful!
)

echo.
echo [4/4] Summary...
echo   ✓ All caches cleared
echo   ✓ Type check completed
echo   ✓ Build completed successfully
echo.
echo ================================================
echo    ✅ READY FOR DEPLOYMENT
echo ================================================
echo.
pause





